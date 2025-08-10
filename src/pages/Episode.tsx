import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  MenuItem
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
  ExpandMore,
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
  Add
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

// Sample content with nested structure
const contentHierarchy: TreeNode[] = [
  {
    id: 'bio',
    name: 'Biology',
    type: 'module' as const,
    children: [
      {
        id: 'cell',
        name: 'Cell Structure',
        type: 'section' as const,
        children: [
          {
            id: 'mito',
            name: 'Mitochondria',
            type: 'section' as const,
            children: [
              { id: 'sp1', name: 'ATP Production', type: 'spoint' as const },
              { id: 'sp2', name: 'Structure', type: 'spoint' as const }
            ]
          },
          {
            id: 'nucleus',
            name: 'Nucleus',
            type: 'section' as const,
            children: [
              { id: 'sp3', name: 'DNA Organization', type: 'spoint' as const },
              { id: 'sp4', name: 'Nuclear Pores', type: 'spoint' as const }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chem',
    name: 'Chemistry',
    type: 'module' as const,
    children: [
      {
        id: 'organic',
        name: 'Organic Chemistry',
        type: 'section' as const,
        children: [
          {
            id: 'hydro',
            name: 'Hydrocarbons',
            type: 'section' as const,
            children: [
              { id: 'sp5', name: 'Alkanes', type: 'spoint' as const },
              { id: 'sp6', name: 'Alkenes', type: 'spoint' as const }
            ]
          }
        ]
      }
    ]
  }
]

const sampleContent = {
  studyContent: {
    blocks: [
      {
        type: 'header',
        data: {
          text: 'Welcome to Study Mode',
          level: 2
        }
      },
      {
        type: 'paragraph',
        data: {
          text: 'This is where you can study your selected topics. Use the toolbar below to format and annotate the content as you learn. Click on any block to see quiz creation options.'
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
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['bio', 'chem', 'cell', 'organic'])
  const [completedSpoints, setCompletedSpoints] = useState<Set<string>>(new Set(['sp1']))
  const [currentSpoint, setCurrentSpoint] = useState('sp1')
  
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
    setConvertMenuAnchor(null)
    // Add your conversion logic here
  }

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
    if (currentQuestion < sampleContent.practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    } else {
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

  const renderTreeItems = (items: TreeNode[]) => {
    return items.map(item => (
      <TreeItem
        key={item.id}
        itemId={item.id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
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
                cursor: 'pointer'
              }}
              onClick={() => item.type === 'spoint' && setCurrentSpoint(item.id)}
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

      {/* Bottom toolbar */}
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
          gap: 1,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
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
            onChange={(e, value) => value && setAlignment(value)}
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
            onChange={(e, value) => value && setFontSize(value)}
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
      </Paper>
    </Box>
  )

  const renderPracticeMode = () => {
    const question = sampleContent.practiceQuestions[currentQuestion]
    
    return (
      <Box sx={{ 
        height: '100%',
        background: darkMode ? '#0a0a0a' : '#fafafa',
        p: 3,
        overflow: 'auto'
      }}>
        {/* Full width container */}
        <Box sx={{ width: '100%' }}>
          {/* Question counter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999' }}>
              Question {currentQuestion + 1} of {sampleContent.practiceQuestions.length}
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
              onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
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
          </Paper>

          {/* Action button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!showAnswer ? (
              <Button
                variant="contained"
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
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
                {currentQuestion < sampleContent.practiceQuestions.length - 1 ? 'Next' : 'Finish'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  const renderMixMode = () => (
    <Box sx={{ 
      display: 'flex', 
      height: '100%',
      background: darkMode ? '#0a0a0a' : '#fafafa'
    }}>
      {/* Study panel */}
      <Box sx={{ 
        width: '50%',
        borderRight: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
        overflow: 'hidden'
      }}>
        {renderStudyMode()}
      </Box>
      
      {/* Practice panel */}
      <Box sx={{ 
        width: '50%',
        overflow: 'auto'
      }}>
        {renderPracticeMode()}
      </Box>
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
        {/* Mode selector */}
        <Box sx={{ 
          p: 2,
          borderBottom: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
          background: darkMode ? '#1a1a1a' : 'white',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            sx={{ gap: 1 }}
          >
            <ToggleButton 
              value="study"
              sx={{
                px: 3,
                borderRadius: 0.5,
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#666' : '#999',
                '&.Mui-selected': {
                  background: darkMode ? 'white' : '#000',
                  color: darkMode ? '#000' : 'white',
                  '&:hover': {
                    background: darkMode ? '#f5f5f5' : '#1a1a1a'
                  }
                }
              }}
            >
              Study
            </ToggleButton>
            <ToggleButton 
              value="practice"
              sx={{
                px: 3,
                borderRadius: 0.5,
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#666' : '#999',
                '&.Mui-selected': {
                  background: darkMode ? 'white' : '#000',
                  color: darkMode ? '#000' : 'white',
                  '&:hover': {
                    background: darkMode ? '#f5f5f5' : '#1a1a1a'
                  }
                }
              }}
            >
              Practice
            </ToggleButton>
            <ToggleButton 
              value="mix"
              sx={{
                px: 3,
                borderRadius: 0.5,
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                color: darkMode ? '#666' : '#999',
                '&.Mui-selected': {
                  background: darkMode ? 'white' : '#000',
                  color: darkMode ? '#000' : 'white',
                  '&:hover': {
                    background: darkMode ? '#f5f5f5' : '#1a1a1a'
                  }
                }
              }}
            >
              Mix
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Content */}
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
            onExpandedItemsChange={(_event: React.SyntheticEvent, nodeIds: string[]) => setExpandedNodes(nodeIds)}
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