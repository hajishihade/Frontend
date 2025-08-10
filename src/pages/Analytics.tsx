import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Chip,
  LinearProgress
} from '@mui/material'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { dummyMetrics, dummyPerformanceData } from '@/data/dummyData'
import { useState } from 'react'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days')

  const subjectDistribution = [
    { name: 'Mathematics', value: 35, color: COLORS[0] },
    { name: 'Biology', value: 30, color: COLORS[1] },
    { name: 'Chemistry', value: 20, color: COLORS[2] },
    { name: 'Physics', value: 15, color: COLORS[3] }
  ]

  const formatData = [
    { format: 'MCQ', count: 450, accuracy: 78 },
    { format: 'Flashcard', count: 380, accuracy: 82 },
    { format: 'Sequence', count: 120, accuracy: 75 },
    { format: 'Drag & Drop', count: 95, accuracy: 70 }
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Analytics
        </Typography>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          size="small"
        >
          <MenuItem value="7days">Last 7 Days</MenuItem>
          <MenuItem value="30days">Last 30 Days</MenuItem>
          <MenuItem value="90days">Last 90 Days</MenuItem>
        </Select>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Study Time
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {Math.floor(dummyMetrics.totalPracticeTime / 60)}h {dummyMetrics.totalPracticeTime % 60}m
              </Typography>
              <Typography variant="caption" color="success.main">
                +12% from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Accuracy Rate
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {dummyMetrics.accuracyRate}%
              </Typography>
              <Typography variant="caption" color="success.main">
                +5% improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                SPoints Mastered
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {dummyMetrics.spointsMastered}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of {dummyMetrics.totalSpoints} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Study Streak
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {dummyMetrics.studyStreak}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                consecutive days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Performance Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dummyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke={COLORS[0]}
                    strokeWidth={2}
                    name="Accuracy %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="items" 
                    stroke={COLORS[1]}
                    strokeWidth={2}
                    name="Items Practiced"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subject Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Format Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance by Format
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={formatData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="format" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" fill={COLORS[0]} name="Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Progress
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Mastery</Typography>
                  <Typography variant="body2">
                    {Math.round((dummyMetrics.spointsMastered / dummyMetrics.totalSpoints) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(dummyMetrics.spointsMastered / dummyMetrics.totalSpoints) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Items Studied</Typography>
                  <Typography variant="body2">
                    {Math.round((dummyMetrics.spointsStudied / dummyMetrics.totalSpoints) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(dummyMetrics.spointsStudied / dummyMetrics.totalSpoints) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="secondary"
                />
              </Box>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                Weak Areas
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {dummyMetrics.weakAreas.map((area) => (
                  <Chip key={area} label={area} color="error" variant="outlined" size="small" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}