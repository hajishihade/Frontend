import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  IconButton
} from '@mui/material'
import { Add, PlayArrow, Edit, Delete } from '@mui/icons-material'
import { useSessionStore } from '@/stores/sessionStore'
import { format } from 'date-fns'

export default function SessionsPage() {
  const navigate = useNavigate()
  const sessions = useSessionStore((state) => state.sessions)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary'
      case 'completed': return 'success'
      case 'draft': return 'default'
      default: return 'default'
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'study': return 'info'
      case 'practice': return 'secondary'
      case 'mix': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Learning Sessions
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate('/sessions/create')}
        >
          Create Session
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sessions.map((session) => (
          <Grid item xs={12} md={6} lg={4} key={session.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {session.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip 
                    label={session.mode} 
                    size="small"
                    color={getModeColor(session.mode) as any}
                  />
                  <Chip 
                    label={session.status} 
                    size="small"
                    color={getStatusColor(session.status) as any}
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Created: {format(session.createdAt, 'MMM dd, yyyy')}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      Progress
                    </Typography>
                    <Typography variant="body2">
                      {session.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={session.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {session.itemCount} items
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<PlayArrow />}
                    disabled={session.status === 'completed'}
                  >
                    {session.status === 'draft' ? 'Start' : 'Resume'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}