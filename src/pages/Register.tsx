import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Link, 
  Paper,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Fade,
  Zoom
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  School,
  Check,
  ArrowForward,
  ArrowBack,
  Psychology,
  Science,
  Code,
  Brush,
  Language,
  Calculate,
  HistoryEdu,
  Gavel
} from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'

const steps = ['Account', 'Profile', 'Preferences']

const subjects = [
  { value: 'medicine', label: 'Medicine', icon: <Psychology /> },
  { value: 'science', label: 'Science', icon: <Science /> },
  { value: 'programming', label: 'Programming', icon: <Code /> },
  { value: 'arts', label: 'Arts', icon: <Brush /> },
  { value: 'languages', label: 'Languages', icon: <Language /> },
  { value: 'mathematics', label: 'Mathematics', icon: <Calculate /> },
  { value: 'history', label: 'History', icon: <HistoryEdu /> },
  { value: 'law', label: 'Law', icon: <Gavel /> }
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    selectedSubjects: [] as string[]
  })
  const [errors, setErrors] = useState<any>({})

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 12) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) strength += 25
    setPasswordStrength(strength)
    return strength
  }

  const validateStep = () => {
    const newErrors: any = {}
    
    if (activeStep === 0) {
      if (!formData.email) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
      
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 12) newErrors.password = 'Password must be at least 12 characters'
    } else if (activeStep === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
    } else if (activeStep === 2) {
      if (formData.selectedSubjects.length === 0) newErrors.subjects = 'Select at least one subject'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit()
      } else {
        setActiveStep((prevStep) => prevStep + 1)
      }
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = async () => {
    await login(formData.email, formData.password)
    navigate('/dashboard')
  }

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter(s => s !== subject)
        : [...prev.selectedSubjects, subject]
    }))
  }

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Fade in timeout={500}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Create Your Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start your learning journey with Furbio
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  calculatePasswordStrength(e.target.value)
                }}
                error={!!errors.password}
                helperText={errors.password || 'Minimum 12 characters with mixed case, numbers, and symbols'}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              {formData.password && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Password strength
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight={600}
                      sx={{ 
                        color: passwordStrength < 50 ? '#ef4444' : 
                               passwordStrength < 75 ? '#f59e0b' : '#10b981'
                      }}
                    >
                      {passwordStrength < 50 ? 'Weak' : 
                       passwordStrength < 75 ? 'Good' : 'Strong'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={passwordStrength}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: passwordStrength < 50 ? '#ef4444' : 
                                passwordStrength < 75 ? '#f59e0b' : '#10b981'
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </Fade>
        )
        
      case 1:
        return (
          <Fade in timeout={500}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Tell Us About Yourself
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This helps us personalize your experience
                </Typography>
              </Box>
              
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={!!errors.firstName}
                helperText={errors.firstName}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={!!errors.lastName}
                helperText={errors.lastName}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Fade>
        )
        
      case 2:
        return (
          <Fade in timeout={500}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Choose Your Interests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select the subjects you'd like to focus on
                </Typography>
              </Box>
              
              {errors.subjects && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.subjects}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                {subjects.map((subject) => (
                  <Zoom in timeout={300} key={subject.value}>
                    <Chip
                      label={subject.label}
                      icon={subject.icon}
                      onClick={() => toggleSubject(subject.value)}
                      color={formData.selectedSubjects.includes(subject.value) ? 'primary' : 'default'}
                      variant={formData.selectedSubjects.includes(subject.value) ? 'filled' : 'outlined'}
                      sx={{
                        px: 2,
                        py: 3,
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        ...(formData.selectedSubjects.includes(subject.value) && {
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }),
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}
                    />
                  </Zoom>
                ))}
              </Box>
              
              {formData.selectedSubjects.length > 0 && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Selected: <strong>{formData.selectedSubjects.length} subject{formData.selectedSubjects.length > 1 ? 's' : ''}</strong>
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
        )
        
      default:
        return null
    }
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4,
        maxWidth: 500,
        mx: 'auto',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)'
        }}
      />
      
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': {
                      color: '#3b82f6'
                    },
                    '&.Mui-completed': {
                      color: '#10b981'
                    }
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Box sx={{ minHeight: 350 }}>
        {getStepContent()}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
          sx={{ borderRadius: 20 }}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={activeStep === steps.length - 1 ? <Check /> : <ArrowForward />}
          sx={{
            px: 4,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
          }}
        >
          {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </Box>
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link 
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Paper>
  )
}