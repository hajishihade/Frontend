import { create } from 'zustand'
import { dummySubjects, dummyChapters, dummySpoints } from '@/data/dummyData'

export interface Subject {
  id: string
  name: string
  description: string
  chapterCount: number
  spointCount: number
  visibility: 'personal' | 'global'
}

export interface Chapter {
  id: string
  subjectId: string
  name: string
  description: string
  lectureCount: number
  spointCount: number
}

export interface SPoint {
  id: string
  content: string
  pointId: string
  wrongCount: number
  confidence: number
  lastPracticed?: Date
}

interface ContentState {
  subjects: Subject[]
  chapters: Chapter[]
  spoints: SPoint[]
  currentSubject: Subject | null
  
  fetchSubjects: () => void
  selectSubject: (id: string) => void
  getChaptersBySubject: (subjectId: string) => Chapter[]
}

export const useContentStore = create<ContentState>((set, get) => ({
  subjects: dummySubjects,
  chapters: dummyChapters,
  spoints: dummySpoints,
  currentSubject: null,
  
  fetchSubjects: () => {
    // Simulate fetching - already loaded from dummy data
    set({ subjects: dummySubjects })
  },
  
  selectSubject: (id: string) => {
    const subject = get().subjects.find(s => s.id === id)
    set({ currentSubject: subject || null })
  },
  
  getChaptersBySubject: (subjectId: string) => {
    return get().chapters.filter(c => c.subjectId === subjectId)
  }
}))