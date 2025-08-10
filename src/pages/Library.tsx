import { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { Search, GridView, ViewList, Add } from '@mui/icons-material'
import { useContentStore } from '@/stores/contentStore'

export default function LibraryPage() {
  const { subjects, chapters } = useContentStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedChapters = selectedSubject 
    ? chapters.filter(c => c.subjectId === selectedSubject)
    : []

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Content Library
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Create Content
        </Button>
      </Box>

      {/* Search and View Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, value) => value && setViewMode(value)}
        >
          <ToggleButton value="grid">
            <GridView />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Subjects Grid */}
      <Grid container spacing={3}>
        {filteredSubjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedSubject === subject.id ? 2 : 0,
                borderColor: 'primary.main'
              }}
              onClick={() => setSelectedSubject(subject.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {subject.name}
                  </Typography>
                  <Chip 
                    label={subject.visibility} 
                    size="small"
                    color={subject.visibility === 'personal' ? 'primary' : 'default'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {subject.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {subject.chapterCount} chapters
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {subject.spointCount} SPoints
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Selected Subject's Chapters */}
      {selectedSubject && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Chapters in {subjects.find(s => s.id === selectedSubject)?.name}
          </Typography>
          <Grid container spacing={2}>
            {selectedChapters.map((chapter) => (
              <Grid item xs={12} sm={6} key={chapter.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">
                      {chapter.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chapter.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {chapter.lectureCount} lectures
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {chapter.spointCount} SPoints
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  )
}