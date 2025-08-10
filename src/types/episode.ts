// Episode page type definitions

export interface TreeNode {
  id: string
  name: string
  type: 'module' | 'section' | 'spoint'
  children?: TreeNode[]
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation?: string
}

export interface StudyContent {
  time: number
  blocks: Array<{
    type: string
    data: {
      text?: string
      level?: number
      style?: string
      items?: string[]
      [key: string]: any
    }
  }>
  version?: string
}

export interface PracticeQuestion {
  id: number
  question: string
  options: string[]
  correct: number
}

export type EditorMode = 'study' | 'practice' | 'mix'
export type FontSize = 'small' | 'medium' | 'large'
export type TextAlignment = 'left' | 'center' | 'right' | 'justify'

export interface SampleContent {
  studyContent: StudyContent
  practiceQuestions: PracticeQuestion[]
  mixContent: {
    study: StudyContent
    practice: PracticeQuestion[]
  }
}