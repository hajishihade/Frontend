import apiClient from './ApiClient'
import type { 
  TreeNode, 
  StudyContent, 
  QuizQuestion 
} from '../../types/episode'

// Additional types for the service
interface QuizType {
  type: 'mcq' | 'true-false' | 'fill-blank'
}

interface QuizStats {
  totalQuizzes: number
  averageScore: number
  bestScore: number
}

/**
 * Episode Service - Handles all Episode-related API calls
 */
export class EpisodeService {
  private readonly basePath = '/episodes'

  /**
   * Get episode tree structure
   */
  async getEpisodeTree(episodeId: string): Promise<TreeNode[]> {
    const response = await apiClient.get<TreeNode[]>(
      `${this.basePath}/${episodeId}/tree`
    )
    return response.data
  }

  /**
   * Get study content for a specific spoint
   */
  async getStudyContent(episodeId: string, spointId: string): Promise<StudyContent> {
    const response = await apiClient.get<StudyContent>(
      `${this.basePath}/${episodeId}/spoints/${spointId}/content`
    )
    return response.data
  }

  /**
   * Save study content
   */
  async saveStudyContent(
    episodeId: string, 
    spointId: string, 
    content: StudyContent
  ): Promise<void> {
    await apiClient.put(
      `${this.basePath}/${episodeId}/spoints/${spointId}/content`,
      content
    )
  }

  /**
   * Get quiz questions for a topic
   */
  async getQuizQuestions(
    episodeId: string,
    topicId: string,
    quizType?: QuizType
  ): Promise<QuizQuestion[]> {
    const params = quizType ? { type: quizType } : undefined
    const response = await apiClient.get<QuizQuestion[]>(
      `${this.basePath}/${episodeId}/topics/${topicId}/quiz`,
      params
    )
    return response.data
  }

  /**
   * Generate quiz questions using AI
   */
  async generateQuizQuestions(
    episodeId: string,
    content: string,
    options: {
      count?: number
      type?: QuizType
      difficulty?: 'easy' | 'medium' | 'hard'
    } = {}
  ): Promise<QuizQuestion[]> {
    const response = await apiClient.post<QuizQuestion[]>(
      `${this.basePath}/${episodeId}/quiz/generate`,
      {
        content,
        ...options
      }
    )
    return response.data
  }

  /**
   * Submit quiz results
   */
  async submitQuizResults(
    episodeId: string,
    results: {
      questions: QuizQuestion[]
      answers: Map<string, string>
      score: number
      duration: number
    }
  ): Promise<QuizStats> {
    const response = await apiClient.post<QuizStats>(
      `${this.basePath}/${episodeId}/quiz/submit`,
      {
        ...results,
        answers: Array.from(results.answers.entries())
      }
    )
    return response.data
  }

  /**
   * Get user progress for an episode
   */
  async getUserProgress(episodeId: string): Promise<{
    completedSpoints: string[]
    quizStats: QuizStats
    lastAccessed: string
  }> {
    const response = await apiClient.get(
      `${this.basePath}/${episodeId}/progress`
    )
    return response.data
  }

  /**
   * Update spoint completion status
   */
  async updateSpointCompletion(
    episodeId: string,
    spointId: string,
    completed: boolean
  ): Promise<void> {
    await apiClient.patch(
      `${this.basePath}/${episodeId}/spoints/${spointId}/completion`,
      { completed }
    )
  }

  /**
   * Get episode metadata
   */
  async getEpisodeMetadata(episodeId: string): Promise<{
    id: string
    title: string
    description: string
    duration: number
    difficulty: string
    tags: string[]
  }> {
    const response = await apiClient.get(
      `${this.basePath}/${episodeId}/metadata`
    )
    return response.data
  }

  /**
   * Search episodes
   */
  async searchEpisodes(query: string, filters?: {
    difficulty?: string[]
    tags?: string[]
    duration?: { min?: number; max?: number }
  }): Promise<Array<{
    id: string
    title: string
    description: string
    relevance: number
  }>> {
    const response = await apiClient.get(
      `${this.basePath}/search`,
      { q: query, ...filters }
    )
    return response.data
  }

  /**
   * Get recommended episodes
   */
  async getRecommendedEpisodes(episodeId: string): Promise<Array<{
    id: string
    title: string
    reason: string
  }>> {
    const response = await apiClient.get(
      `${this.basePath}/${episodeId}/recommendations`
    )
    return response.data
  }

  /**
   * Export episode content
   */
  async exportEpisode(
    episodeId: string,
    format: 'pdf' | 'markdown' | 'json'
  ): Promise<void> {
    await apiClient.download(
      `${this.basePath}/${episodeId}/export?format=${format}`,
      `episode-${episodeId}.${format}`
    )
  }

  /**
   * Import episode content
   */
  async importEpisode(file: File): Promise<{
    episodeId: string
    success: boolean
    errors?: string[]
  }> {
    const response = await apiClient.upload(
      `${this.basePath}/import`,
      file
    )
    return response.data
  }
}

// Export singleton instance
export const episodeService = new EpisodeService()

// Export as default for convenience
export default episodeService