import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const { darkMode } = useThemeStore()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: darkMode ? '#0a0a0a' : '#fafafa'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          width: '100%',
          maxWidth: 400,
          background: darkMode ? '#1a1a1a' : 'white',
          border: `1px solid ${darkMode ? '#333' : '#e5e5e5'}`,
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4"
            sx={{ 
              fontWeight: 600,
              color: darkMode ? 'white' : '#1a1a1a',
              mb: 1
            }}
          >
            Sign In
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ color: darkMode ? '#666' : '#999' }}
          >
            Continue to Furbio
          </Typography>
        </Box>

        {error && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 1,
              background: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
              border: `1px solid ${darkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ color: '#ef4444' }}
            >
              {error}
            </Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: darkMode ? '#666' : '#999', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                background: darkMode ? '#0a0a0a' : '#fafafa',
                borderRadius: 1,
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
                  '&::placeholder': {
                    color: darkMode ? '#666' : '#999',
                    opacity: 1
                  }
                }
              }
            }}
          />

          <TextField
            fullWidth
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: darkMode ? '#666' : '#999', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: darkMode ? '#666' : '#999' }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                background: darkMode ? '#0a0a0a' : '#fafafa',
                borderRadius: 1,
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
                  '&::placeholder': {
                    color: darkMode ? '#666' : '#999',
                    opacity: 1
                  }
                }
              }
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              background: darkMode ? 'white' : '#000',
              color: darkMode ? '#000' : 'white',
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': {
                background: darkMode ? '#f5f5f5' : '#1a1a1a',
                boxShadow: 'none'
              }
            }}
          >
            Sign In
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ color: darkMode ? '#666' : '#999' }}
            >
              Demo Mode: Use any email/password
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}