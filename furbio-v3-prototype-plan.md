# Comprehensive Furbio V3 React Prototype Implementation Plan

## Executive Summary

This plan details the creation of a minimal viable prototype (MVP) for Furbio V3 using React with dummy data. The prototype will demonstrate core functionality across all major features while making opinionated choices about implementation patterns, UI components, and architectural decisions.

## 1. Technology Stack & Architecture Decisions

### Core Stack
```javascript
{
  // Framework & Build
  "react": "^18.3.0",
  "typescript": "^5.4.0",
  "vite": "^5.2.0",
  
  // Routing & State
  "react-router-dom": "^6.22.0",
  "zustand": "^4.5.0", // Simpler than Redux for prototype
  
  // UI Framework - Material-UI for rapid prototyping
  "@mui/material": "^5.15.0",
  "@mui/x-data-grid": "^6.19.0",
  "@mui/x-date-pickers": "^6.19.0",
  "@mui/lab": "^5.0.0-alpha.165",
  
  // Forms & Validation
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0",
  
  // Drag & Drop
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/core": "^6.1.0",
  
  // Rich Text Editor
  "@tiptap/react": "^2.2.0",
  "@tiptap/starter-kit": "^2.2.0",
  
  // Charts
  "recharts": "^2.12.0",
  
  // Utilities
  "axios": "^1.6.0",
  "date-fns": "^3.3.0",
  "lodash": "^4.17.21",
  "react-markdown": "^9.0.0"
}
```

### Architecture Pattern
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Buttons, Cards, Modals
│   ├── forms/          # Form components
│   ├── quiz/           # Quiz format components
│   └── layouts/        # Page layouts
├── features/           # Feature modules
│   ├── auth/
│   ├── content/
│   ├── sessions/
│   ├── practice/
│   ├── quiz/
│   └── analytics/
├── hooks/              # Custom React hooks
├── services/           # API & business logic
├── stores/             # Zustand stores
├── data/               # Dummy data
├── types/              # TypeScript types
├── utils/              # Helpers
└── App.tsx
```

## 2. MVP Feature Scope

### Phase 1 MVP (2 weeks)
1. **Authentication Flow** (dummy auth)
2. **Content Hierarchy** (Subject → Chapter → SPoint)
3. **Basic Session Creation**
4. **2 Quiz Formats** (MCQ & Flashcard)
5. **Simple Practice Mode**
6. **Basic Analytics Dashboard**

### Deferred Features
- Import/Export
- Webhooks
- Device Sync
- Learning Paths
- Content Variants
- Advanced filtering

## 3. Component Implementation Plan

### 3.1 Layout Components

#### AppShell Component
```typescript
// components/layouts/AppShell.tsx
interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Furbio V3</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton><AccountCircle /></IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer variant="permanent">
        <List>
          <ListItem button component={Link} to="/library">
            <ListItemIcon><LibraryBooks /></ListItemIcon>
            <ListItemText primary="Library" />
          </ListItem>
          <ListItem button component={Link} to="/sessions">
            <ListItemIcon><Assignment /></ListItemIcon>
            <ListItemText primary="Sessions" />
          </ListItem>
          <ListItem button component={Link} to="/practice">
            <ListItemIcon><Psychology /></ListItemIcon>
            <ListItemText primary="Practice" />
          </ListItem>
          <ListItem button component={Link} to="/analytics">
            <ListItemIcon><Analytics /></ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};
```

### 3.2 Content Management Components

#### ContentTree Component (Hierarchical Navigation)
```typescript
// components/content/ContentTree.tsx
interface ContentTreeProps {
  rootType: 'subject' | 'chapter' | 'lecture';
  onSelect: (item: ContentItem) => void;
  selectedIds?: string[];
  multiSelect?: boolean;
}

const ContentTree: React.FC<ContentTreeProps> = ({
  rootType,
  onSelect,
  selectedIds = [],
  multiSelect = false
}) => {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      multiSelect={multiSelect}
      selected={selectedIds}
    >
      {/* Recursive tree rendering */}
    </TreeView>
  );
};
```

#### ContentCard Component
```typescript
// components/content/ContentCard.tsx
const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  onEdit, 
  onDelete,
  actions 
}) => {
  return (
    <Card sx={{ minWidth: 275, m: 1 }}>
      <CardContent>
        <Typography variant="h6">{content.name}</Typography>
        <Typography color="text.secondary">
          {content.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip label={content.visibility} size="small" />
          <Chip label={`${content.childCount} items`} size="small" />
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(content)}>
          Edit
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(content)}>
          Delete
        </Button>
        {actions}
      </CardActions>
    </Card>
  );
};
```

### 3.3 Quiz Format Components

#### MCQ Player Widget
```typescript
// components/quiz/MCQPlayer.tsx
interface MCQPlayerProps {
  question: string;
  options: MCQOption[];
  allowsMultiple: boolean;
  onSubmit: (selectedIds: string[]) => void;
  showResult?: boolean;
}

const MCQPlayer: React.FC<MCQPlayerProps> = ({
  question,
  options,
  allowsMultiple,
  onSubmit,
  showResult
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {question}
      </Typography>
      
      {allowsMultiple ? (
        <FormGroup>
          {options.map(option => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  checked={selected.includes(option.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected([...selected, option.id]);
                    } else {
                      setSelected(selected.filter(id => id !== option.id));
                    }
                  }}
                />
              }
              label={
                <Box>
                  {option.text}
                  {showResult && (
                    <Chip
                      size="small"
                      label={option.isCorrect ? "Correct" : "Incorrect"}
                      color={option.isCorrect ? "success" : "error"}
                    />
                  )}
                </Box>
              }
            />
          ))}
        </FormGroup>
      ) : (
        <RadioGroup
          value={selected[0] || ''}
          onChange={(e) => setSelected([e.target.value])}
        >
          {options.map(option => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.text}
            />
          ))}
        </RadioGroup>
      )}
      
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => onSubmit(selected)}
        disabled={selected.length === 0}
      >
        Submit Answer
      </Button>
    </Paper>
  );
};
```

#### Flashcard Widget
```typescript
// components/quiz/FlashcardPlayer.tsx
const FlashcardPlayer: React.FC<FlashcardProps> = ({ 
  question, 
  answer,
  onRate 
}) => {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <Box sx={{ perspective: '1000px', height: 400 }}>
      <Paper
        elevation={6}
        sx={{
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer'
        }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front Side */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Typography variant="h5">{question}</Typography>
        </Box>
        
        {/* Back Side */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Typography variant="h5">{answer}</Typography>
          {flipped && (
            <Box sx={{ mt: 3 }}>
              <Button onClick={() => onRate('easy')} color="success">
                Easy
              </Button>
              <Button onClick={() => onRate('medium')} color="warning">
                Medium
              </Button>
              <Button onClick={() => onRate('hard')} color="error">
                Hard
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
```

### 3.4 Session Management Components

#### SessionWizard Component
```typescript
// components/sessions/SessionWizard.tsx
const SessionWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [sessionData, setSessionData] = useState<Partial<Session>>({});
  
  const steps = [
    {
      label: 'Basic Info',
      component: <BasicInfoStep 
        data={sessionData}
        onUpdate={setSessionData}
      />
    },
    {
      label: 'Select Content',
      component: <ContentSelectionStep 
        data={sessionData}
        onUpdate={setSessionData}
      />
    },
    {
      label: 'Configure',
      component: <ConfigurationStep 
        data={sessionData}
        onUpdate={setSessionData}
      />
    }
  ];
  
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 4 }}>
        {steps[activeStep].component}
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={() => {
            if (activeStep === steps.length - 1) {
              // Create session
              createSession(sessionData);
            } else {
              setActiveStep(activeStep + 1);
            }
          }}
        >
          {activeStep === steps.length - 1 ? 'Create Session' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};
```

### 3.5 Practice Components

#### PracticeConfig Component
```typescript
// components/practice/PracticeConfig.tsx
const PracticeConfig: React.FC = () => {
  const [config, setConfig] = useState<PracticeConfiguration>({
    scope: 'all',
    itemCount: 20,
    formats: ['mcq', 'flashcard']
  });
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Configure Practice Session</Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Scope</Typography>
            <RadioGroup
              value={config.scope}
              onChange={(e) => setConfig({...config, scope: e.target.value})}
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
            </RadioGroup>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Settings</Typography>
            
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Number of Items</InputLabel>
              <Select
                value={config.itemCount}
                onChange={(e) => setConfig({...config, itemCount: e.target.value})}
              >
                <MenuItem value={10}>10 items</MenuItem>
                <MenuItem value={20}>20 items</MenuItem>
                <MenuItem value={50}>50 items</MenuItem>
              </Select>
            </FormControl>
            
            <FormGroup sx={{ mt: 2 }}>
              <Typography>Formats</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={config.formats.includes('mcq')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setConfig({
                          ...config,
                          formats: [...config.formats, 'mcq']
                        });
                      } else {
                        setConfig({
                          ...config,
                          formats: config.formats.filter(f => f !== 'mcq')
                        });
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
                  />
                }
                label="Flashcards"
              />
            </FormGroup>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => startPractice(config)}
        >
          Start Practice Session
        </Button>
      </Grid>
    </Grid>
  );
};
```

### 3.6 Analytics Components

#### MetricCard Component
```typescript
// components/analytics/MetricCard.tsx
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary'
}) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {change > 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                <Typography
                  variant="caption"
                  color={change > 0 ? 'success.main' : 'error.main'}
                >
                  {Math.abs(change)}% from last week
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};
```

#### PerformanceChart Component
```typescript
// components/analytics/PerformanceChart.tsx
const PerformanceChart: React.FC = () => {
  const data = generateDummyPerformanceData();
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Performance Over Time
      </Typography>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#8884d8" 
            name="Accuracy %"
          />
          <Line 
            type="monotone" 
            dataKey="items" 
            stroke="#82ca9d" 
            name="Items Practiced"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};
```

## 4. State Management with Zustand

### 4.1 Store Structure

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set({
      user: {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe'
      },
      isAuthenticated: true
    });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));
```

```typescript
// stores/contentStore.ts
interface ContentState {
  subjects: Subject[];
  chapters: Chapter[];
  currentSubject: Subject | null;
  
  // Actions
  fetchSubjects: () => Promise<void>;
  createSubject: (data: CreateSubjectData) => Promise<void>;
  selectSubject: (id: string) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  subjects: [],
  chapters: [],
  currentSubject: null,
  
  fetchSubjects: async () => {
    const subjects = await mockApi.getSubjects();
    set({ subjects });
  },
  
  createSubject: async (data) => {
    const newSubject = await mockApi.createSubject(data);
    set(state => ({
      subjects: [...state.subjects, newSubject]
    }));
  },
  
  selectSubject: (id) => {
    const subject = get().subjects.find(s => s.id === id);
    set({ currentSubject: subject });
  }
}));
```

## 5. Dummy Data Structure

### 5.1 Mock API Service

```typescript
// services/mockApi.ts
class MockApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Content hierarchy
  async getSubjects(): Promise<Subject[]> {
    await this.delay(500);
    return [
      {
        id: '1',
        name: 'Mathematics',
        description: 'Fundamental math concepts',
        visibility: 'personal',
        ownerId: '1',
        chapterCount: 5,
        spointCount: 150,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Biology',
        description: 'Life sciences and systems',
        visibility: 'global',
        ownerId: 'system',
        chapterCount: 8,
        spointCount: 240,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-20')
      }
    ];
  }
  
  async getChaptersBySubject(subjectId: string): Promise<Chapter[]> {
    await this.delay(300);
    const chapters: Record<string, Chapter[]> = {
      '1': [
        {
          id: '1-1',
          name: 'Algebra Basics',
          description: 'Introduction to algebraic concepts',
          subjectId: '1',
          lectureCount: 4,
          spointCount: 40
        },
        {
          id: '1-2',
          name: 'Geometry',
          description: 'Shapes and spatial reasoning',
          subjectId: '1',
          lectureCount: 3,
          spointCount: 35
        }
      ],
      '2': [
        {
          id: '2-1',
          name: 'Cell Biology',
          description: 'Structure and function of cells',
          subjectId: '2',
          lectureCount: 5,
          spointCount: 60
        }
      ]
    };
    
    return chapters[subjectId] || [];
  }
  
  // Quiz items
  getMCQs(): MCQ[] {
    return [
      {
        id: 'mcq-1',
        question: 'What is 2 + 2?',
        allowsMultipleAnswers: false,
        options: [
          { id: 'opt-1', text: '3', isCorrect: false },
          { id: 'opt-2', text: '4', isCorrect: true },
          { id: 'opt-3', text: '5', isCorrect: false },
          { id: 'opt-4', text: '6', isCorrect: false }
        ],
        spointIds: ['sp-1']
      },
      {
        id: 'mcq-2',
        question: 'Which of the following are prime numbers?',
        allowsMultipleAnswers: true,
        options: [
          { id: 'opt-5', text: '2', isCorrect: true },
          { id: 'opt-6', text: '4', isCorrect: false },
          { id: 'opt-7', text: '7', isCorrect: true },
          { id: 'opt-8', text: '9', isCorrect: false }
        ],
        spointIds: ['sp-2', 'sp-3']
      }
    ];
  }
  
  getFlashcards(): Flashcard[] {
    return [
      {
        id: 'fc-1',
        question: 'What is the capital of France?',
        answer: 'Paris',
        spointIds: ['sp-4']
      },
      {
        id: 'fc-2',
        question: 'What is photosynthesis?',
        answer: 'The process by which plants convert light energy into chemical energy',
        spointIds: ['sp-5']
      }
    ];
  }
  
  // Practice items
  async getPracticeItems(config: PracticeConfig): Promise<PracticeItem[]> {
    await this.delay(1000);
    
    const allItems: PracticeItem[] = [
      {
        id: 'pi-1',
        format: 'mcq',
        content: this.getMCQs()[0],
        spointId: 'sp-1',
        previousAttempts: 2,
        lastAttempt: new Date('2024-01-10'),
        wrongCount: 1,
        confidence: 3
      },
      {
        id: 'pi-2',
        format: 'flashcard',
        content: this.getFlashcards()[0],
        spointId: 'sp-4',
        previousAttempts: 5,
        lastAttempt: new Date('2024-01-15'),
        wrongCount: 0,
        confidence: 5
      }
    ];
    
    // Apply filtering based on scope
    let filtered = allItems;
    
    if (config.scope === 'wrong_only') {
      filtered = filtered.filter(item => item.wrongCount > 0);
    } else if (config.scope === 'low_confidence') {
      filtered = filtered.filter(item => item.confidence <= 2);
    }
    
    // Apply format filter
    if (config.formats && config.formats.length > 0) {
      filtered = filtered.filter(item => config.formats.includes(item.format));
    }
    
    // Return requested count
    return filtered.slice(0, config.itemCount);
  }
  
  // Analytics
  async getUserMetrics(): Promise<UserMetrics> {
    await this.delay(500);
    return {
      totalSpoints: 390,
      spointsStudied: 250,
      spointsMastered: 180,
      totalPracticeItems: 450,
      correctAnswers: 360,
      averageConfidence: 3.8,
      studyStreak: 7,
      lastActivityDate: new Date()
    };
  }
  
  async getPerformanceData(days: number = 7): Promise<PerformanceData[]> {
    await this.delay(300);
    const data: PerformanceData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        accuracy: 70 + Math.random() * 25,
        items: Math.floor(20 + Math.random() * 30),
        studyTime: Math.floor(30 + Math.random() * 60)
      });
    }
    
    return data;
  }
}

export const mockApi = new MockApiService();
```

## 6. Page Implementation Examples

### 6.1 Library Page

```typescript
// pages/Library.tsx
const LibraryPage: React.FC = () => {
  const { subjects, fetchSubjects, createSubject } = useContentStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'personal' | 'global'>('all');
  
  useEffect(() => {
    fetchSubjects();
  }, []);
  
  const filteredSubjects = subjects.filter(subject => {
    if (filter === 'all') return true;
    return subject.visibility === filter;
  });
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Content Library</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
          >
            <ToggleButton value="grid">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list">
              <ListView />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            size="small"
          >
            <MenuItem value="all">All Content</MenuItem>
            <MenuItem value="personal">My Library</MenuItem>
            <MenuItem value="global">Global Library</MenuItem>
          </Select>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Subject
          </Button>
        </Box>
      </Box>
      
      {/* Content */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredSubjects.map(subject => (
            <Grid item xs={12} sm={6} md={4} key={subject.id}>
              <ContentCard
                content={subject}
                onEdit={(s) => console.log('Edit', s)}
                onDelete={(s) => console.log('Delete', s)}
                actions={
                  <Button
                    size="small"
                    component={Link}
                    to={`/library/subjects/${subject.id}`}
                  >
                    View
                  </Button>
                }
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <DataGrid
          rows={filteredSubjects}
          columns={[
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'description', headerName: 'Description', flex: 2 },
            { field: 'visibility', headerName: 'Visibility', width: 120 },
            { field: 'chapterCount', headerName: 'Chapters', width: 100 },
            { field: 'spointCount', headerName: 'SPoints', width: 100 },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 200,
              renderCell: (params) => (
                <Box>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small">
                    <Delete />
                  </IconButton>
                  <Button
                    size="small"
                    component={Link}
                    to={`/library/subjects/${params.row.id}`}
                  >
                    View
                  </Button>
                </Box>
              )
            }
          ]}
          pageSize={10}
          autoHeight
        />
      )}
      
      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Subject</DialogTitle>
        <DialogContent>
          <CreateSubjectForm
            onSubmit={async (data) => {
              await createSubject(data);
              setCreateDialogOpen(false);
            }}
            onCancel={() => setCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
```

### 6.2 Practice Session Page

```typescript
// pages/PracticeSession.tsx
const PracticeSessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const [currentItem, setCurrentItem] = useState<PracticeItem | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [results, setResults] = useState<Map<string, boolean>>(new Map());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadNextItem();
  }, []);
  
  const loadNextItem = async () => {
    setLoading(true);
    try {
      const item = await mockApi.getNextPracticeItem(sessionId!, itemIndex);
      setCurrentItem(item);
      setItemIndex(itemIndex + 1);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (answer: any, confidence: number) => {
    if (!currentItem) return;
    
    // Simulate submission
    const isCorrect = Math.random() > 0.3; // 70% correct rate
    setResults(new Map(results).set(currentItem.id, isCorrect));
    
    // Show feedback
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Load next item or complete
    if (itemIndex < totalItems) {
      loadNextItem();
    } else {
      // Navigate to results
      navigate(`/practice/results/${sessionId}`);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Question {itemIndex} of {totalItems}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(itemIndex / totalItems) * 100}
          sx={{ mt: 1 }}
        />
      </Box>
      
      {/* Quiz Component */}
      {currentItem && (
        <Box>
          {currentItem.format === 'mcq' && (
            <MCQPlayer
              {...currentItem.content}
              onSubmit={(selectedIds) => {
                handleSubmit(selectedIds, 3);
              }}
            />
          )}
          
          {currentItem.format === 'flashcard' && (
            <FlashcardPlayer
              {...currentItem.content}
              onRate={(difficulty) => {
                const confidence = difficulty === 'easy' ? 5 : 
                                 difficulty === 'medium' ? 3 : 1;
                handleSubmit(difficulty, confidence);
              }}
            />
          )}
        </Box>
      )}
      
      {/* Confidence Selector */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography>How confident are you?</Typography>
        <Rating
          value={3}
          onChange={(e, value) => console.log('Confidence:', value)}
          size="large"
          sx={{ mt: 1 }}
        />
      </Paper>
    </Box>
  );
};
```

## 7. Router Configuration

```typescript
// App.tsx
function App() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Outlet />
                </AppShell>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/library" />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="library/subjects/:id" element={<SubjectDetailPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="sessions/new" element={<CreateSessionPage />} />
            <Route path="sessions/:id" element={<SessionWorkspace />} />
            <Route path="practice" element={<PracticeCenterPage />} />
            <Route path="practice/session/:id" element={<PracticeSessionPage />} />
            <Route path="practice/results/:id" element={<PracticeResultsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="quiz" element={<QuizFormatsPage />} />
            <Route path="quiz/mcq/new" element={<CreateMCQPage />} />
            <Route path="quiz/flashcard/new" element={<CreateFlashcardPage />} />
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Navigate to="profile" />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="preferences" element={<PreferencesSettings />} />
              <Route path="security" element={<SecuritySettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

## 8. Theme Configuration

```typescript
// theme/index.ts
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
```

## 9. Implementation Roadmap

### Week 1: Foundation
- [ ] Set up project with Vite & TypeScript
- [ ] Configure Material-UI theme
- [ ] Implement authentication flow
- [ ] Create base layouts and routing
- [ ] Set up Zustand stores

### Week 2: Content & Quiz
- [ ] Build content hierarchy components
- [ ] Implement CRUD operations for content
- [ ] Create MCQ and Flashcard components
- [ ] Add dummy data service
- [ ] Test content navigation

### Week 3: Sessions & Practice
- [ ] Build session wizard
- [ ] Implement practice configuration
- [ ] Create practice session flow
- [ ] Add results page
- [ ] Connect all flows

### Week 4: Analytics & Polish
- [ ] Create analytics dashboard
- [ ] Add charts and metrics
- [ ] Implement responsive design
- [ ] Add loading states
- [ ] Final testing and refinement

## 10. Key Technical Decisions

### Why Material-UI?
- Comprehensive component library
- Built-in theming system
- Excellent TypeScript support
- Production-ready components
- Good accessibility defaults

### Why Zustand over Redux?
- Simpler API for prototype
- Less boilerplate
- TypeScript inference works better
- Easier to learn for new developers
- Still scalable for production

### Why Vite?
- Fastest build tool
- Better developer experience
- Native ESM support
- Optimized production builds
- Great TypeScript support

### Component Architecture
- Atomic design principles
- Composition over inheritance
- Props for configuration
- Hooks for logic reuse
- Clear separation of concerns

## Conclusion

This comprehensive plan provides a complete blueprint for implementing a functional Furbio V3 prototype in React. The focus is on:

1. **Rapid Development**: Using Material-UI for quick UI building
2. **Type Safety**: Full TypeScript implementation
3. **User Experience**: Smooth flows and intuitive interfaces
4. **Maintainability**: Clean architecture and reusable components
5. **Scalability**: Patterns that can grow to production

The prototype will demonstrate all core features with dummy data while establishing patterns that can be easily connected to the real backend API when ready.