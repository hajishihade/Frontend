import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material'
import {
  PlayArrow,
  MoreVert,
  ViewList,
  ViewModule,
  AccessTime,
  TrendingUp,
  Psychology,
  CheckCircle,
  Timeline
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Dummy story data
const stories = [
  {
    id: 's1',
    title: 'Endocrinology Fundamentals',
    description: 'Complete understanding of endocrine system disorders',
    progress: 73,
    lastActive: '2 hours ago',
    sessions: 12,
    totalPoints: 145,
    completedPoints: 106,
    averageScore: 82,
    trend: [
      { day: 'Mon', score: 75 },
      { day: 'Tue', score: 78 },
      { day: 'Wed', score: 80 },
      { day: 'Thu', score: 82 },
      { day: 'Fri', score: 85 }
    ]
  },
  {
    id: 's2',
    title: 'Cardiology Basics',
    description: 'Heart anatomy, physiology, and common pathologies',
    progress: 45,
    lastActive: '1 day ago',
    sessions: 8,
    totalPoints: 98,
    completedPoints: 44,
    averageScore: 75,
    trend: [
      { day: 'Mon', score: 70 },
      { day: 'Tue', score: 72 },
      { day: 'Wed', score: 74 },
      { day: 'Thu', score: 75 },
      { day: 'Fri', score: 78 }
    ]
  },
  {
    id: 's3',
    title: 'Neurology Essentials',
    description: 'Central and peripheral nervous system disorders',
    progress: 30,
    lastActive: '3 days ago',
    sessions: 5,
    totalPoints: 120,
    completedPoints: 36,
    averageScore: 68,
    trend: [
      { day: 'Mon', score: 65 },
      { day: 'Tue', score: 66 },
      { day: 'Wed', score: 67 },
      { day: 'Thu', score: 68 },
      { day: 'Fri', score: 70 }
    ]
  }
]

export default function ResumePage() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed')

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'compact' | 'detailed' | null
  ) => {
    if (newView !== null) {
      setViewMode(newView)
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Your Learning Stories
        </Typography>
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          <ToggleButton value="compact">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="detailed">
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Story List */}
      {viewMode === 'detailed' ? (
        <Grid container spacing={3}>
          {stories.map((story) => (
            <Grid item xs={12} md={6} lg={4} key={story.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {story.title}
                    </Typography>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {story.description}
                  </Typography>

                  {/* Mini Stats */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip
                      icon={<AccessTime />}
                      label={story.lastActive}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Psychology />}
                      label={`${story.sessions} sessions`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {story.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={story.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {story.completedPoints} of {story.totalPoints} points completed
                    </Typography>
                  </Box>

                  {/* Mini Chart */}
                  <Box sx={{ height: 100 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={story.trend}>
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={false}
                        />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => navigate(`/episode/${story.id}`)}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    }}
                  >
                    Resume
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/story/${story.id}`)}
                  >
                    See More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {stories.map((story, index) => (
            <Box key={story.id}>
              <ListItem
                sx={{
                  p: 2,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    {story.progress}%
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {story.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {story.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Chip
                        icon={<AccessTime />}
                        label={story.lastActive}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<CheckCircle />}
                        label={`${story.completedPoints}/${story.totalPoints} points`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<TrendingUp />}
                        label={`${story.averageScore}% avg`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => navigate(`/episode/${story.id}`)}
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                      }}
                    >
                      Resume
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/story/${story.id}`)}
                    >
                      Details
                    </Button>
                  </Box>
                </Box>
              </ListItem>
              {index < stories.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  )
}