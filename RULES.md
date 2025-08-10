# FFURBIO Frontend Development Rules & Guidelines

## 🚨 CRITICAL RULES - MUST FOLLOW

### 1. EPISODE PAGE ARCHITECTURE
- **CURRENT APPROACH**: We are using the working Episode page at `src/pages/Episode.tsx`
- This page contains the full EditorJS implementation with sidebar navigation
- All Episode-related constants are in `src/constants/episode.ts`
- All Episode-related types are in `src/types/episode.ts`
- Future refactoring should maintain all existing functionality

### 2. TYPESCRIPT STRICT MODE
- **NEVER** use `any` type - use `unknown` or proper interfaces instead
- **ALWAYS** define proper types for all function parameters and return values
- **ALWAYS** create interfaces for complex objects

### 3. STATE MANAGEMENT HIERARCHY
```
Global State (Zustand Stores) → Context API → Local Component State
```
- **NEVER** duplicate global state in local state
- **NEVER** create new stores without team discussion
- **ALWAYS** use existing stores: authStore, themeStore, contentStore, sessionStore

## 📁 PROJECT STRUCTURE RULES

### Folder Organization
```
src/
├── components/          # Reusable components only
│   └── [feature]/      # Feature-specific components
│       ├── components/ # Sub-components
│       ├── hooks/      # Custom hooks
│       ├── types/      # TypeScript types
│       ├── utils/      # Utility functions
│       ├── constants/  # Constants
│       ├── context/    # Context providers
│       └── index.ts    # Public exports
├── pages/              # Route components only
├── layouts/            # Layout wrappers
├── stores/             # Zustand stores
├── services/           # API services
├── types/              # Global TypeScript types
├── utils/              # Global utilities
└── data/              # Static/sample data
```

### Component Rules
1. **Pages** folder: Only route-level components (connected to routes in App.tsx)
2. **Components** folder: Reusable components with proper exports
3. **Feature folders**: Group related components together (like `episode/`)
4. **Index exports**: Always export through index.ts for clean imports

## 🎨 CODING STANDARDS

### Import Order & Path Aliases
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

// 2. Internal - use @/ alias CONSISTENTLY
import { useAuthStore } from '@/stores/authStore'
import { EpisodeContext } from '@/components/episode/context/EpisodeContext'

// 3. Types
import type { TreeNode, QuizQuestion } from '@/types'

// 4. Styles/Constants
import { COLORS, SIDEBAR_WIDTH } from '@/constants'
```

**RULE**: Use `@/` alias for ALL imports from src/ directory

### Component Structure
```typescript
// 1. Type definitions
interface ComponentProps {
  // Always define props interface
}

// 2. Component declaration
export const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // 3. Global state hooks
  const { darkMode } = useThemeStore()
  
  // 4. Context hooks
  const { state, actions } = useContext(SomeContext)
  
  // 5. Local state
  const [localState, setLocalState] = useState()
  
  // 6. Refs
  const elementRef = useRef()
  
  // 7. Effects
  useEffect(() => {}, [])
  
  // 8. Handlers
  const handleClick = () => {}
  
  // 9. Render helpers
  const renderSection = () => {}
  
  // 10. Main render
  return <div>...</div>
}
```

### TypeScript Best Practices
```typescript
// ❌ WRONG
const handleData = (data: any) => {}
const items: any[] = []

// ✅ CORRECT
interface DataItem {
  id: string
  name: string
  value: number
}
const handleData = (data: DataItem) => {}
const items: DataItem[] = []

// ❌ WRONG - Mixed return types without union
const getValue = (condition) => {
  if (condition) return "string"
  return 123
}

// ✅ CORRECT
const getValue = (condition: boolean): string | number => {
  if (condition) return "string"
  return 123
}
```

## 🔄 STATE MANAGEMENT RULES

### Zustand Store Pattern
```typescript
// ❌ WRONG - Don't create stores randomly
const useRandomStore = create((set) => ({...}))

// ✅ CORRECT - Follow existing pattern
interface StoreState {
  // State properties
  data: DataType
  isLoading: boolean
  
  // Actions
  fetchData: () => Promise<void>
  updateData: (data: DataType) => void
  reset: () => void
}

export const useDataStore = create<StoreState>((set) => ({
  // Initial state
  data: null,
  isLoading: false,
  
  // Actions with proper async handling
  fetchData: async () => {
    set({ isLoading: true })
    try {
      const data = await apiService.getData()
      set({ data, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch data:', error)
      set({ isLoading: false })
    }
  }
}))
```

### Context API Usage
```typescript
// Only use Context for feature-specific state management
// Example: EpisodeContext for Episode feature

// ✅ CORRECT - Feature-specific context
const EpisodeContext = createContext<EpisodeContextType>()

// ❌ WRONG - Global state in context (use Zustand instead)
const GlobalAppContext = createContext()
```

## 🎨 STYLING RULES

### Dark Mode Implementation
```typescript
// ❌ WRONG - Hardcoded colors
<Box sx={{ background: darkMode ? '#1a1a1a' : 'white' }}>

// ✅ CORRECT - Use theme constants
import { THEME_COLORS } from '@/constants/theme'

<Box sx={{ 
  background: darkMode 
    ? THEME_COLORS.dark.background 
    : THEME_COLORS.light.background 
}}>
```

### Material-UI Styling
```typescript
// Use sx prop for dynamic styles
<Box sx={{ 
  p: 2,           // Use MUI spacing units
  mt: 1,          // Consistent spacing
  display: 'flex',
  flexDirection: 'column'
}}>

// Extract complex styles to constants
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2
  }
}
```

## 🔌 API INTEGRATION RULES

### API Service Pattern
```typescript
// All API calls go through service layer
// Location: src/services/api/

class EpisodeService {
  // ✅ CORRECT - Proper error handling and typing
  async getEpisode(id: string): Promise<Episode> {
    try {
      const response = await apiClient.get<Episode>(`/episodes/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch episode ${id}:`, error)
      throw new Error('Failed to fetch episode')
    }
  }
  
  // ❌ WRONG - Direct axios calls in components
  // const response = await axios.get('/api/episodes')
}
```

### TODO Comments for API Integration
```typescript
// When implementing prototype features, mark API integration points:

// TODO: API Integration - Replace with actual API call
// Endpoint: GET /api/episodes/:id
// Response: EpisodeData
const fetchEpisodeData = async (id: string) => {
  // Temporary: Using sample data
  return sampleEpisodeData
}
```

## ⚠️ ERROR HANDLING RULES

### Use Error Boundaries
```typescript
// Wrap feature components with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <EpisodeContent />
</ErrorBoundary>
```

### Async Error Handling
```typescript
// ✅ CORRECT - Proper try-catch with user feedback
try {
  setLoading(true)
  const data = await apiService.getData()
  setData(data)
} catch (error) {
  console.error('Operation failed:', error)
  showNotification('Failed to load data. Please try again.')
} finally {
  setLoading(false)
}

// ❌ WRONG - Silent failures
apiService.getData().then(setData)
```

## 🚀 PERFORMANCE RULES

### Component Optimization
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
})

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return expensiveProcessing(rawData)
}, [rawData])

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency])
```

### Code Splitting
```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Use Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

## 📝 DOCUMENTATION RULES

### Component Documentation
```typescript
/**
 * EpisodeEditor - Main editor component for episode content
 * 
 * @component
 * @param {string} episodeId - The ID of the episode to edit
 * @param {boolean} readOnly - Whether the editor is in read-only mode
 * 
 * @example
 * <EpisodeEditor episodeId="123" readOnly={false} />
 */
```

### Function Documentation
```typescript
/**
 * Processes quiz answers and calculates the score
 * 
 * @param answers - User's answers indexed by question ID
 * @param questions - Array of quiz questions
 * @returns {number} The calculated score as a percentage
 */
const calculateScore = (
  answers: Record<string, number>, 
  questions: QuizQuestion[]
): number => {
  // Implementation
}
```

## 🧪 TESTING REQUIREMENTS

### Test File Naming
```
ComponentName.test.tsx    # Unit tests
ComponentName.spec.tsx    # Integration tests
ComponentName.e2e.tsx     # End-to-end tests
```

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should render without crashing', () => {})
  it('should handle user interactions', () => {})
  it('should integrate with API correctly', () => {})
})
```

## 🔒 SECURITY RULES

### Never Commit Sensitive Data
```typescript
// ❌ WRONG
const API_KEY = 'sk-1234567890'

// ✅ CORRECT
const API_KEY = process.env.REACT_APP_API_KEY
```

### Input Validation
```typescript
// Always validate user input
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### XSS Prevention
```typescript
// ❌ WRONG - Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRECT - Sanitize first
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

## 🚫 WHAT NOT TO DO

1. **DON'T** create new files without following the folder structure
2. **DON'T** use inline styles except for truly dynamic values
3. **DON'T** make direct API calls from components
4. **DON'T** use `var` - always use `const` or `let`
5. **DON'T** leave console.log statements in production code
6. **DON'T** ignore TypeScript errors - fix them properly
7. **DON'T** duplicate code - extract to utilities or hooks
8. **DON'T** create giant components - split when > 300 lines
9. **DON'T** mix concerns - separate logic, presentation, and data
10. **DON'T** skip error handling in async operations

## ✅ CHECKLIST BEFORE COMMITTING

- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] No `any` types used
- [ ] All TODOs have ticket references
- [ ] No console.log statements
- [ ] Proper error handling added
- [ ] Components are properly typed
- [ ] Following folder structure
- [ ] Using consistent import paths (@/)
- [ ] Dark mode support implemented
- [ ] Mobile responsive (if applicable)
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Code is under 300 lines per file
- [ ] Complex logic extracted to hooks/utils

## 🔄 GIT WORKFLOW

### Branch Naming
```
feature/description-of-feature
bugfix/description-of-bug
hotfix/critical-issue
refactor/what-is-being-refactored
```

### Commit Messages
```
feat: Add user authentication
fix: Resolve navigation issue in Episode page
refactor: Extract Episode logic to custom hooks
docs: Update API integration guide
test: Add unit tests for quiz component
style: Fix dark mode colors in sidebar
```

## 📞 CONTACTS & RESOURCES

- **Architecture Decisions**: Consult ARCHITECTURE.md
- **API Integration**: See API_INTEGRATION_GUIDE.md
- **Component Examples**: Reference src/components/episode/
- **State Management**: Check src/stores/ for patterns
- **Type Definitions**: See src/types/ for shared types

## 🎯 PRIORITY FIXES NEEDED

1. **COMPLETED**: Fixed TypeScript types in Episode.tsx
2. **COMPLETED**: Extracted constants to dedicated files
3. **HIGH**: Add proper error boundaries to all pages
4. **MEDIUM**: Implement comprehensive error handling
5. **MEDIUM**: Add loading states for async operations
6. **LOW**: Add unit tests for critical paths
7. **LOW**: Implement proper logging system

---

**Last Updated**: 2025-08-10
**Version**: 1.0.0
**Maintainer**: FFURBIO Development Team

⚠️ **Remember**: The Episode page at `src/pages/Episode.tsx` is our current working implementation. All changes must maintain its existing functionality including EditorJS features, sidebar navigation, and mode switching.