import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  TextField,
  Checkbox
} from '@mui/material'
import {
  Add,
  BarChart,
  PlayArrow,
  ArrowForward,
  TrendingUp,
  Close
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/stores/themeStore'

const MotionPaper = motion(Paper)
const MotionBox = motion(Box)

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const { darkMode } = useThemeStore()
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Complete Insulin Physiology chapter', completed: false },
    { id: 2, text: 'Review Glucose Metabolism weak points', completed: false },
    { id: 3, text: 'Practice Diabetes Type 2 questions', completed: true }
  ])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: darkMode ? '#0a0a0a' : '#fafafa',
      transition: 'background 0.3s ease'
    }}>
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        {/* Main Continue Card */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: darkMode ? '#1a1a1a' : 'white',
            border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
            borderRadius: 2,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: darkMode ? '#666' : '#000',
              '& .arrow': {
                transform: 'translateX(4px)'
              }
            }
          }}
          onClick={() => navigate('/episode/1')}
        >
          <Grid container alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="overline" sx={{ color: darkMode ? '#666' : '#999', letterSpacing: 1.5, fontSize: '0.7rem' }}>
                CONTINUE LEARNING
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mt: 1, mb: 2, color: darkMode ? 'white' : '#1a1a1a' }}>
                Endocrinology: Insulin Physiology
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#999' : '#666' }}>
                  Chapter 3 of 12
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#999' : '#666' }}>
                  45 min remaining
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#999' : '#666' }}>
                  73% complete
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton 
                className="arrow"
                sx={{ 
                  transition: 'transform 0.2s',
                  background: darkMode ? 'white' : '#000',
                  color: darkMode ? '#000' : 'white',
                  '&:hover': {
                    background: darkMode ? 'white' : '#000'
                  }
                }}
              >
                <ArrowForward />
              </IconButton>
            </Grid>
          </Grid>
          
          {/* Minimal Progress Bar */}
          <Box sx={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: darkMode ? '#333' : '#f0f0f0'
          }}>
            <Box sx={{ 
              width: '73%',
              height: '100%',
              background: darkMode ? 'white' : '#000'
            }} />
          </Box>
        </MotionPaper>

        {/* Quick Actions - Simple Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              elevation={0}
              onMouseEnter={() => setHoveredCard('create')}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                p: 4,
                background: darkMode ? '#1a1a1a' : 'white',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'center',
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: darkMode ? '#666' : '#000',
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => navigate('/create')}
            >
              <Add sx={{ 
                fontSize: 32, 
                color: hoveredCard === 'create' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                transition: 'color 0.2s',
                mb: 2
              }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: darkMode ? 'white' : '#1a1a1a' }}>
                New Session
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#666' : '#999', mt: 1 }}>
                Start learning
              </Typography>
            </MotionPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              elevation={0}
              onMouseEnter={() => setHoveredCard('stats')}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                p: 4,
                background: darkMode ? '#1a1a1a' : 'white',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'center',
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: darkMode ? '#666' : '#000',
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => navigate('/stats')}
            >
              <BarChart sx={{ 
                fontSize: 32, 
                color: hoveredCard === 'stats' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                transition: 'color 0.2s',
                mb: 2
              }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: darkMode ? 'white' : '#1a1a1a' }}>
                Progress
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#666' : '#999', mt: 1 }}>
                View analytics
              </Typography>
            </MotionPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              elevation={0}
              onMouseEnter={() => setHoveredCard('review')}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                p: 4,
                background: darkMode ? '#1a1a1a' : 'white',
                border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                borderRadius: 2,
                cursor: 'pointer',
                textAlign: 'center',
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: darkMode ? '#666' : '#000',
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => navigate('/review')}
            >
              <TrendingUp sx={{ 
                fontSize: 32, 
                color: hoveredCard === 'review' ? (darkMode ? 'white' : '#000') : (darkMode ? '#666' : '#999'),
                transition: 'color 0.2s',
                mb: 2
              }} />
              <Typography variant="h6" sx={{ fontWeight: 500, color: darkMode ? 'white' : '#1a1a1a' }}>
                Review
              </Typography>
              <Typography variant="body2" sx={{ color: darkMode ? '#666' : '#999', mt: 1 }}>
                Practice weak areas
              </Typography>
            </MotionPaper>
          </Grid>
        </Grid>

        {/* Todo List - Minimal Design */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3, color: darkMode ? 'white' : '#1a1a1a' }}>
            Todo List
          </Typography>
          
          {/* Add Todo Input */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 3,
            p: 2,
            background: darkMode ? '#1a1a1a' : 'white',
            border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
            borderRadius: 1
          }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              sx={{
                '& .MuiInput-underline:before': {
                  borderBottom: 'none'
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottom: 'none'
                },
                '& .MuiInput-underline:after': {
                  borderBottom: 'none'
                }
              }}
            />
            <IconButton 
              onClick={addTodo}
              sx={{ 
                color: darkMode ? '#666' : '#999',
                '&:hover': {
                  color: darkMode ? 'white' : '#000'
                }
              }}
            >
              <Add />
            </IconButton>
          </Box>

          {/* Todo Items */}
          <AnimatePresence>
            {todos.map((todo, index) => (
              <MotionBox
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                sx={{
                  p: 2,
                  mb: 2,
                  background: darkMode ? '#1a1a1a' : 'white',
                  border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  '&:hover': {
                    borderColor: darkMode ? '#666' : '#000',
                    '& .delete-btn': {
                      opacity: 1
                    }
                  }
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  sx={{
                    color: darkMode ? '#666' : '#999',
                    '&.Mui-checked': {
                      color: darkMode ? 'white' : '#000'
                    }
                  }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    flex: 1,
                    fontWeight: 500, 
                    color: todo.completed ? (darkMode ? '#666' : '#999') : (darkMode ? 'white' : '#1a1a1a'),
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {todo.text}
                </Typography>
                <IconButton
                  className="delete-btn"
                  size="small"
                  onClick={() => deleteTodo(todo.id)}
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: darkMode ? '#666' : '#999',
                    '&:hover': {
                      color: darkMode ? 'white' : '#000'
                    }
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </MotionBox>
            ))}
          </AnimatePresence>

          {todos.length === 0 && (
            <Box sx={{
              p: 4,
              textAlign: 'center',
              color: darkMode ? '#666' : '#999'
            }}>
              <Typography variant="body2">
                No tasks yet. Add one above to get started.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}