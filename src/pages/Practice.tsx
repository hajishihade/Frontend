import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  TextField,
  MenuItem
} from '@mui/material'
import { PlayArrow } from '@mui/icons-material'

export default function PracticePage() {
  const navigate = useNavigate()
  const [config, setConfig] = useState({
    scope: 'all',
    itemCount: 20,
    formats: ['mcq', 'flashcard']
  })

  const handleStartPractice = () => {
    // Navigate to practice session with dummy session ID
    navigate('/practice/session/practice-1')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Practice Center
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Practice Scope
              </Typography>
              <RadioGroup
                value={config.scope}
                onChange={(e) => setConfig({ ...config, scope: e.target.value })}
              >
                <FormControlLabel 
                  value="all" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography>All Content</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Practice from your entire library
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="wrong_only" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography>Wrong Only</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Focus on items you've missed
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="low_confidence" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography>Low Confidence</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Items you're unsure about
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel 
                  value="bookmarked" 
                  control={<Radio />} 
                  label={
                    <Box>
                      <Typography>Bookmarked</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Your saved items
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              
              <TextField
                select
                fullWidth
                label="Number of Items"
                value={config.itemCount}
                onChange={(e) => setConfig({ ...config, itemCount: parseInt(e.target.value) })}
                margin="normal"
              >
                <MenuItem value={10}>10 items</MenuItem>
                <MenuItem value={20}>20 items</MenuItem>
                <MenuItem value={30}>30 items</MenuItem>
                <MenuItem value={50}>50 items</MenuItem>
              </TextField>

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                Quiz Formats
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.formats.includes('mcq')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfig({
                            ...config,
                            formats: [...config.formats, 'mcq']
                          })
                        } else {
                          setConfig({
                            ...config,
                            formats: config.formats.filter(f => f !== 'mcq')
                          })
                        }
                      }}
                    />
                  }
                  label="Multiple Choice"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={config.formats.includes('flashcard')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfig({
                            ...config,
                            formats: [...config.formats, 'flashcard']
                          })
                        } else {
                          setConfig({
                            ...config,
                            formats: config.formats.filter(f => f !== 'flashcard')
                          })
                        }
                      }}
                    />
                  }
                  label="Flashcards"
                />
                <FormControlLabel
                  control={<Checkbox disabled />}
                  label="Sequence Quiz (Coming Soon)"
                />
                <FormControlLabel
                  control={<Checkbox disabled />}
                  label="Drag & Drop (Coming Soon)"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Practice
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Based on your settings, the system will select the most relevant items for practice using the adaptive algorithm.
              </Typography>
              
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Algorithm Weights:
                </Typography>
                <Typography variant="caption" display="block">
                  • Wrong answers: 40%
                </Typography>
                <Typography variant="caption" display="block">
                  • Time since last review: 30%
                </Typography>
                <Typography variant="caption" display="block">
                  • Confidence level: 20%
                </Typography>
                <Typography variant="caption" display="block">
                  • Total attempts: 10%
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleStartPractice}
                disabled={config.formats.length === 0}
              >
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}