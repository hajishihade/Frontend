import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  IconButton
} from '@mui/material'
import {
  School,
  Psychology,
  AutoAwesome,
  Speed,
  TrendingUp,
  Groups,
  ArrowForward,
  Star,
  CheckCircle,
  MenuBook,
  Quiz,
  Analytics
} from '@mui/icons-material'

const features = [
  {
    icon: <AutoAwesome />,
    title: 'Adaptive Learning',
    description: 'AI-powered algorithm that adapts to your learning style and pace'
  },
  {
    icon: <Psychology />,
    title: 'Smart Practice',
    description: 'Six different practice formats to reinforce your knowledge'
  },
  {
    icon: <Analytics />,
    title: 'Detailed Analytics',
    description: 'Track your progress with comprehensive performance metrics'
  },
  {
    icon: <MenuBook />,
    title: 'Learning Stories',
    description: 'Organize your learning journey into meaningful stories'
  },
  {
    icon: <Speed />,
    title: 'Atomic Knowledge',
    description: 'Break complex topics into digestible SPoints'
  },
  {
    icon: <Groups />,
    title: 'Collaborative',
    description: 'Share and learn with friends and classmates'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Medical Student',
    avatar: 'S',
    content: 'Furbio transformed how I study. My retention improved by 40% in just 2 weeks!',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'Engineering Major',
    avatar: 'M',
    content: 'The adaptive practice system is genius. It knows exactly what I need to review.',
    rating: 5
  },
  {
    name: 'Emma Wilson',
    role: 'Law Student',
    avatar: 'E',
    content: 'Learning Stories helped me organize my entire semester. Game changer!',
    rating: 5
  }
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Navigation Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 1000
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <School sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" fontWeight={700}>
                Furbio V3
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/login')}
                sx={{ borderRadius: 20 }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ 
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                }}
              >
                Start Learning
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Chip 
                label="🚀 New in V3: Learning Stories" 
                sx={{ 
                  mb: 2,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '1px solid',
                  borderColor: 'primary.main'
                }}
              />
              <Typography 
                variant="h2" 
                fontWeight={800}
                sx={{
                  mb: 2,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Master Any Subject with Adaptive Learning
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Break complex topics into atomic knowledge units. Practice with AI-powered algorithms. Track your journey with Learning Stories.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForward />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    fontSize: '1.1rem'
                  }}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 20,
                    fontSize: '1.1rem'
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'success.main' }} />
                  <Typography variant="body2">No credit card required</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'success.main' }} />
                  <Typography variant="body2">14-day free trial</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Animated decoration circles */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    top: -50,
                    right: -50
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    bottom: -30,
                    left: -30
                  }}
                />
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  Interactive Demo
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Everything You Need to Succeed
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powerful features designed for effective learning
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Loved by Students Worldwide
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join thousands of successful learners
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  sx={{ 
                    p: 3,
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        mr: 2,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ fontSize: 20, color: '#fbbf24' }} />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    "{testimonial.content}"
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 8,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ready to Transform Your Learning?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students achieving their goals with Furbio
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              borderRadius: 30,
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  )
}