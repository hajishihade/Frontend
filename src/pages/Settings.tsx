import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Divider } from '@mui/material'

export default function SettingsPage() {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Email notifications"
          />
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Dark mode"
          />
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={<Switch />}
            label="Show hints in practice mode"
          />
        </CardContent>
      </Card>
    </Box>
  )
}