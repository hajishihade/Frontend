import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Checkbox,
  IconButton,
  Modal,
  Fade,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import {
  Close,
  CheckBox,
  CheckBoxOutlineBlank,
  ArrowBack,
  ChevronRight,
  Add,
  Link,
  Description,
  AutoStories
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/stores/themeStore'

const MotionPaper = motion(Paper)

interface ContentItem {
  id: string
  name: string
  type: 'subject' | 'chapter' | 'topic' | 'subtopic' | 'point'
  children?: ContentItem[]
  color?: string
}

const contentData: ContentItem[] = [
  {
    id: 'bio',
    name: 'Biology',
    type: 'subject',
    color: '#10b981',
    children: [
      {
        id: 'cell',
        name: 'Cell Structure',
        type: 'chapter',
        children: [
          {
            id: 'mito',
            name: 'Mitochondria',
            type: 'topic',
            children: [
              { id: 'func', name: 'Functions', type: 'subtopic' },
              { id: 'struct', name: 'Structure', type: 'subtopic' },
              { id: 'atp', name: 'ATP Production', type: 'subtopic' }
            ]
          },
          {
            id: 'nucleus',
            name: 'Nucleus',
            type: 'topic',
            children: [
              { id: 'dna', name: 'DNA Organization', type: 'subtopic' },
              { id: 'nuclear-pore', name: 'Nuclear Pores', type: 'subtopic' },
              { id: 'chromatin', name: 'Chromatin', type: 'subtopic' }
            ]
          },
          {
            id: 'membrane',
            name: 'Cell Membrane',
            type: 'topic',
            children: [
              { id: 'phospho', name: 'Phospholipids', type: 'subtopic' },
              { id: 'transport', name: 'Transport', type: 'subtopic' }
            ]
          }
        ]
      },
      {
        id: 'genetics',
        name: 'Genetics',
        type: 'chapter',
        children: [
          {
            id: 'mend',
            name: 'Mendelian',
            type: 'topic',
            children: [
              { id: 'laws', name: 'Laws', type: 'subtopic' },
              { id: 'crosses', name: 'Crosses', type: 'subtopic' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'chem',
    name: 'Chemistry',
    type: 'subject',
    color: '#f59e0b',
    children: [
      {
        id: 'organic',
        name: 'Organic',
        type: 'chapter',
        children: [
          {
            id: 'hydro',
            name: 'Hydrocarbons',
            type: 'topic',
            children: [
              { id: 'alkanes', name: 'Alkanes', type: 'subtopic' },
              { id: 'alkenes', name: 'Alkenes', type: 'subtopic' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phys',
    name: 'Physics',
    type: 'subject',
    color: '#3b82f6',
    children: [
      {
        id: 'mech',
        name: 'Mechanics',
        type: 'chapter',
        children: [
          {
            id: 'motion',
            name: 'Motion',
            type: 'topic',
            children: [
              { id: 'linear', name: 'Linear', type: 'subtopic' },
              { id: 'circular', name: 'Circular', type: 'subtopic' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math',
    name: 'Mathematics',
    type: 'subject',
    color: '#8b5cf6',
    children: [
      {
        id: 'calc',
        name: 'Calculus',
        type: 'chapter',
        children: [
          {
            id: 'deriv',
            name: 'Derivatives',
            type: 'topic',
            children: [
              { id: 'basic', name: 'Basic', type: 'subtopic' },
              { id: 'chain', name: 'Chain Rule', type: 'subtopic' }
            ]
          }
        ]
      }
    ]
  }
]

// Mock existing stories data
const existingStories = [
  { id: '1', name: 'The Cell Adventure', episodes: 12 },
  { id: '2', name: 'Chemical Reactions Journey', episodes: 8 },
  { id: '3', name: 'Physics in Motion', episodes: 15 },
  { id: '4', name: 'Mathematical Explorations', episodes: 10 }
]

export default function CreateSession() {
  const navigate = useNavigate()
  const { darkMode } = useThemeStore()
  const [currentLevel, setCurrentLevel] = useState<ContentItem[]>(contentData)
  const [navigationPath, setNavigationPath] = useState<ContentItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [currentColor, setCurrentColor] = useState<string>('#666')
  const [modalOpen, setModalOpen] = useState(false)
  const [newStoryName, setNewStoryName] = useState('')
  const [hoveredOption, setHoveredOption] = useState<'new' | 'existing' | null>(null)

  // Check if an item is selected (either directly or through parent)
  const isItemSelected = (item: ContentItem): boolean => {
    // Check if directly selected
    if (selectedItems.has(item.id)) return true
    
    // Check if any parent in the navigation path is selected
    return navigationPath.some(parent => selectedItems.has(parent.id))
  }

  const handleItemClick = (item: ContentItem) => {
    // If it's the final level (no children), select it and go back to start
    if (!item.children || item.children.length === 0) {
      const newSelected = new Set(selectedItems)
      // Always add to selection when clicking final level items
      newSelected.add(item.id)
      setSelectedItems(newSelected)
      
      // Return to root after a brief delay to show selection
      setTimeout(() => {
        setCurrentLevel(contentData)
        setNavigationPath([])
        setCurrentColor('#666')
      }, 200)
    } else {
      // Navigate deeper
      setCurrentLevel(item.children)
      setNavigationPath([...navigationPath, item])
      if (item.color) {
        setCurrentColor(item.color)
      }
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation()
    const newSelected = new Set(selectedItems)
    
    // Check if any parent of this item is selected
    const selectedParent = navigationPath.find(parent => newSelected.has(parent.id))
    
    if (selectedParent) {
      // Parent is selected, handle child checkbox interaction
      if (isItemSelected(item)) {
        // Unchecking a child when parent is selected
        // Remove parent and add all siblings except this one
        newSelected.delete(selectedParent.id)
        
        // Find the immediate parent that contains this item
        const immediateParent = navigationPath[navigationPath.length - 1]
        if (immediateParent && immediateParent.children) {
          immediateParent.children.forEach(child => {
            if (child.id !== item.id) {
              newSelected.add(child.id)
            }
          })
        }
      }
      // If checking a child when parent is selected, do nothing (already covered)
    } else if (newSelected.has(item.id)) {
      // Item is directly selected, remove it and all its children
      newSelected.delete(item.id)
      const removeChildren = (parent: ContentItem) => {
        if (parent.children) {
          parent.children.forEach(child => {
            newSelected.delete(child.id)
            removeChildren(child)
          })
        }
      }
      removeChildren(item)
    } else {
      // Check if all siblings would be selected after this
      const currentParent = navigationPath[navigationPath.length - 1]
      if (currentParent && currentParent.children) {
        const siblings = currentParent.children
        const allSiblingsSelected = siblings.every(sibling => 
          sibling.id === item.id || newSelected.has(sibling.id)
        )
        
        if (allSiblingsSelected) {
          // Remove all siblings and add parent instead
          siblings.forEach(sibling => newSelected.delete(sibling.id))
          newSelected.add(currentParent.id)
        } else {
          // Just add this item
          newSelected.add(item.id)
        }
      } else {
        // No parent context, just add the item
        newSelected.add(item.id)
      }
    }
    
    setSelectedItems(newSelected)
    
    // Always return to start after checkbox selection
    setTimeout(() => {
      setCurrentLevel(contentData)
      setNavigationPath([])
      setCurrentColor('#666')
    }, 200)
  }

  const goBack = () => {
    if (navigationPath.length > 0) {
      const newPath = [...navigationPath]
      newPath.pop()
      setNavigationPath(newPath)
      
      if (newPath.length === 0) {
        setCurrentLevel(contentData)
        setCurrentColor('#666')
      } else {
        const parent = newPath[newPath.length - 1]
        setCurrentLevel(parent.children || [])
      }
    }
  }

  const navigateToBreadcrumb = (index: number) => {
    const newPath = navigationPath.slice(0, index + 1)
    setNavigationPath(newPath)
    
    if (index === -1 || newPath.length === 0) {
      setCurrentLevel(contentData)
      setCurrentColor('#666')
    } else {
      const target = newPath[newPath.length - 1]
      setCurrentLevel(target.children || [])
    }
  }

  const removeSelectedItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    newSelected.delete(id)
    setSelectedItems(newSelected)
  }

  const handleCreateSession = () => {
    if (selectedItems.size > 0) {
      setModalOpen(true)
    }
  }

  const handleCreateNewStory = () => {
    if (newStoryName.trim()) {
      // Navigate to episode with new story
      navigate('/episode/new', { state: { storyName: newStoryName, selectedItems: Array.from(selectedItems) } })
    }
  }

  const handleSelectExistingStory = (storyId: string) => {
    // Navigate to episode with existing story
    navigate('/episode/new', { state: { storyId, selectedItems: Array.from(selectedItems) } })
  }

  const getSelectedItemsDetails = () => {
    const items: ContentItem[] = []
    const findItems = (data: ContentItem[]) => {
      data.forEach(item => {
        if (selectedItems.has(item.id)) {
          items.push(item)
        }
        if (item.children) {
          findItems(item.children)
        }
      })
    }
    findItems(contentData)
    return items
  }

  const selectedDetails = getSelectedItemsDetails()

  // Dynamic width calculation - divide 100% by number of items
  const getCardWidth = () => {
    const count = currentLevel.length
    return `calc(${100 / count}% - ${count > 1 ? '8px' : '0px'})`
  }

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100vw',
      background: darkMode ? '#0a0a0a' : '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      {/* Header with Furbio and Breadcrumbs */}
      <Box sx={{
        height: 100,
        borderBottom: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 2,
        background: darkMode ? '#0f0f0f' : 'white'
      }}>
        {/* Furbio Title */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Furbio
          </Typography>
        </Box>
        
        {/* Breadcrumbs */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flex: 1
        }}>
          {navigationPath.length > 0 ? (
            <>
              <IconButton
                size="small"
                onClick={goBack}
                sx={{
                  position: 'absolute',
                  left: 0,
                  color: darkMode ? '#999' : '#666',
                  '&:hover': {
                    color: darkMode ? 'white' : '#000'
                  }
                }}
              >
                <ArrowBack fontSize="small" />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Button
                  size="small"
                  onClick={() => navigateToBreadcrumb(-1)}
                  sx={{
                    minWidth: 'auto',
                    color: darkMode ? '#999' : '#666',
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    '&:hover': {
                      color: darkMode ? 'white' : '#000',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Home
                </Button>
                {navigationPath.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ChevronRight sx={{ fontSize: 14, color: darkMode ? '#666' : '#999' }} />
                    <Button
                      size="small"
                      onClick={() => navigateToBreadcrumb(index)}
                      sx={{
                        minWidth: 'auto',
                        color: darkMode ? '#999' : '#666',
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        '&:hover': {
                          color: darkMode ? 'white' : '#000',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  </React.Fragment>
                ))}
              </Box>
            </>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                color: darkMode ? '#666' : '#999',
                fontSize: '0.85rem'
              }}
            >
              Select a subject to begin
            </Typography>
          )}
        </Box>
      </Box>

      {/* Main Container */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Cards Container */}
          <Box sx={{ 
            height: '100%',
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 1,
          alignItems: 'stretch',
          overflow: 'hidden'
        }}>
          <AnimatePresence mode="popLayout">
            {currentLevel.map((item, index) => (
              <MotionPaper
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.1,
                  delay: index * 0.01
                }}
                elevation={0}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleItemClick(item)}
                sx={{
                  width: getCardWidth(),
                  minWidth: getCardWidth(),
                  maxWidth: getCardWidth(),
                  height: '100%',
                  flexShrink: 0,
                  background: darkMode ? '#1a1a1a' : 'white',
                  border: `1px solid ${
                    hoveredCard === item.id 
                      ? (item.color || currentColor)
                      : (darkMode ? '#333' : '#e5e5e5')
                  }`,
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  transform: hoveredCard === item.id ? 'translateY(-2px)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: item.color || currentColor,
                    opacity: hoveredCard === item.id ? 1 : 0.3,
                    transition: 'opacity 0.15s ease'
                  }
                }}
              >
                {/* Checkbox */}
                <Box sx={{ 
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 2
                }}>
                  <Checkbox
                    size="small"
                    checked={isItemSelected(item)}
                    onClick={(e) => handleCheckboxClick(e, item)}
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    sx={{
                      color: darkMode ? '#666' : '#999',
                      '&.Mui-checked': {
                        color: item.color || currentColor
                      },
                      p: 0.5
                    }}
                  />
                </Box>

                {/* Content */}
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%',
                  justifyContent: 'space-between'
                }}>
                  <Box>
                    <Typography 
                      variant="overline" 
                      sx={{ 
                        color: item.color || currentColor,
                        letterSpacing: 1,
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        opacity: 0.7
                      }}
                    >
                      {item.type}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: darkMode ? 'white' : '#1a1a1a',
                        mt: 0.5,
                        fontSize: '1.1rem',
                        lineHeight: 1.2
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>

                  {item.children && (
                    <Box sx={{ 
                      pt: 1.5,
                      borderTop: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`
                    }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: darkMode ? '#999' : '#666',
                          fontSize: '0.75rem'
                        }}
                      >
                        {item.children.length} items
                      </Typography>
                    </Box>
                  )}
                </Box>
              </MotionPaper>
            ))}
          </AnimatePresence>
        </Box>
      </Box>

        {/* Right Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 240,
          p: 2,
          pt: 2,  // Normal padding, "Selected" will align with cards
          background: darkMode ? '#0f0f0f' : 'white',
          borderLeft: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            color: darkMode ? 'white' : '#1a1a1a',
            mb: 1.5,
            fontSize: '0.9rem'
          }}
        >
          Selected ({selectedDetails.length})
        </Typography>
        
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          mb: 1.5,
          '&::-webkit-scrollbar': {
            width: 4
          },
          '&::-webkit-scrollbar-thumb': {
            background: darkMode ? '#333' : '#ccc',
            borderRadius: 2
          }
        }}>
          {selectedDetails.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center',
              py: 3,
              color: darkMode ? '#666' : '#999'
            }}>
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                No topics selected
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <AnimatePresence>
                {selectedDetails.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Chip
                      label={item.name}
                      onDelete={() => removeSelectedItem(item.id)}
                      deleteIcon={<Close sx={{ fontSize: 14 }} />}
                      size="small"
                      sx={{
                        width: '100%',
                        justifyContent: 'space-between',
                        height: 28,
                        background: darkMode ? '#1a1a1a' : '#fafafa',
                        border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                        color: darkMode ? 'white' : '#1a1a1a',
                        borderRadius: 0.5,
                        fontSize: '0.75rem',
                        '& .MuiChip-deleteIcon': {
                          color: darkMode ? '#666' : '#999',
                          '&:hover': {
                            color: darkMode ? 'white' : '#000'
                          }
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          )}
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={handleCreateSession}
          disabled={selectedDetails.length === 0}
          sx={{
            background: selectedDetails.length > 0 
              ? (darkMode ? 'white' : '#000')
              : (darkMode ? '#333' : '#e5e5e5'),
            color: selectedDetails.length > 0
              ? (darkMode ? '#000' : 'white')
              : (darkMode ? '#666' : '#999'),
            textTransform: 'none',
            fontWeight: 500,
            py: 1,
            borderRadius: 0.5,
            fontSize: '0.85rem',
            boxShadow: 'none',
            '&:hover': {
              background: selectedDetails.length > 0
                ? (darkMode ? '#f5f5f5' : '#1a1a1a')
                : (darkMode ? '#333' : '#e5e5e5')
            }
          }}
        >
          Create Session
        </Button>
      </Paper>
      </Box>

      {/* Create Session Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
      >
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: darkMode ? '#1a1a1a' : 'white',
            border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
            borderRadius: 0.5,
            p: 3,
            outline: 'none'
          }}>
            <Typography variant="body1" sx={{ 
              fontWeight: 600,
              color: darkMode ? 'white' : '#1a1a1a',
              mb: 3,
              textAlign: 'center'
            }}>
              Story Options
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* New Story Input */}
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="New story name..."
                  value={newStoryName}
                  onChange={(e) => setNewStoryName(e.target.value)}
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      background: darkMode ? '#0a0a0a' : '#fafafa',
                      '& fieldset': {
                        borderColor: darkMode ? '#333' : '#e5e5e5',
                      },
                      '&:hover fieldset': {
                        borderColor: darkMode ? '#666' : '#999',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: darkMode ? 'white' : '#000',
                        borderWidth: 1
                      },
                      '& input': {
                        color: darkMode ? 'white' : '#1a1a1a',
                      }
                    }
                  }}
                />
                <Button
                  fullWidth
                  size="small"
                  onClick={handleCreateNewStory}
                  disabled={!newStoryName.trim()}
                  sx={{
                    background: darkMode ? 'white' : '#000',
                    color: darkMode ? '#000' : 'white',
                    textTransform: 'none',
                    opacity: newStoryName.trim() ? 1 : 0.3,
                    '&:hover': {
                      background: darkMode ? '#f5f5f5' : '#1a1a1a',
                    },
                    '&.Mui-disabled': {
                      background: darkMode ? '#333' : '#e5e5e5',
                      color: darkMode ? '#666' : '#999'
                    }
                  }}
                >
                  Create New
                </Button>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                py: 1
              }}>
                <Box sx={{ flex: 1, height: 1, bgcolor: darkMode ? '#333' : '#e5e5e5' }} />
                <Typography variant="caption" sx={{ color: darkMode ? '#666' : '#999' }}>
                  or
                </Typography>
                <Box sx={{ flex: 1, height: 1, bgcolor: darkMode ? '#333' : '#e5e5e5' }} />
              </Box>

              {/* Existing Stories */}
              <Box>
                <Typography variant="caption" sx={{ 
                  color: darkMode ? '#666' : '#999',
                  display: 'block',
                  mb: 1
                }}>
                  Select existing story
                </Typography>
                <Box sx={{ 
                  maxHeight: 150,
                  overflowY: 'auto',
                  border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                  borderRadius: 0.5,
                  '&::-webkit-scrollbar': {
                    width: 4
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: darkMode ? '#333' : '#ccc',
                    borderRadius: 2
                  }
                }}>
                  {existingStories.map((story) => (
                    <Box
                      key={story.id}
                      onClick={() => handleSelectExistingStory(story.id)}
                      sx={{
                        p: 1.5,
                        borderBottom: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                        cursor: 'pointer',
                        '&:last-child': {
                          borderBottom: 'none'
                        },
                        '&:hover': {
                          background: darkMode ? '#0a0a0a' : '#fafafa'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? 'white' : '#1a1a1a',
                        fontSize: '0.85rem'
                      }}>
                        {story.name}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: darkMode ? '#666' : '#999',
                        fontSize: '0.7rem'
                      }}>
                        {story.episodes} episodes
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}