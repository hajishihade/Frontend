import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TreeNode, EditorMode, FontSize, TextAlignment } from '../types/episode'
import { TEXT_COLORS, HIGHLIGHT_COLORS, EDITOR_CONFIG, SIDEBAR_WIDTH, FONT_SIZES } from '../constants/episode'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Menu,
  MenuItem,
  Checkbox
} from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  Link,
  Image,
  Undo,
  Redo,
  Save,
  ChevronLeft,
  ChevronRight,
  Close,
  Check,
  CheckCircle,
  RadioButtonUnchecked,
  FormatColorText,
  FormatColorFill,
  FormatClear,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatIndentDecrease,
  FormatIndentIncrease,
  Subscript,
  Superscript,
  TableChart,
  ViewAgenda,
  CreditCard,
  Notes,
  Add,
  Quiz,
  AccountTree,
  TextFields,
  BubbleChart
} from '@mui/icons-material'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import ListTool from '@editorjs/list'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import Table from '@editorjs/table'
import Checklist from '@editorjs/checklist'
import { useThemeStore } from '../stores/themeStore'

// Tree structure that maps to EditorJS blocks for granular navigation
// Each spoint corresponds to a block in the editor
const contentHierarchy: TreeNode[] = [
  {
    id: 'module-1',
    name: 'Cell Biology',
    type: 'module' as const,
    children: [
      {
        id: 'section-1',
        name: 'Introduction',
        type: 'section' as const,
        children: [
          { id: 'block-1', name: 'Introduction to Cell Biology', type: 'spoint' as const }
        ]
      },
      {
        id: 'section-2',
        name: 'Mitochondria',
        type: 'section' as const,
        children: [
          { id: 'block-2', name: 'Powerhouse of the cell', type: 'spoint' as const },
          { id: 'block-3', name: 'ATP - Energy currency', type: 'spoint' as const },
          { id: 'block-4', name: 'Mitochondrial structure', type: 'spoint' as const }
        ]
      },
      {
        id: 'section-3',
        name: 'Nucleus',
        type: 'section' as const,
        children: [
          { id: 'block-5', name: 'Nuclear Organization', type: 'spoint' as const },
          { id: 'block-6', name: 'DNA and Chromatin', type: 'spoint' as const },
          { id: 'block-7', name: 'Nuclear Pores', type: 'spoint' as const }
        ]
      }
    ]
  }
]

// Specialized Flashcards for each spoint
const spointFlashcards: Record<string, any> = {
  'block-1': {
    id: 'flash-1',
    question: 'What is the fundamental unit of life that cell biology studies?',
    answer: 'The cell - the basic structural and functional unit of all living organisms. Cell biology examines how cells work, their structure, function, and behavior.',
    category: 'Basic Concepts'
  },
  'block-2': {
    id: 'flash-2',
    question: 'Why are mitochondria called the "powerhouse of the cell"?',
    answer: 'Mitochondria generate most of the cell\'s supply of ATP (adenosine triphosphate), which is used as a source of chemical energy. They convert nutrients into energy through cellular respiration.',
    category: 'Organelles'
  },
  'block-3': {
    id: 'flash-3',
    question: 'What is ATP and what role does it play in cells?',
    answer: 'ATP (Adenosine Triphosphate) is the primary energy currency of cells. It stores and transfers energy for cellular processes like muscle contraction, protein synthesis, and active transport.',
    category: 'Biochemistry'
  },
  'block-4': {
    id: 'flash-4',
    question: 'Describe the key structural components of mitochondria.',
    answer: 'Mitochondria have: 1) Outer membrane (smooth), 2) Inner membrane (folded into cristae), 3) Intermembrane space, 4) Matrix (innermost compartment containing enzymes, DNA, and ribosomes).',
    category: 'Structure'
  },
  'block-5': {
    id: 'flash-5',
    question: 'What is the primary function of the nucleus in a cell?',
    answer: 'The nucleus controls and regulates cellular activities, stores the cell\'s hereditary material (DNA), and coordinates growth, metabolism, protein synthesis, and cell division.',
    category: 'Organelles'
  },
  'block-6': {
    id: 'flash-6',
    question: 'How is DNA organized in the nucleus and what happens during cell division?',
    answer: 'DNA is organized as chromatin (DNA + proteins) during interphase. During cell division, chromatin condenses into visible chromosomes to ensure accurate distribution of genetic material to daughter cells.',
    category: 'Genetics'
  },
  'block-7': {
    id: 'flash-7',
    question: 'What are nuclear pores and what is their function?',
    answer: 'Nuclear pores are large protein complexes that span the nuclear envelope. They regulate the transport of molecules between the nucleus and cytoplasm, allowing proteins, RNA, and other molecules to move in and out.',
    category: 'Transport'
  }
}

// Specialized MCQs for each spoint (can have multiple questions per spoint)
const spointMCQs: Record<string, any> = {
  'block-1': {
    id: 'mcq-1',
    question: 'What is cell biology primarily concerned with studying?',
    options: [
      'Only plant cells',
      'The structure and function of cells',
      'Only animal tissues',
      'Chemical reactions in non-living matter'
    ],
    correct: 1,
    explanation: 'Cell biology is the study of cell structure and function, and it revolves around the concept that the cell is the fundamental unit of life.'
  },
  'block-2': {
    id: 'mcq-2',
    question: 'Why are mitochondria called the "powerhouse of the cell"?',
    options: [
      'They store genetic information',
      'They produce ATP through cellular respiration',
      'They control cell division',
      'They synthesize proteins'
    ],
    correct: 1,
    explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP (energy) through the process of cellular respiration.'
  },
  'block-3': {
    id: 'mcq-3',
    question: 'What does ATP stand for?',
    options: [
      'Adenosine Triphosphate',
      'Active Transport Protein',
      'Amino Tri-Peptide',
      'Automated Tissue Process'
    ],
    correct: 0,
    explanation: 'ATP stands for Adenosine Triphosphate, which is the primary energy currency of cells.'
  },
  'block-4': {
    id: 'mcq-4',
    question: 'Which of the following is NOT a structural component of mitochondria?',
    options: [
      'Outer membrane',
      'Inner membrane with cristae',
      'Matrix',
      'Nucleolus'
    ],
    correct: 3,
    explanation: 'The nucleolus is found in the nucleus, not in mitochondria. Mitochondria have an outer membrane, inner membrane with cristae, and a matrix.'
  },
  'block-5': {
    id: 'mcq-5',
    question: 'What is the primary function of nuclear organization?',
    options: [
      'To produce energy for the cell',
      'To organize and protect genetic material',
      'To synthesize lipids',
      'To break down waste products'
    ],
    correct: 1,
    explanation: 'Nuclear organization serves to organize and protect the genetic material (DNA) while regulating gene expression and cellular activities.'
  },
  'block-6': {
    id: 'mcq-6',
    question: 'During cell division, chromatin condenses into what structure?',
    options: [
      'Ribosomes',
      'Mitochondria',
      'Chromosomes',
      'Lysosomes'
    ],
    correct: 2,
    explanation: 'During cell division, loosely organized chromatin condenses and coils tightly to form visible chromosomes.'
  },
  'block-7': {
    id: 'mcq-7',
    question: 'What is the main function of nuclear pores?',
    options: [
      'DNA replication',
      'Protein synthesis',
      'Regulating transport between nucleus and cytoplasm',
      'Energy production'
    ],
    correct: 2,
    explanation: 'Nuclear pores are protein complexes that regulate the transport of molecules between the nucleus and the cytoplasm.'
  }
}

// Specialized Sequence puzzles for each spoint
const spointSequences: Record<string, any> = {
  'block-1': {
    id: 'seq-1',
    title: 'Cell Discovery Timeline',
    items: [
      'Robert Hooke observes cork cells (1665)',
      'Anton van Leeuwenhoek observes living cells',
      'Schleiden proposes plant cell theory',
      'Schwann extends theory to animals',
      'Virchow states "cells from cells"'
    ],
    correctOrder: [0, 1, 2, 3, 4]
  },
  'block-2': {
    id: 'seq-2',
    title: 'ATP Production in Mitochondria',
    items: [
      'Glucose enters glycolysis',
      'Pyruvate enters mitochondria',
      'Acetyl-CoA enters Krebs cycle',
      'NADH/FADH2 to electron transport',
      'ATP synthase produces ATP'
    ],
    correctOrder: [0, 1, 2, 3, 4]
  },
  'block-3': {
    id: 'seq-3',
    title: 'ATP Hydrolysis Cycle',
    items: [
      'ATP binds to enzyme',
      'Water molecule attacks phosphate',
      'Phosphate bond breaks',
      'ADP + Pi released',
      'Energy released for work'
    ],
    correctOrder: [0, 1, 2, 3, 4]
  },
  'block-4': {
    id: 'seq-4',
    title: 'Protein Import into Mitochondria',
    items: [
      'Protein synthesized in cytoplasm',
      'Signal sequence recognized',
      'Protein binds TOM complex',
      'Transfer through TIM complex',
      'Signal sequence cleaved in matrix'
    ],
    correctOrder: [0, 1, 2, 3, 4]
  },
  'block-5': {
    id: 'seq-5',
    title: 'Nuclear Envelope Assembly',
    items: [
      'Chromatin decondenses',
      'Nuclear membrane vesicles approach',
      'Vesicles fuse around chromatin',
      'Nuclear pores assemble',
      'Nucleolus reforms'
    ],
    correctOrder: [0, 1, 2, 3, 4]
  },
  'block-6': {
    id: 'seq-6',
    title: 'DNA Packaging Hierarchy',
    items: [
      'DNA double helix',
      'Nucleosome formation',
      '30nm chromatin fiber',
      'Higher-order loops',
      'Condensed chromosome'
    ],
    correctOrder: [0, 1, 2, 3, 4]
  },
  'block-7': {
    id: 'seq-7',
    title: 'Nuclear Import Mechanism',
    items: [
      'Cargo binds importin',
      'Complex docks at nuclear pore',
      'Transport through pore channel',
      'RanGTP binds in nucleus',
      'Cargo released, importin recycled'
    ],
    correctOrder: [0, 1, 2, 3, 4]
  }
}

// Sample content with granular blocks that map to spoints
const sampleContent = {
  studyContent: {
    blocks: [
      {
        id: 'block-1',
        type: 'header',
        data: {
          text: 'Introduction to Cell Biology',
          level: 2
        }
      },
      {
        id: 'block-2',
        type: 'paragraph',
        data: {
          text: 'The mitochondria is the powerhouse of the cell, responsible for producing ATP through cellular respiration.'
        }
      },
      {
        id: 'block-3',
        type: 'paragraph',
        data: {
          text: 'ATP (Adenosine Triphosphate) is the primary energy currency used by cells for various metabolic processes.'
        }
      },
      {
        id: 'block-4',
        type: 'paragraph',
        data: {
          text: 'The structure of mitochondria includes an outer membrane, inner membrane, cristae, and matrix.'
        }
      },
      {
        id: 'block-5',
        type: 'header',
        data: {
          text: 'Nuclear Organization',
          level: 2
        }
      },
      {
        id: 'block-6',
        type: 'paragraph',
        data: {
          text: 'DNA is organized into chromatin within the nucleus, which condenses into chromosomes during cell division.'
        }
      },
      {
        id: 'block-7',
        type: 'paragraph',
        data: {
          text: 'Nuclear pores regulate the transport of molecules between the nucleus and cytoplasm.'
        }
      }
    ]
  },
  practiceQuestions: [
    {
      id: 'q1',
      question: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correct: 1
    },
    {
      id: 'q2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correct: 1
    }
  ]
}

// Component uses color constants from '../constants/episode'

export default function EpisodePage() {
  const navigate = useNavigate()
  const { darkMode } = useThemeStore()
  const editorRef = useRef<EditorJS | null>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  
  const [mode, setMode] = useState<EditorMode>('study')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_WIDTH.DEFAULT)
  const [isResizing, setIsResizing] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['module-1', 'section-1', 'section-2', 'section-3'])
  const [completedSpoints, setCompletedSpoints] = useState<Set<string>>(new Set(['block-1']))
  const [currentSpoint, setCurrentSpoint] = useState('block-1')
  const [highlightedBlock, setHighlightedBlock] = useState<string | null>(null)
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  
  // Study mode states
  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [textColorAnchor, setTextColorAnchor] = useState<HTMLElement | null>(null)
  const [highlightColorAnchor, setHighlightColorAnchor] = useState<HTMLElement | null>(null)
  const [selectedTextColor, setSelectedTextColor] = useState('#000000')
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('#fef3c7')
  const [alignment, setAlignment] = useState<TextAlignment>('left')
  
  // Quiz creation states
  const [blockMenuAnchor, setBlockMenuAnchor] = useState<HTMLElement | null>(null)
  const [createQuizAnchor, setCreateQuizAnchor] = useState<HTMLElement | null>(null)
  const [connectQuizAnchor, setConnectQuizAnchor] = useState<HTMLElement | null>(null)
  
  // Practice mode states
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedQuizType, setSelectedQuizType] = useState<string>('MCQ')
  const [quizTypeAnchor, setQuizTypeAnchor] = useState<HTMLElement | null>(null)
  
  // Flashcard states
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false)
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null)
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [currentQuizType, setCurrentQuizType] = useState<'MCQ' | 'Flashcard'>('MCQ')
  
  // Sequence quiz states - Use an array of 5 slots, each can be null or contain an item
  const [userSequence, setUserSequence] = useState<(string | null)[]>([null, null, null, null, null])
  const [availableItems, setAvailableItems] = useState<string[]>([])
  const [sequenceChecked, setSequenceChecked] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedFromIndex, setDraggedFromIndex] = useState<number | null>(null)
  const [draggedFromArea, setDraggedFromArea] = useState<'available' | 'sequence' | null>(null)

  // Initialize Editor.js for study mode
  useEffect(() => {
    if ((mode === 'study' || mode === 'mix') && editorContainerRef.current && !editorRef.current) {
      editorRef.current = new EditorJS({
        holder: editorContainerRef.current,
        tools: {
          header: {
            class: Header,
            config: {
              levels: EDITOR_CONFIG.headerLevels,
              defaultLevel: EDITOR_CONFIG.defaultHeaderLevel
            }
          },
          list: ListTool,
          quote: Quote,
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M'
          },
          code: InlineCode,
          table: Table,
          checklist: Checklist
        },
        data: sampleContent.studyContent,
        placeholder: EDITOR_CONFIG.placeholder,
        onReady: () => {
          console.log('Editor ready')
        }
      })
    }
    
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [mode])

  // Handle convert to menu
  const handleConvertTo = (type: string) => {
    console.log(`Converting to ${type}`)
    // setConvertMenuAnchor(null) - state variable not defined yet
    // Add your conversion logic here
  }

  // Handle click outside to clear selection
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if click is outside the tree view
      if (!target.closest('.MuiTreeView-root') && !target.closest('.ce-block')) {
        setCurrentSpoint('')
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Reset quiz state when currentSpoint changes in practice mode
  useEffect(() => {
    if (mode === 'practice' && currentSpoint) {
      // Reset MCQ states
      setSelectedAnswer(null)
      setShowAnswer(false)
      // Reset Flashcard states
      setShowFlashcardAnswer(false)
      setSelectedConfidence(null)
      setAnsweredCorrect(null)
      setSelectedDifficulty(null)
    }
  }, [currentSpoint, mode])

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX
        if (newWidth >= 200 && newWidth <= 400) {
          setSidebarWidth(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'study' | 'practice' | 'mix' | null) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  const executeEditorCommand = async (command: string) => {
    if (!editorRef.current) return

    try {
      switch (command) {
        case 'bold':
        case 'italic':
        case 'underline':
        case 'strikethrough':
          document.execCommand(command)
          break
          
        case 'highlight':
          if (window.getSelection) {
            const selection = window.getSelection()
            if (selection && selection.toString()) {
              const range = selection.getRangeAt(0)
              const span = document.createElement('span')
              span.style.backgroundColor = selectedHighlightColor
              range.surroundContents(span)
            }
          }
          break
          
        case 'textColor':
          document.execCommand('foreColor', false, selectedTextColor)
          break
          
        case 'clearFormat':
          document.execCommand('removeFormat')
          break
          
        case 'alignLeft':
        case 'alignCenter':
        case 'alignRight':
        case 'alignJustify':
          document.execCommand('justify' + command.replace('align', ''))
          break
          
        case 'indent':
          document.execCommand('indent')
          break
          
        case 'outdent':
          document.execCommand('outdent')
          break
          
        case 'subscript':
        case 'superscript':
          document.execCommand(command)
          break
          
        case 'bullet':
          editorRef.current.blocks.insert('list', { style: 'unordered', items: [''] })
          break
          
        case 'number':
          editorRef.current.blocks.insert('list', { style: 'ordered', items: [''] })
          break
          
        case 'quote':
          editorRef.current.blocks.insert('quote', { text: '', caption: '' })
          break
          
        case 'code':
          editorRef.current.blocks.insert('code', { code: '' })
          break
          
        case 'header':
          editorRef.current.blocks.insert('header', { text: '', level: 2 })
          break
          
        case 'table':
          editorRef.current.blocks.insert('table', { content: [['', ''], ['', '']] })
          break
          
        case 'link':
          const url = prompt('Enter URL:')
          if (url) {
            document.execCommand('createLink', false, url)
          }
          break
          
        case 'image':
          const imageUrl = prompt('Enter image URL:')
          if (imageUrl) {
            document.execCommand('insertImage', false, imageUrl)
          }
          break
          
        case 'undo':
          document.execCommand('undo')
          break
          
        case 'redo':
          document.execCommand('redo')
          break
          
        case 'save':
          const outputData = await editorRef.current.save()
          console.log('Saving data:', outputData)
          break
      }
    } catch (error) {
      console.error('Error executing command:', error)
    }
  }

  const handleToolClick = (tool: string) => {
    setSelectedTool(tool === selectedTool ? null : tool)
    executeEditorCommand(tool)
  }


  const handleSpointComplete = (spointId: string) => {
    const newCompleted = new Set(completedSpoints)
    if (newCompleted.has(spointId)) {
      newCompleted.delete(spointId)
    } else {
      newCompleted.add(spointId)
    }
    setCompletedSpoints(newCompleted)
  }

  const handleCheckAnswer = () => {
    const question = sampleContent.practiceQuestions[currentQuestion]
    if (selectedAnswer === question.correct) {
      setScore(score + 1)
    }
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    // Find all spoints
    const allSpoints = contentHierarchy[0].children?.flatMap(s => s.children || []) || []
    const currentIndex = allSpoints.findIndex(s => s.id === currentSpoint)
    
    if (currentIndex < allSpoints.length - 1) {
      // Move to next spoint
      const nextSpoint = allSpoints[currentIndex + 1]
      setCurrentSpoint(nextSpoint.id)
      setSelectedAnswer(null)
      setShowAnswer(false)
    } else {
      // All spoints completed
      navigate('/dashboard')
    }
  }

  const handleQuizItemCreate = (type: string) => {
    console.log(`Creating quiz item: ${type}`)
    setCreateQuizAnchor(null)
    // TODO: Implement quiz item creation logic
  }

  const handleQuizConnect = (type: string) => {
    console.log(`Connecting to quiz: ${type}`)
    setConnectQuizAnchor(null)
    // TODO: Implement quiz connection logic
  }

  // Handle spoint click to highlight corresponding block or show MCQ
  const handleSpointClick = (spointId: string) => {
    console.log('handleSpointClick called with:', spointId, 'mode:', mode)
    
    // Set only the current selection
    setCurrentSpoint(spointId)
    
    // In practice mode, show the corresponding MCQ
    if (mode === 'practice') {
      console.log('Practice mode - showing MCQ for:', spointId)
      // Reset practice state for new question
      setSelectedAnswer(null)
      setShowAnswer(false)
      // The selected spoint's MCQ will be shown in renderPracticeMode
    } 
    // In study/mix mode, scroll to the block in the editor
    else if (editorRef.current && spointId.startsWith('block-')) {
      const blockIndex = parseInt(spointId.replace('block-', '')) - 1
      const blocks = document.querySelectorAll('.ce-block')
      if (blocks[blockIndex]) {
        blocks[blockIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add highlight effect
        const element = blocks[blockIndex] as HTMLElement
        element.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.1)'
        setTimeout(() => {
          element.style.backgroundColor = ''
        }, 2000)
      }
    }
  }

  // Handle spoint double-click to select block for editing
  const handleSpointDoubleClick = (spointId: string) => {
    setSelectedBlock(spointId)
    setCurrentSpoint(spointId)
    
    // Focus on the block in the editor
    if (editorRef.current && spointId.startsWith('block-')) {
      const blockIndex = parseInt(spointId.replace('block-', '')) - 1
      const blocks = document.querySelectorAll('.ce-block')
      if (blocks[blockIndex]) {
        blocks[blockIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Trigger click to enter edit mode
        const event = new MouseEvent('click', { bubbles: true })
        blocks[blockIndex].dispatchEvent(event)
        // Add selection effect
        const element = blocks[blockIndex] as HTMLElement
        element.style.border = darkMode ? '2px solid #3b82f6' : '2px solid #2563eb'
        setTimeout(() => {
          element.style.border = ''
        }, 3000)
      }
    }
  }

  const renderTreeItems = (items: TreeNode[]) => {
    return items.map(item => (
      <TreeItem
        key={item.id}
        itemId={item.id}
        label={
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 0.5,
            userSelect: 'none',  // Prevent text selection on the entire item
            WebkitUserSelect: 'none',
            MozUserSelect: 'none'
          }}>
            {item.type === 'spoint' && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSpointComplete(item.id)
                }}
                sx={{ mr: 1, p: 0 }}
              >
                {completedSpoints.has(item.id) ? (
                  <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                ) : (
                  <RadioButtonUnchecked sx={{ fontSize: 16, color: darkMode ? '#666' : '#999' }} />
                )}
              </IconButton>
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                flex: 1,
                color: item.id === currentSpoint ? (darkMode ? 'white' : '#000') : (darkMode ? '#999' : '#666'),
                fontWeight: item.id === currentSpoint ? 600 : 400,
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '4px',
                // Fast animation
                transition: 'all 0.15s ease',
                transform: item.id === currentSpoint ? 'scale(1.01)' : 'scale(1)',
                userSelect: 'none',  // Prevent text selection
                WebkitUserSelect: 'none',  // For Safari
                MozUserSelect: 'none'  // For Firefox
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (item.type === 'spoint') {
                  handleSpointClick(item.id)
                }
              }}
              onDoubleClick={() => item.type === 'spoint' && handleSpointDoubleClick(item.id)}
            >
              {item.name}
            </Typography>
          </Box>
        }
      >
        {item.children && renderTreeItems(item.children)}
      </TreeItem>
    ))
  }

  const renderStudyMode = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: darkMode ? '#0a0a0a' : '#fafafa'
    }}>
      {/* Editor content area - full width */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 3
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: darkMode ? '#1a1a1a' : 'white',
            border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
            borderRadius: 0.5,
            minHeight: '100%',
            '& .ce-block': {
              fontSize: FONT_SIZES[fontSize],
              cursor: 'pointer',
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
              }
            },
            '& .ce-toolbar__content': {
              maxWidth: '100%'
            },
            '& .ce-block__content': {
              maxWidth: '100%'
            }
          }}
        >
          <div ref={editorContainerRef} />
        </Paper>
      </Box>

      {/* Block menu popover */}
      <Popover
        open={Boolean(blockMenuAnchor)}
        anchorEl={blockMenuAnchor}
        onClose={() => setBlockMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List sx={{ py: 0.5 }}>
          <ListItemButton onClick={(e) => setCreateQuizAnchor(e.currentTarget)}>
            <ListItemIcon>
              <Add fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Create quiz item" />
            <ChevronRight fontSize="small" />
          </ListItemButton>
          <ListItemButton onClick={(e) => setConnectQuizAnchor(e.currentTarget)}>
            <ListItemIcon>
              <Link fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Connect to quiz" />
            <ChevronRight fontSize="small" />
          </ListItemButton>
        </List>
      </Popover>

      {/* Create quiz submenu */}
      <Menu
        open={Boolean(createQuizAnchor)}
        anchorEl={createQuizAnchor}
        onClose={() => setCreateQuizAnchor(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleQuizItemCreate('flashcard')}>
          <ListItemIcon>
            <CreditCard fontSize="small" />
          </ListItemIcon>
          <ListItemText>Flashcard</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuizItemCreate('table')}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Table</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuizItemCreate('sequence')}>
          <ListItemIcon>
            <ViewAgenda fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sequence</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuizItemCreate('paragraph')}>
          <ListItemIcon>
            <Notes fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paragraph</ListItemText>
        </MenuItem>
      </Menu>

      {/* Connect quiz submenu */}
      <Menu
        open={Boolean(connectQuizAnchor)}
        anchorEl={connectQuizAnchor}
        onClose={() => setConnectQuizAnchor(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleQuizConnect('flashcard')}>
          <ListItemIcon>
            <CreditCard fontSize="small" />
          </ListItemIcon>
          <ListItemText>Flashcard</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuizConnect('table')}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Table</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuizConnect('sequence')}>
          <ListItemIcon>
            <ViewAgenda fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sequence</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleQuizConnect('paragraph')}>
          <ListItemIcon>
            <Notes fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paragraph</ListItemText>
        </MenuItem>
      </Menu>

      {/* Bottom toolbar with mode selector and formatting */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderTop: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
          background: darkMode ? '#1a1a1a' : 'white'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          {/* Mode selector - moved from top */}
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            size="small"
            sx={{ 
              '& .MuiToggleButton-root': {
                py: 0.5,
                px: 2,
                fontSize: '0.875rem',
                textTransform: 'none',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#999' : '#666',
                '&.Mui-selected': {
                  background: darkMode ? '#3b82f6' : '#2563eb',
                  color: 'white',
                  '&:hover': {
                    background: darkMode ? '#2563eb' : '#1d4ed8'
                  }
                }
              }
            }}
          >
            <ToggleButton value="study">Study</ToggleButton>
            <ToggleButton value="practice">Practice</ToggleButton>
            <ToggleButton value="mix">Mix</ToggleButton>
          </ToggleButtonGroup>

          {/* Formatting tools */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Text formatting */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('bold')}
              sx={{
                color: selectedTool === 'bold' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatBold fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('italic')}
              sx={{
                color: selectedTool === 'italic' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatItalic fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('underline')}
              sx={{
                color: selectedTool === 'underline' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatUnderlined fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('strikethrough')}
              sx={{
                color: selectedTool === 'strikethrough' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatStrikethrough fontSize="small" />
            </IconButton>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Colors */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small"
              onClick={(e) => setTextColorAnchor(e.currentTarget)}
              sx={{
                color: selectedTextColor,
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatColorText fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={(e) => setHighlightColorAnchor(e.currentTarget)}
              sx={{
                bgcolor: selectedHighlightColor,
                '&:hover': { opacity: 0.8 }
              }}
            >
              <FormatColorFill fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('clearFormat')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatClear fontSize="small" />
            </IconButton>
          </Box>

          {/* Text color picker */}
          <Popover
            open={Boolean(textColorAnchor)}
            anchorEl={textColorAnchor}
            onClose={() => setTextColorAnchor(null)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ p: 1, display: 'flex', gap: 0.5 }}>
              {TEXT_COLORS.slice(0, 8).map(color => (
                <IconButton
                  key={color}
                  size="small"
                  onClick={() => {
                    setSelectedTextColor(color)
                    handleToolClick('textColor')
                    setTextColorAnchor(null)
                  }}
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: color,
                    border: color === selectedTextColor ? '2px solid #000' : 'none',
                    '&:hover': { transform: 'scale(1.2)' }
                  }}
                />
              ))}
            </Box>
          </Popover>

          {/* Highlight color picker */}
          <Popover
            open={Boolean(highlightColorAnchor)}
            anchorEl={highlightColorAnchor}
            onClose={() => setHighlightColorAnchor(null)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ p: 1, display: 'flex', gap: 0.5 }}>
              {HIGHLIGHT_COLORS.slice(1, 9).map(color => (
                <IconButton
                  key={color}
                  size="small"
                  onClick={() => {
                    setSelectedHighlightColor(color)
                    handleToolClick('highlight')
                    setHighlightColorAnchor(null)
                  }}
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: color,
                    border: color === selectedHighlightColor ? '2px solid #000' : 'none',
                    '&:hover': { transform: 'scale(1.2)' }
                  }}
                />
              ))}
            </Box>
          </Popover>

          <Divider orientation="vertical" flexItem />

          {/* Alignment */}
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={(_e, value) => value && setAlignment(value)}
            size="small"
          >
            <ToggleButton 
              value="left"
              onClick={() => handleToolClick('alignLeft')}
              sx={{ px: 0.5, py: 0.25 }}
            >
              <FormatAlignLeft fontSize="small" />
            </ToggleButton>
            <ToggleButton 
              value="center"
              onClick={() => handleToolClick('alignCenter')}
              sx={{ px: 0.5, py: 0.25 }}
            >
              <FormatAlignCenter fontSize="small" />
            </ToggleButton>
            <ToggleButton 
              value="right"
              onClick={() => handleToolClick('alignRight')}
              sx={{ px: 0.5, py: 0.25 }}
            >
              <FormatAlignRight fontSize="small" />
            </ToggleButton>
            <ToggleButton 
              value="justify"
              onClick={() => handleToolClick('alignJustify')}
              sx={{ px: 0.5, py: 0.25 }}
            >
              <FormatAlignJustify fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Lists and indentation */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('bullet')}
              sx={{
                color: selectedTool === 'bullet' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatListBulleted fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('number')}
              sx={{
                color: selectedTool === 'number' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatListNumbered fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('outdent')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatIndentDecrease fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('indent')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatIndentIncrease fontSize="small" />
            </IconButton>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Advanced formatting */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('subscript')}
              sx={{
                color: selectedTool === 'subscript' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Subscript fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('superscript')}
              sx={{
                color: selectedTool === 'superscript' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Superscript fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('quote')}
              sx={{
                color: selectedTool === 'quote' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <FormatQuote fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('code')}
              sx={{
                color: selectedTool === 'code' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Code fontSize="small" />
            </IconButton>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Insert */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('link')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Link fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('image')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Image fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('table')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <TableChart fontSize="small" />
            </IconButton>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Font size */}
          <ToggleButtonGroup
            value={fontSize}
            exclusive
            onChange={(_e, value) => value && setFontSize(value)}
            size="small"
          >
            <ToggleButton 
              value="small" 
              sx={{ 
                px: 1, 
                py: 0.5,
                borderColor: darkMode ? '#333' : '#e5e5e5',
                color: darkMode ? '#666' : '#999',
                '&.Mui-selected': {
                  bgcolor: darkMode ? '#333' : '#e5e5e5',
                  color: darkMode ? 'white' : '#000'
                }
              }}
            >
              <Typography variant="caption">S</Typography>
            </ToggleButton>
            <ToggleButton 
              value="medium"
              sx={{ 
                px: 1, 
                py: 0.5,
                borderColor: darkMode ? '#333' : '#e5e5e5',
                color: darkMode ? '#666' : '#999',
                '&.Mui-selected': {
                  bgcolor: darkMode ? '#333' : '#e5e5e5',
                  color: darkMode ? 'white' : '#000'
                }
              }}
            >
              <Typography variant="caption">M</Typography>
            </ToggleButton>
            <ToggleButton 
              value="large"
              sx={{ 
                px: 1, 
                py: 0.5,
                borderColor: darkMode ? '#333' : '#e5e5e5',
                color: darkMode ? '#666' : '#999',
                '&.Mui-selected': {
                  bgcolor: darkMode ? '#333' : '#e5e5e5',
                  color: darkMode ? 'white' : '#000'
                }
              }}
            >
              <Typography variant="caption">L</Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Undo/Redo/Save */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('undo')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Undo fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('redo')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Redo fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              onClick={() => handleToolClick('save')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Save fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
    </Box>
  )

  // Render the common toolbar for all modes
  const renderToolbar = (showEditorTools: boolean = true) => (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderTop: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
        background: darkMode ? '#1a1a1a' : 'white'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        {/* Mode selector */}
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={{ 
            '& .MuiToggleButton-root': {
              py: 0.5,
              px: 2,
              fontSize: '0.875rem',
              textTransform: 'none',
              border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
              color: darkMode ? '#999' : '#666',
              '&.Mui-selected': {
                background: darkMode ? '#3b82f6' : '#2563eb',
                color: 'white',
                '&:hover': {
                  background: darkMode ? '#2563eb' : '#1d4ed8'
                }
              }
            }
          }}
        >
          <ToggleButton value="study">Study</ToggleButton>
          <ToggleButton value="practice">Practice</ToggleButton>
          <ToggleButton value="mix">Mix</ToggleButton>
        </ToggleButtonGroup>

        {/* Formatting tools - shown in Study and Mix modes */}
        {showEditorTools && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Text formatting */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small"
                onClick={() => handleToolClick('bold')}
                sx={{
                  color: selectedTool === 'bold' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                  '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
                }}
              >
                <FormatBold fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                onClick={() => handleToolClick('italic')}
                sx={{
                  color: selectedTool === 'italic' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                  '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
                }}
              >
                <FormatItalic fontSize="small" />
              </IconButton>
              <IconButton 
                size="small"
                onClick={() => handleToolClick('underline')}
                sx={{
                  color: selectedTool === 'underline' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                  '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
                }}
              >
                <FormatUnderlined fontSize="small" />
              </IconButton>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Font size */}
            <ToggleButtonGroup
              value={fontSize}
              exclusive
              onChange={(e, val) => val && setFontSize(val)}
              size="small"
            >
              <ToggleButton value="small" sx={{ px: 1, py: 0.5 }}>
                <Typography variant="caption">S</Typography>
              </ToggleButton>
              <ToggleButton value="medium" sx={{ px: 1, py: 0.5 }}>
                <Typography variant="caption">M</Typography>
              </ToggleButton>
              <ToggleButton value="large" sx={{ px: 1, py: 0.5 }}>
                <Typography variant="caption">L</Typography>
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Save */}
            <IconButton 
              size="small"
              onClick={() => handleToolClick('save')}
              sx={{
                color: darkMode ? '#666' : '#999',
                '&:hover': { bgcolor: darkMode ? '#333' : '#f5f5f5' }
              }}
            >
              <Save fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Practice mode tools - shown only in Practice mode */}
        {!showEditorTools && mode === 'practice' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Divider orientation="vertical" flexItem />
            
            {/* Quiz type buttons - Radio button behavior */}
            <ToggleButton
              value="flashcard"
              selected={selectedQuizType === 'Flashcard'}
              onChange={() => setSelectedQuizType('Flashcard')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#999' : '#666',
                '&.Mui-selected': {
                  background: darkMode ? '#3b82f6' : '#2563eb',
                  color: 'white',
                  '&:hover': {
                    background: darkMode ? '#2563eb' : '#1d4ed8'
                  }
                }
              }}
            >
              <CreditCard sx={{ fontSize: 16, mr: 0.5 }} />
              Flashcard
            </ToggleButton>
            
            <ToggleButton
              value="mcq"
              selected={selectedQuizType === 'MCQ'}
              onChange={() => setSelectedQuizType('MCQ')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#999' : '#666',
                '&.Mui-selected': {
                  background: darkMode ? '#3b82f6' : '#2563eb',
                  color: 'white',
                  '&:hover': {
                    background: darkMode ? '#2563eb' : '#1d4ed8'
                  }
                }
              }}
            >
              <Quiz sx={{ fontSize: 16, mr: 0.5 }} />
              MCQ
            </ToggleButton>
            
            <ToggleButton
              value="sequence"
              selected={selectedQuizType === 'Sequence'}
              onChange={() => setSelectedQuizType('Sequence')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#999' : '#666',
                '&.Mui-selected': {
                  background: darkMode ? '#3b82f6' : '#2563eb',
                  color: 'white',
                  '&:hover': {
                    background: darkMode ? '#2563eb' : '#1d4ed8'
                  }
                }
              }}
            >
              <AccountTree sx={{ fontSize: 16, mr: 0.5 }} />
              Sequence
            </ToggleButton>
            
            <ToggleButton
              value="paragraph"
              selected={selectedQuizType === 'Paragraph'}
              onChange={() => setSelectedQuizType('Paragraph')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#999' : '#666',
                '&.Mui-selected': {
                  background: darkMode ? '#3b82f6' : '#2563eb',
                  color: 'white',
                  '&:hover': {
                    background: darkMode ? '#2563eb' : '#1d4ed8'
                  }
                }
              }}
            >
              <TextFields sx={{ fontSize: 16, mr: 0.5 }} />
              Paragraph
            </ToggleButton>
            
            <ToggleButton
              value="table"
              selected={selectedQuizType === 'Table'}
              onChange={() => setSelectedQuizType('Table')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#999' : '#666',
                '&.Mui-selected': {
                  background: darkMode ? '#3b82f6' : '#2563eb',
                  color: 'white',
                  '&:hover': {
                    background: darkMode ? '#2563eb' : '#1d4ed8'
                  }
                }
              }}
            >
              <TableChart sx={{ fontSize: 16, mr: 0.5 }} />
              Table
            </ToggleButton>
            
            <ToggleButton
              value="venn"
              selected={selectedQuizType === 'Venn Diagram'}
              onChange={() => setSelectedQuizType('Venn Diagram')}
              size="small"
              sx={{
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.875rem',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#999' : '#666',
                '&.Mui-selected': {
                  background: darkMode ? '#3b82f6' : '#2563eb',
                  color: 'white',
                  '&:hover': {
                    background: darkMode ? '#2563eb' : '#1d4ed8'
                  }
                }
              }}
            >
              <BubbleChart sx={{ fontSize: 16, mr: 0.5 }} />
              Venn
            </ToggleButton>
          </Box>
        )}
      </Box>
    </Paper>
  )

  const renderPracticeMode = () => {
    // Check which quiz type is selected
    if (selectedQuizType === 'Flashcard') {
      return renderFlashcardMode()
    }
    
    if (selectedQuizType === 'Sequence') {
      return renderSequenceMode()
    }
    
    // Default to MCQ mode
    const selectedSpointId = currentSpoint || 'block-1'
    const question = spointMCQs[selectedSpointId] || spointMCQs['block-1']
    
    // If no question available, show a message
    if (!question) {
      return (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: darkMode ? '#0a0a0a' : '#fafafa',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ color: darkMode ? '#666' : '#999' }}>
            Please select a topic from the sidebar
          </Typography>
          {renderToolbar(false)}
        </Box>
      )
    }
    
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: darkMode ? '#0a0a0a' : '#fafafa'
      }}>
        {/* Practice content area */}
        <Box sx={{ 
          flex: 1,
          p: 3,
          overflow: 'auto'
        }}>
          {/* Full width container */}
          <Box sx={{ width: '100%' }}>
          {/* Current spoint indicator */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999' }}>
              Topic: {contentHierarchy[0].children?.flatMap(s => s.children || []).find(c => c.id === selectedSpointId)?.name || 'Select a topic'}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999' }}>
              Progress: {completedSpoints.size} / 7 completed
            </Typography>
          </Box>

          {/* Question */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: darkMode ? '#1a1a1a' : 'white',
              border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
              borderRadius: 0.5
            }}
          >
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: darkMode ? 'white' : '#1a1a1a',
              mb: 3
            }}>
              {question.question}
            </Typography>
            
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => {
                const answer = parseInt(e.target.value)
                setSelectedAnswer(answer)
                // Immediately check answer
                if (answer === question.correct) {
                  setScore(score + 1)
                }
                setShowAnswer(true)
              }}
            >
              {question.options.map((option, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    border: `1px solid ${
                      showAnswer && index === question.correct ? '#10b981' :
                      showAnswer && selectedAnswer === index && index !== question.correct ? '#ef4444' :
                      selectedAnswer === index ? (darkMode ? 'white' : '#000') : 
                      (darkMode ? '#333' : '#e5e5e5')
                    }`,
                    borderRadius: 0.5,
                    background: darkMode ? '#0a0a0a' : '#fafafa',
                    cursor: showAnswer ? 'default' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FormControlLabel
                    value={index}
                    control={<Radio size="small" disabled={showAnswer} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ 
                          fontSize: '0.9rem',
                          color: darkMode ? 'white' : '#1a1a1a'
                        }}>
                          {option}
                        </Typography>
                        {showAnswer && index === question.correct && (
                          <Check sx={{ fontSize: 18, color: '#10b981' }} />
                        )}
                        {showAnswer && selectedAnswer === index && index !== question.correct && (
                          <Close sx={{ fontSize: 18, color: '#ef4444' }} />
                        )}
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>
              ))}
            </RadioGroup>
            
            {/* Explanation section */}
            {showAnswer && question.explanation && (
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 2,
                  background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.05)',
                  border: `1px solid ${darkMode ? '#3b82f6' : '#2563eb'}`,
                  borderRadius: 0.5
                }}
              >
                <Typography variant="body2" sx={{ 
                  color: darkMode ? '#93c5fd' : '#1e40af',
                  fontWeight: 500,
                  mb: 1
                }}>
                  Explanation:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: darkMode ? '#ddd' : '#374151'
                }}>
                  {question.explanation}
                </Typography>
              </Paper>
            )}
          </Paper>

          {/* Next button (only show after answer is revealed) */}
          {showAnswer && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleNextQuestion}
                sx={{
                  background: darkMode ? 'white' : '#000',
                  color: darkMode ? '#000' : 'white',
                  textTransform: 'none',
                  px: 4,
                  '&:hover': {
                    background: darkMode ? '#f5f5f5' : '#1a1a1a'
                  }
                }}
              >
                {currentSpoint !== 'block-7' ? 'Next Topic' : 'Finish'}
              </Button>
            </Box>
          )}
          </Box>
        </Box>
        
        {/* Bottom toolbar for Practice mode */}
        {renderToolbar(false)}
      </Box>
    )
  }

  const renderFlashcardMode = () => {
    const selectedSpointId = currentSpoint || 'block-1'
    const flashcard = spointFlashcards[selectedSpointId] || spointFlashcards['block-1']
    
    if (!flashcard) {
      return (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: darkMode ? '#0a0a0a' : '#fafafa',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ color: darkMode ? '#666' : '#999' }}>
            Please select a topic from the sidebar
          </Typography>
        </Box>
      )
    }
    
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: darkMode ? '#0a0a0a' : '#fafafa'
      }}>
        <Box sx={{ 
          flex: 1,
          p: 3,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ width: '100%', maxWidth: 800 }}>
            {/* Topic indicator */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999' }}>
                Topic: {contentHierarchy[0].children?.flatMap(s => s.children || []).find(c => c.id === selectedSpointId)?.name || 'Select a topic'}
              </Typography>
            </Box>
            
            {/* Flashcard */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: darkMode ? '#1a1a1a' : 'white',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                borderRadius: 2,
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              {/* Question Side */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  color: darkMode ? 'white' : '#1a1a1a',
                  mb: 4
                }}>
                  {flashcard.question}
                </Typography>
                
                {/* Confidence Level Selection */}
                {!showFlashcardAnswer && (
                  <Box>
                    <Typography variant="body2" sx={{ 
                      color: darkMode ? '#999' : '#666',
                      mb: 2
                    }}>
                      Select your confidence level before revealing the answer:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
                      {['Not Sure', 'Somewhat Confident', 'Confident', 'Very Confident'].map((level, index) => (
                        <Button
                          key={index}
                          variant={selectedConfidence === index ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => {
                            setSelectedConfidence(index)
                            setShowFlashcardAnswer(true)  // Immediately show answer
                          }}
                          sx={{
                            textTransform: 'none',
                            borderColor: darkMode ? '#333' : '#e5e5e5',
                            color: selectedConfidence === index ? 'white' : (darkMode ? '#999' : '#666'),
                            background: selectedConfidence === index ? (darkMode ? '#3b82f6' : '#2563eb') : 'transparent'
                          }}
                        >
                          {level}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Answer Side */}
                {showFlashcardAnswer && (
                  <Box>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="body1" sx={{ 
                      color: darkMode ? '#ddd' : '#374151',
                      mb: 4,
                      lineHeight: 1.8
                    }}>
                      {flashcard.answer}
                    </Typography>
                    
                    {/* Right/Wrong Selection */}
                    {answeredCorrect === null && (
                      <Box>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#999' : '#666',
                          mb: 2
                        }}>
                          Did you answer correctly?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
                          <Button
                            variant="outlined"
                            startIcon={<Check />}
                            onClick={() => setAnsweredCorrect(true)}
                            sx={{
                              borderColor: '#10b981',
                              color: '#10b981',
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#10b981',
                                background: 'rgba(16, 185, 129, 0.1)'
                              }
                            }}
                          >
                            Correct
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Close />}
                            onClick={() => {
                              setAnsweredCorrect(false)
                              // Skip difficulty rating for wrong answers
                              setTimeout(() => handleNextFlashcard(), 1000)
                            }}
                            sx={{
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.1)'
                              }
                            }}
                          >
                            Wrong
                          </Button>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Difficulty Rating (only if correct) */}
                    {answeredCorrect === true && selectedDifficulty === null && (
                      <Box>
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#999' : '#666',
                          mb: 2
                        }}>
                          How difficult was this question? (1 = Easy, 5 = Hard)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <Button
                              key={level}
                              variant="outlined"
                              onClick={() => {
                                setSelectedDifficulty(level)
                                setTimeout(() => handleNextFlashcard(), 500)
                              }}
                              sx={{
                                minWidth: 48,
                                height: 48,
                                borderRadius: '50%',
                                borderColor: darkMode ? '#333' : '#e5e5e5',
                                color: darkMode ? '#999' : '#666',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                '&:hover': {
                                  borderColor: darkMode ? '#3b82f6' : '#2563eb',
                                  background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)'
                                }
                              }}
                            >
                              {level}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
        
        {/* Bottom toolbar for Flashcard mode */}
        {renderToolbar(false)}
      </Box>
    )
  }
  
  const handleNextFlashcard = () => {
    // Find all spoints
    const allSpoints = contentHierarchy[0].children?.flatMap(s => s.children || []) || []
    const currentIndex = allSpoints.findIndex(s => s.id === currentSpoint)
    
    if (currentIndex < allSpoints.length - 1) {
      // Move to next spoint
      const nextSpoint = allSpoints[currentIndex + 1]
      setCurrentSpoint(nextSpoint.id)
    }
    
    // Reset flashcard states
    setShowFlashcardAnswer(false)
    setSelectedConfidence(null)
    setAnsweredCorrect(null)
    setSelectedDifficulty(null)
  }

  // Initialize sequence items when entering Sequence mode or changing topics
  useEffect(() => {
    if (selectedQuizType === 'Sequence') {
      const spointId = currentSpoint || 'block-1'
      const sequence = spointSequences[spointId]
      
      if (sequence && sequence.items) {
        // Only reset if we don't have items or we're changing topics
        if (availableItems.length === 0 || 
            (availableItems.length > 0 && !sequence.items.every(item => 
              availableItems.includes(item) || userSequence.includes(item)))) {
          // Shuffle the items randomly
          const shuffled = [...sequence.items].sort(() => Math.random() - 0.5)
          setAvailableItems(shuffled)
          setUserSequence([null, null, null, null, null])  // Reset to 5 empty slots
          setSequenceChecked(false)
        }
      }
    }
  }, [currentSpoint, selectedQuizType])
  
  const renderSequenceMode = () => {
    const selectedSpointId = currentSpoint || 'block-1'
    const sequence = spointSequences[selectedSpointId] || spointSequences['block-1']
    
    if (!sequence) {
      return (
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: darkMode ? '#0a0a0a' : '#fafafa',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ color: darkMode ? '#666' : '#999' }}>
            Please select a topic from the sidebar
          </Typography>
        </Box>
      )
    }
    
    
    const handleDragStart = (e: React.DragEvent, item: string, index: number, area: 'available' | 'sequence') => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', item) // For Firefox compatibility
      setDraggedItem(item)
      setDraggedFromIndex(index)
      setDraggedFromArea(area)
    }
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }
    
    const handleDragEnd = () => {
      // Clean up drag state if drop didn't occur
      setDraggedItem(null)
      setDraggedFromIndex(null)
      setDraggedFromArea(null)
    }
    
    const handleDropToSequence = (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!draggedItem || dropIndex < 0 || dropIndex > 4) return
      
      const newSequence = [...userSequence]
      const currentItemInSlot = newSequence[dropIndex]
      
      if (draggedFromArea === 'available') {
        // Moving from available to a specific slot
        const newAvailable = availableItems.filter(item => item !== draggedItem)
        
        // If slot is occupied, move the existing item back to available
        if (currentItemInSlot) {
          newAvailable.push(currentItemInSlot)
        }
        
        // Place the dragged item in the slot
        newSequence[dropIndex] = draggedItem
        
        setAvailableItems(newAvailable)
        setUserSequence(newSequence)
      } else if (draggedFromArea === 'sequence' && draggedFromIndex !== null) {
        // Moving from one slot to another
        
        // If target slot is occupied, swap the items
        if (currentItemInSlot) {
          // Swap items
          newSequence[dropIndex] = draggedItem
          newSequence[draggedFromIndex] = currentItemInSlot
        } else {
          // Target slot is empty, just move the item
          newSequence[dropIndex] = draggedItem
          newSequence[draggedFromIndex] = null
        }
        
        setUserSequence(newSequence)
      }
      
      // Reset drag state
      setDraggedItem(null)
      setDraggedFromIndex(null)
      setDraggedFromArea(null)
    }
    
    const handleDropToAvailable = (e: React.DragEvent) => {
      e.preventDefault()
      
      if (!draggedItem || draggedFromArea !== 'sequence' || draggedFromIndex === null) return
      
      // Moving from sequence back to available
      const newSequence = [...userSequence]
      newSequence[draggedFromIndex] = null  // Clear the slot
      const newAvailable = [...availableItems, draggedItem]
      
      setUserSequence(newSequence)
      setAvailableItems(newAvailable)
      
      // Reset drag state
      setDraggedItem(null)
      setDraggedFromIndex(null)
      setDraggedFromArea(null)
    }
    
    const handleCheckSequence = () => {
      setSequenceChecked(true)
    }
    
    const handleResetSequence = () => {
      const shuffled = [...sequence.items].sort(() => Math.random() - 0.5)
      setAvailableItems(shuffled)
      setUserSequence([null, null, null, null, null])  // Reset to 5 empty slots
      setSequenceChecked(false)
    }
    
    const isCorrectPosition = (item: string, index: number) => {
      if (!sequenceChecked) return null
      const correctIndex = sequence.items.indexOf(item)
      return correctIndex === index
    }
    
    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: darkMode ? '#0a0a0a' : '#fafafa'
      }}>
        <Box sx={{ 
          flex: 1,
          p: 3,
          overflow: 'auto'
        }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: 900,
            mx: 'auto'
          }}>
            {/* Topic indicator */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999' }}>
                Topic: {contentHierarchy[0].children?.flatMap(s => s.children || []).find(c => c.id === selectedSpointId)?.name || 'Select a topic'}
              </Typography>
            </Box>
            
            {/* Sequence Title */}
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              color: darkMode ? 'white' : '#1a1a1a',
              mb: 3,
              textAlign: 'center'
            }}>
              {sequence.title}
            </Typography>
            
            {/* Sequence Area */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: darkMode ? '#1a1a1a' : 'white',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                borderRadius: 2,
                mb: 3
              }}
            >
              <Typography variant="body2" sx={{ mb: 2, color: darkMode ? '#999' : '#666' }}>
                Arrange in correct order:
              </Typography>
              <Box 
                sx={{ 
                  minHeight: 120,
                  p: 2,
                  border: `2px dashed ${darkMode ? '#444' : '#ddd'}`,
                  borderRadius: 1,
                  background: darkMode ? '#0a0a0a' : '#f9f9f9'
                }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropToSequence(e, userSequence.length)}
              >
                {userSequence.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 80
                  }}>
                    {/* Show 5 empty slots */}
                    {[0, 1, 2, 3, 4].map((slotIndex) => (
                      <React.Fragment key={slotIndex}>
                        {slotIndex > 0 && (
                          <Box sx={{ 
                            fontSize: 24,
                            color: darkMode ? '#444' : '#ccc'
                          }}>
                            →
                          </Box>
                        )}
                        <Box
                          sx={{
                            width: 140,
                            height: 60,
                            border: `2px dashed ${darkMode ? '#555' : '#ccc'}`,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                          }}
                        >
                          <Typography sx={{ 
                            color: darkMode ? '#444' : '#bbb',
                            fontSize: 12
                          }}>
                            Step {slotIndex + 1}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    {/* Show filled slots and empty slots */}
                    {[0, 1, 2, 3, 4].map((slotIndex) => (
                      <React.Fragment key={slotIndex}>
                        {slotIndex > 0 && (
                          <Box sx={{ 
                            fontSize: 24,
                            color: userSequence[slotIndex] ? (darkMode ? '#666' : '#999') : (darkMode ? '#444' : '#ccc')
                          }}>
                            →
                          </Box>
                        )}
                        {userSequence[slotIndex] ? (
                          <Paper
                            draggable
                            onDragStart={(e) => handleDragStart(e, userSequence[slotIndex]!, slotIndex, 'sequence')}
                            onDragEnd={handleDragEnd}
                            elevation={1}
                            sx={{
                              p: 2,
                              minWidth: 140,
                              cursor: 'move',
                              background: sequenceChecked
                                ? isCorrectPosition(userSequence[slotIndex], slotIndex)
                                  ? 'rgba(34, 197, 94, 0.1)'
                                  : 'rgba(239, 68, 68, 0.1)'
                                : darkMode ? '#2a2a2a' : 'white',
                              border: `2px solid ${
                                sequenceChecked
                                  ? isCorrectPosition(userSequence[slotIndex], slotIndex)
                                    ? '#22c55e'
                                    : '#ef4444'
                                  : darkMode ? '#444' : '#e5e5e5'
                              }`,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                background: sequenceChecked
                                  ? isCorrectPosition(userSequence[slotIndex], slotIndex)
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : 'rgba(239, 68, 68, 0.2)'
                                  : darkMode ? '#333' : '#f5f5f5',
                                transform: 'scale(1.02)'
                              },
                              '&:active': {
                                opacity: 0.5
                              }
                            }}
                          >
                            <Typography variant="body2" sx={{ 
                              color: darkMode ? 'white' : '#1a1a1a',
                              fontWeight: 500,
                              fontSize: 13,
                              textAlign: 'center'
                            }}>
                              {userSequence[slotIndex]}
                            </Typography>
                          </Paper>
                        ) : (
                          <Box
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDropToSequence(e, slotIndex)}
                            sx={{
                              width: 140,
                              height: 60,
                              border: `2px dashed ${draggedItem ? '#3b82f6' : (darkMode ? '#555' : '#ccc')}`,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: draggedItem 
                                ? 'rgba(59, 130, 246, 0.05)' 
                                : darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Typography sx={{ 
                              color: darkMode ? '#444' : '#bbb',
                              fontSize: 12
                            }}>
                              Step {slotIndex + 1}
                            </Typography>
                          </Box>
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
            
            {/* Available Items */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: darkMode ? '#1a1a1a' : 'white',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                borderRadius: 2,
                mb: 3
              }}
            >
              <Typography variant="body2" sx={{ mb: 2, color: darkMode ? '#999' : '#666' }}>
                Available items:
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  minHeight: 60,
                  p: 2,
                  border: `2px dashed ${darkMode ? '#444' : '#ddd'}`,
                  borderRadius: 1,
                  background: darkMode ? '#0a0a0a' : '#f9f9f9'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDropToAvailable}
              >
                {availableItems.length === 0 && (
                  <Typography sx={{ 
                    color: darkMode ? '#555' : '#aaa',
                    fontStyle: 'italic',
                    width: '100%',
                    textAlign: 'center'
                  }}>
                    All items have been placed
                  </Typography>
                )}
                {availableItems.map((item, index) => (
                  <Paper
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, index, 'available')}
                    onDragEnd={handleDragEnd}
                    elevation={1}
                    sx={{
                      p: 2,
                      minWidth: 140,
                      cursor: 'move',
                      background: darkMode ? '#2a2a2a' : 'white',
                      border: `2px solid ${darkMode ? '#444' : '#e5e5e5'}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: darkMode ? '#333' : '#f5f5f5',
                        transform: 'scale(1.02)',
                        borderColor: darkMode ? '#666' : '#999'
                      },
                      '&:active': {
                        opacity: 0.5
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ 
                      color: darkMode ? 'white' : '#1a1a1a',
                      fontWeight: 500,
                      fontSize: 13,
                      textAlign: 'center'
                    }}>
                      {item}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
            
            {/* Check/Reset Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {!sequenceChecked ? (
                <Button
                  variant="contained"
                  onClick={handleCheckSequence}
                  disabled={userSequence.filter(item => item !== null).length !== sequence.items.length}
                  sx={{
                    background: darkMode ? 'white' : '#000',
                    color: darkMode ? '#000' : 'white',
                    textTransform: 'none',
                    px: 4,
                    '&:hover': {
                      background: darkMode ? '#f5f5f5' : '#1a1a1a'
                    },
                    '&.Mui-disabled': {
                      background: darkMode ? '#333' : '#e5e5e5',
                      color: darkMode ? '#666' : '#999'
                    }
                  }}
                >
                  Check Answer
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleResetSequence}
                    sx={{
                      borderColor: darkMode ? '#666' : '#999',
                      color: darkMode ? '#999' : '#666',
                      textTransform: 'none',
                      px: 4
                    }}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      // Move to next topic
                      const allSpoints = contentHierarchy[0].children?.flatMap(s => s.children || []) || []
                      const currentIndex = allSpoints.findIndex(s => s.id === currentSpoint)
                      if (currentIndex < allSpoints.length - 1) {
                        const nextSpoint = allSpoints[currentIndex + 1]
                        setCurrentSpoint(nextSpoint.id)
                        // Reset states
                        setUserSequence([null, null, null, null, null])
                        setAvailableItems([])
                        setSequenceChecked(false)
                      }
                    }}
                    sx={{
                      background: darkMode ? 'white' : '#000',
                      color: darkMode ? '#000' : 'white',
                      textTransform: 'none',
                      px: 4,
                      '&:hover': {
                        background: darkMode ? '#f5f5f5' : '#1a1a1a'
                      }
                    }}
                  >
                    Next Topic
                  </Button>
                </>
              )}
            </Box>
            
            {/* Show correct answer when checked */}
            {sequenceChecked && (
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  mt: 3,
                  background: darkMode ? '#0d7a2e' : '#e8f5e9',
                  border: `2px solid #22c55e`,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: darkMode ? 'white' : '#1b5e20', fontWeight: 600 }}>
                  ✓ Correct Sequence:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  {sequence && sequence.items ? sequence.items.map((item: string, index: number) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <Box sx={{ 
                          fontSize: 24,
                          color: darkMode ? 'white' : '#22c55e',
                          mx: 0.5,
                          fontWeight: 'bold'
                        }}>
                          →
                        </Box>
                      )}
                      <Paper
                        elevation={1}
                        sx={{ 
                          p: 2,
                          minWidth: 120,
                          textAlign: 'center',
                          background: darkMode ? '#1a1a1a' : 'white',
                          border: '2px solid #22c55e'
                        }}
                      >
                        <Typography variant="body2" sx={{ 
                          color: darkMode ? '#22c55e' : '#1b5e20',
                          fontWeight: 600,
                          fontSize: 13
                        }}>
                          {item}
                        </Typography>
                      </Paper>
                    </React.Fragment>
                  )) : (
                    <Typography sx={{ color: 'red' }}>ERROR: No sequence items found!</Typography>
                  )}
                </Box>
                
                {/* Score display */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ 
                    color: darkMode ? 'white' : '#1b5e20',
                    fontWeight: 500
                  }}>
                    {userSequence.filter((item, index) => {
                      if (item === null) return false
                      const correctIndex = sequence.items.indexOf(item)
                      return correctIndex === index
                    }).length} / {sequence.items.length} correct positions
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
        
        {/* Bottom toolbar */}
        {renderToolbar(false)}
      </Box>
    )
  }

  const renderMixMode = () => (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: darkMode ? '#0a0a0a' : '#fafafa'
    }}>
      {/* Split view for Study and Practice */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Study panel */}
        <Box sx={{ 
          width: '50%',
          borderRight: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
          overflow: 'auto',
          p: 3
        }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: darkMode ? '#1a1a1a' : 'white',
              border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
              borderRadius: 0.5,
              minHeight: '100%'
            }}
          >
            <div ref={editorContainerRef} />
          </Paper>
        </Box>
        
        {/* Practice panel */}
        <Box sx={{ 
          width: '50%',
          overflow: 'auto',
          p: 3
        }}>
          {sampleContent.practiceQuestions[currentQuestion] && (
            <Box>
              <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999', mb: 2, display: 'block' }}>
                Question {currentQuestion + 1} of {sampleContent.practiceQuestions.length}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: darkMode ? '#1a1a1a' : 'white',
                  border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                  borderRadius: 0.5
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  {sampleContent.practiceQuestions[currentQuestion].question}
                </Typography>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
                >
                  {sampleContent.practiceQuestions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio size="small" />}
                      label={option}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </RadioGroup>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Check
                  </Button>
                  {showAnswer && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleNextQuestion}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Bottom toolbar for Mix mode */}
      {renderToolbar(true)}
    </Box>
  )

  return (
    <Box sx={{ 
      display: 'flex',
      height: 'calc(100vh - 64px)'
    }}>
      {/* Main content area */}
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        background: darkMode ? '#0a0a0a' : '#fafafa'
      }}>
        {/* Content - now takes full height */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {mode === 'study' && renderStudyMode()}
          {mode === 'practice' && renderPracticeMode()}
          {mode === 'mix' && renderMixMode()}
        </Box>
      </Box>

      {/* Right sidebar with tree view */}
      <Paper
        elevation={0}
        sx={{
          width: sidebarOpen ? sidebarWidth : 0,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          borderLeft: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
          background: darkMode ? '#1a1a1a' : 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Resize handle */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            cursor: 'col-resize',
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: darkMode ? '#666' : '#999'
            }
          }}
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Sidebar header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`
        }}>
          <Typography variant="body1" sx={{ 
            fontWeight: 600,
            color: darkMode ? 'white' : '#1a1a1a'
          }}>
            Content Structure
          </Typography>
        </Box>

        {/* Tree view */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: 4
          },
          '&::-webkit-scrollbar-thumb': {
            background: darkMode ? '#333' : '#ccc',
            borderRadius: 2
          }
        }}>
          <SimpleTreeView
            expandedItems={expandedNodes}
            onExpandedItemsChange={(_event, nodeIds) => setExpandedNodes(nodeIds as string[])}
          >
            {renderTreeItems(contentHierarchy)}
          </SimpleTreeView>
        </Box>

        {/* Progress */}
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`
        }}>
          <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999' }}>
            Progress: {completedSpoints.size} / 6 completed
          </Typography>
        </Box>
      </Paper>

      {/* Sidebar toggle */}
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          position: 'fixed',
          right: sidebarOpen ? sidebarWidth + 8 : 8,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: darkMode ? '#1a1a1a' : 'white',
          border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
          zIndex: 10,
          transition: 'right 0.3s ease',
          '&:hover': {
            bgcolor: darkMode ? '#333' : '#f5f5f5'
          }
        }}
      >
        {sidebarOpen ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
      </IconButton>
    </Box>
  )
}