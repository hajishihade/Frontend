import { create } from 'zustand'

export interface Session {
  id: string
  name: string
  mode: 'study' | 'practice' | 'mix'
  status: 'draft' | 'active' | 'completed'
  createdAt: Date
  itemCount: number
  progress: number
}

interface SessionState {
  sessions: Session[]
  currentSession: Session | null
  
  createSession: (data: Omit<Session, 'id' | 'createdAt' | 'progress'>) => void
  selectSession: (id: string) => void
  updateProgress: (id: string, progress: number) => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [
    {
      id: '1',
      name: 'Mathematics Review',
      mode: 'study',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      itemCount: 25,
      progress: 60
    },
    {
      id: '2',
      name: 'Biology Practice',
      mode: 'practice',
      status: 'completed',
      createdAt: new Date('2024-01-14'),
      itemCount: 30,
      progress: 100
    },
    {
      id: '3',
      name: 'Chemistry Mixed Session',
      mode: 'mix',
      status: 'draft',
      createdAt: new Date('2024-01-16'),
      itemCount: 20,
      progress: 0
    }
  ],
  currentSession: null,
  
  createSession: (data) => {
    const newSession: Session = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      progress: 0
    }
    set(state => ({
      sessions: [...state.sessions, newSession]
    }))
  },
  
  selectSession: (id) => {
    const session = get().sessions.find(s => s.id === id)
    set({ currentSession: session || null })
  },
  
  updateProgress: (id, progress) => {
    set(state => ({
      sessions: state.sessions.map(s => 
        s.id === id ? { ...s, progress } : s
      )
    }))
  }
}))