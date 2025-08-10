import { Box, Typography } from '@mui/material'

export default function StatsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Statistics & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Performance charts and analytics coming soon...
      </Typography>
    </Box>
  )
}