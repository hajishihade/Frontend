import { create } from 'zustand'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Dummy authentication - any email/password works
    set({
      user: {
        id: '1',
        email,
        firstName: 'Test',
        lastName: 'User'
      },
      isAuthenticated: true
    })
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false })
  }
}))