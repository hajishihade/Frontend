/**
 * Centralized API Client with proper error handling, retry logic, and interceptors
 * Following best practices for large-scale applications
 */

export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  retryAttempts?: number
  retryDelay?: number
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

export class ApiClient {
  private config: Required<ApiConfig>
  private interceptors: {
    request: Array<(config: RequestInit) => RequestInit | Promise<RequestInit>>
    response: Array<(response: Response) => Response | Promise<Response>>
    error: Array<(error: ApiError) => void>
  }

  constructor(config: ApiConfig) {
    this.config = {
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: config.headers || {},
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000
    }

    this.interceptors = {
      request: [],
      response: [],
      error: []
    }
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>
  ): void {
    this.interceptors.request.push(interceptor)
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>
  ): void {
    this.interceptors.response.push(interceptor)
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: (error: ApiError) => void): void {
    this.interceptors.error.push(interceptor)
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let modifiedConfig = config
    for (const interceptor of this.interceptors.request) {
      modifiedConfig = await interceptor(modifiedConfig)
    }
    return modifiedConfig
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response
    for (const interceptor of this.interceptors.response) {
      modifiedResponse = await interceptor(modifiedResponse)
    }
    return modifiedResponse
  }

  /**
   * Handle errors
   */
  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      code: error.code,
      status: error.status,
      details: error
    }

    // Call error interceptors
    this.interceptors.error.forEach(interceptor => interceptor(apiError))

    return apiError
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryRequest<T>(
    fn: () => Promise<T>,
    attempts: number = this.config.retryAttempts
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      if (attempts > 1) {
        await new Promise(resolve => 
          setTimeout(resolve, this.config.retryDelay * (this.config.retryAttempts - attempts + 1))
        )
        return this.retryRequest(fn, attempts - 1)
      }
      throw error
    }
  }

  /**
   * Build full URL
   */
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint
    }
    return `${this.config.baseURL}${endpoint}`
  }

  /**
   * Create abort controller with timeout
   */
  private createAbortController(): AbortController {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), this.config.timeout)
    return controller
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = this.createAbortController()
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...(options.headers || {})
      },
      signal: controller.signal
    }

    // Apply request interceptors
    const modifiedConfig = await this.applyRequestInterceptors(config)

    return this.retryRequest(async () => {
      try {
        const response = await fetch(this.buildURL(endpoint), modifiedConfig)
        
        // Apply response interceptors
        const modifiedResponse = await this.applyResponseInterceptors(response)

        if (!modifiedResponse.ok) {
          throw {
            message: `HTTP error! status: ${modifiedResponse.status}`,
            status: modifiedResponse.status,
            statusText: modifiedResponse.statusText
          }
        }

        const data = await modifiedResponse.json()

        return {
          data,
          status: modifiedResponse.status,
          statusText: modifiedResponse.statusText,
          headers: modifiedResponse.headers
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw this.handleError({
            message: 'Request timeout',
            code: 'TIMEOUT'
          })
        }
        throw this.handleError(error)
      }
    })
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params 
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint

    return this.request<T>(url, {
      method: 'GET'
    })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    })
  }

  /**
   * Upload file
   */
  async upload<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    // Note: Don't set Content-Type for FormData
    const headers = { ...this.config.headers }
    delete headers['Content-Type']

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers
    })
  }

  /**
   * Download file
   */
  async download(endpoint: string, filename?: string): Promise<void> {
    const response = await fetch(this.buildURL(endpoint), {
      headers: this.config.headers
    })

    if (!response.ok) {
      throw this.handleError({
        message: `Download failed: ${response.statusText}`,
        status: response.status
      })
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'download'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

// Create singleton instance
const apiClient = new ApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'X-App-Version': process.env.REACT_APP_VERSION || '1.0.0'
  }
})

// Add auth interceptor
apiClient.addRequestInterceptor((config) => {
  const token = localStorage.getItem('auth_token')
  if (token && config.headers) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Add error logging interceptor
apiClient.addErrorInterceptor((error) => {
  console.error('[API Error]', error)
  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // sendToMonitoring(error)
  }
})

export default apiClient