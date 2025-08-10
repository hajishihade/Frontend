import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tabs,
  Tab,
  Container,
  Button,
  Divider,
  ListItemIcon,
  Chip
} from '@mui/material'
import {
  Dashboard,
  LibraryBooks,
  Assignment,
  Psychology,
  Analytics as AnalyticsIcon,
  Logout,
  Person,
  Notifications,
  School,
  Settings,
  DarkMode,
  LightMode
} from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

const navigationItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Library', icon: <LibraryBooks />, path: '/library' },
  { label: 'Sessions', icon: <Assignment />, path: '/sessions' },
  { label: 'Practice', icon: <Psychology />, path: '/practice' },
  { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' }
]

export default function AppLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useThemeStore()

  const currentTab = navigationItems.findIndex(item => item.path === location.pathname)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(navigationItems[newValue].path)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: darkMode ? '#0f172a' : '#f8fafc'
    }}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: darkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '1px solid',
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          backdropFilter: 'blur(20px)',
          color: darkMode ? '#fff' : '#1e293b'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.3)'
                }}
              >
                <School sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1
                  }}
                >
                  Furbio
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: darkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary',
                    fontSize: '0.7rem'
                  }}
                >
                  Learning Platform
                </Typography>
              </Box>
            </Box>

            {/* Navigation Tabs */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Tabs 
                value={currentTab >= 0 ? currentTab : false} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: 70,
                    px: 3,
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    '&:hover': {
                      color: darkMode ? '#fff' : 'primary.main',
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.04)'
                    },
                    '&.Mui-selected': {
                      color: '#3b82f6',
                      fontWeight: 600
                    }
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)'
                  }
                }}
              >
                {navigationItems.map((item, index) => (
                  <Tab 
                    key={item.path}
                    icon={item.icon}
                    iconPosition="start"
                    label={item.label}
                    sx={{
                      gap: 1
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Study Progress Chip */}
              <Chip
                label="78% Progress"
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 1,
                  display: { xs: 'none', md: 'flex' }
                }}
              />


              {/* Notifications */}
              <IconButton sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                <Badge 
                  badgeContent={3} 
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                      color: 'white'
                    }
                  }}
                >
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <Button
                onClick={handleMenuClick}
                sx={{
                  borderRadius: 20,
                  px: 2,
                  py: 0.75,
                  background: darkMode 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(59, 130, 246, 0.08)',
                  '&:hover': {
                    background: darkMode 
                      ? 'rgba(255,255,255,0.15)' 
                      : 'rgba(59, 130, 246, 0.12)'
                  }
                }}
                startIcon={
                  <Avatar 
                    sx={{ 
                      width: 28, 
                      height: 28,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      fontSize: '0.875rem'
                    }}
                  >
                    {user?.firstName?.[0] || 'U'}
                  </Avatar>
                }
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: darkMode ? '#fff' : 'text.primary',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  {user?.firstName || 'User'}
                </Typography>
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 2,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    background: darkMode ? '#1e293b' : '#fff'
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile Settings
                </MenuItem>
                <MenuItem onClick={() => { toggleDarkMode(); handleMenuClose(); }}>
                  <ListItemIcon>
                    {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                  </ListItemIcon>
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Preferences
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, sm: 3 }
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}