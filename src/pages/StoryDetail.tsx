import { Box, Typography } from '@mui/material'

export default function StoryDetailPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Story Details
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Session timeline and progress details coming soon...
      </Typography>
    </Box>
  )
}