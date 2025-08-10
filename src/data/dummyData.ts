import { Subject, Chapter, SPoint } from '@/stores/contentStore'

export const dummySubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Fundamental mathematical concepts and problem-solving',
    chapterCount: 5,
    spointCount: 150,
    visibility: 'personal'
  },
  {
    id: '2',
    name: 'Biology',
    description: 'Life sciences, organisms, and biological systems',
    chapterCount: 8,
    spointCount: 240,
    visibility: 'global'
  },
  {
    id: '3',
    name: 'Chemistry',
    description: 'Matter, its properties, and chemical reactions',
    chapterCount: 6,
    spointCount: 180,
    visibility: 'personal'
  },
  {
    id: '4',
    name: 'Physics',
    description: 'Study of matter, energy, and their interactions',
    chapterCount: 7,
    spointCount: 210,
    visibility: 'global'
  }
]

export const dummyChapters: Chapter[] = [
  // Mathematics chapters
  {
    id: '1-1',
    subjectId: '1',
    name: 'Algebra Basics',
    description: 'Introduction to algebraic concepts',
    lectureCount: 4,
    spointCount: 40
  },
  {
    id: '1-2',
    subjectId: '1',
    name: 'Geometry',
    description: 'Shapes, angles, and spatial reasoning',
    lectureCount: 3,
    spointCount: 35
  },
  {
    id: '1-3',
    subjectId: '1',
    name: 'Calculus I',
    description: 'Limits, derivatives, and basic integration',
    lectureCount: 5,
    spointCount: 45
  },
  // Biology chapters
  {
    id: '2-1',
    subjectId: '2',
    name: 'Cell Biology',
    description: 'Structure and function of cells',
    lectureCount: 5,
    spointCount: 60
  },
  {
    id: '2-2',
    subjectId: '2',
    name: 'Genetics',
    description: 'DNA, heredity, and genetic variation',
    lectureCount: 4,
    spointCount: 50
  },
  {
    id: '2-3',
    subjectId: '2',
    name: 'Ecology',
    description: 'Ecosystems and environmental interactions',
    lectureCount: 3,
    spointCount: 40
  }
]

export const dummySpoints: SPoint[] = [
  {
    id: 'sp-1',
    content: '2 + 2 = 4',
    pointId: 'p-1',
    wrongCount: 0,
    confidence: 5,
    lastPracticed: new Date('2024-01-15')
  },
  {
    id: 'sp-2',
    content: 'The mitochondria is the powerhouse of the cell',
    pointId: 'p-2',
    wrongCount: 2,
    confidence: 3,
    lastPracticed: new Date('2024-01-14')
  },
  {
    id: 'sp-3',
    content: 'Water formula is H2O',
    pointId: 'p-3',
    wrongCount: 0,
    confidence: 5,
    lastPracticed: new Date('2024-01-13')
  },
  {
    id: 'sp-4',
    content: 'Newton\'s first law: An object at rest stays at rest',
    pointId: 'p-4',
    wrongCount: 1,
    confidence: 4,
    lastPracticed: new Date('2024-01-12')
  },
  {
    id: 'sp-5',
    content: 'Photosynthesis converts light energy to chemical energy',
    pointId: 'p-5',
    wrongCount: 3,
    confidence: 2,
    lastPracticed: new Date('2024-01-10')
  }
]

export interface MCQ {
  id: string
  question: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  spointId: string
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  spointId: string
}

export const dummyMCQs: MCQ[] = [
  {
    id: 'mcq-1',
    question: 'What is 2 + 2?',
    options: [
      { id: 'opt-1', text: '3', isCorrect: false },
      { id: 'opt-2', text: '4', isCorrect: true },
      { id: 'opt-3', text: '5', isCorrect: false },
      { id: 'opt-4', text: '6', isCorrect: false }
    ],
    spointId: 'sp-1'
  },
  {
    id: 'mcq-2',
    question: 'What is the powerhouse of the cell?',
    options: [
      { id: 'opt-5', text: 'Nucleus', isCorrect: false },
      { id: 'opt-6', text: 'Mitochondria', isCorrect: true },
      { id: 'opt-7', text: 'Ribosome', isCorrect: false },
      { id: 'opt-8', text: 'Golgi apparatus', isCorrect: false }
    ],
    spointId: 'sp-2'
  },
  {
    id: 'mcq-3',
    question: 'What is the chemical formula for water?',
    options: [
      { id: 'opt-9', text: 'CO2', isCorrect: false },
      { id: 'opt-10', text: 'H2O', isCorrect: true },
      { id: 'opt-11', text: 'O2', isCorrect: false },
      { id: 'opt-12', text: 'H2', isCorrect: false }
    ],
    spointId: 'sp-3'
  }
]

export const dummyFlashcards: Flashcard[] = [
  {
    id: 'fc-1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    spointId: 'sp-6'
  },
  {
    id: 'fc-2',
    question: 'Define photosynthesis',
    answer: 'The process by which plants convert light energy into chemical energy',
    spointId: 'sp-5'
  },
  {
    id: 'fc-3',
    question: 'What is Newton\'s first law?',
    answer: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force',
    spointId: 'sp-4'
  }
]

export const dummyMetrics = {
  totalSpoints: 780,
  spointsStudied: 450,
  spointsMastered: 320,
  accuracyRate: 78,
  studyStreak: 7,
  totalPracticeTime: 1250, // minutes
  weakAreas: ['Genetics', 'Calculus', 'Organic Chemistry'],
  strongAreas: ['Algebra', 'Cell Biology', 'Mechanics']
}

export const dummyPerformanceData = [
  { date: '2024-01-10', accuracy: 65, items: 25 },
  { date: '2024-01-11', accuracy: 70, items: 30 },
  { date: '2024-01-12', accuracy: 72, items: 28 },
  { date: '2024-01-13', accuracy: 75, items: 35 },
  { date: '2024-01-14', accuracy: 78, items: 40 },
  { date: '2024-01-15', accuracy: 80, items: 38 },
  { date: '2024-01-16', accuracy: 82, items: 42 }
]