# FFURBIO Frontend Architecture Guidelines

## 🏗️ Architecture Principles

### 1. Component Design Patterns

#### Single Responsibility Principle
- Each component should have ONE clear purpose
- Components should be under 200 lines of code
- If a component grows larger, split it into smaller sub-components

#### Component Categories
```
- **Presentational Components**: Pure UI, no business logic
- **Container Components**: Handle state and data fetching
- **Layout Components**: Define page structure
- **Utility Components**: Reusable UI elements
```

### 2. Folder Structure

```
src/
├── components/           # Reusable components
│   ├── common/          # Shared across features
│   ├── layouts/         # Layout components
│   └── [feature]/       # Feature-specific components
│       ├── components/  # Sub-components
│       ├── hooks/       # Custom hooks
│       ├── context/     # Context providers
│       ├── types/       # TypeScript types
│       ├── constants/   # Constants
│       ├── utils/       # Utility functions
│       └── data/        # Static data
├── services/            # API and external services
├── store/              # Global state management
├── utils/              # Global utilities
├── types/              # Global TypeScript types
├── constants/          # Global constants
└── assets/             # Images, fonts, etc.
```

### 3. Naming Conventions

#### Files and Folders
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User.ts`)
- **Constants**: UPPER_SNAKE_CASE in files (e.g., `API_ENDPOINTS.ts`)

#### Code Conventions
```typescript
// Interfaces: PascalCase with 'I' prefix (optional) or descriptive name
interface UserProfile {
  id: string
  name: string
}

// Types: PascalCase
type ButtonVariant = 'primary' | 'secondary'

// Enums: PascalCase for name, UPPER_SNAKE_CASE for values
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3

// Functions/Variables: camelCase
const getUserData = () => {}
const isLoading = false
```

## 📝 Coding Standards

### 1. TypeScript Best Practices

#### No Any Types
```typescript
// ❌ Bad
const processData = (data: any) => {}

// ✅ Good
const processData = (data: UserData) => {}
// or
const processData = <T extends BaseData>(data: T) => {}
```

#### Strict Type Checking
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 2. React Best Practices

#### Component Structure
```typescript
// 1. Imports (sorted and grouped)
import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

// 2. Types/Interfaces
interface ComponentProps {
  title: string
  onAction: () => void
}

// 3. Component Definition
export const Component: React.FC<ComponentProps> = React.memo(({ 
  title, 
  onAction 
}) => {
  // 4. Hooks
  const [state, setState] = useState(false)
  
  // 5. Event Handlers
  const handleClick = () => {
    onAction()
  }
  
  // 6. Render
  return (
    <Box onClick={handleClick}>
      <Typography>{title}</Typography>
    </Box>
  )
})

// 7. Display name for debugging
Component.displayName = 'Component'
```

#### Custom Hooks Pattern
```typescript
// hooks/useFeature.ts
export const useFeature = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)
  
  const updateValue = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])
  
  return {
    value,
    updateValue
  }
}
```

### 3. State Management Rules

#### Context Usage
- Use Context for cross-component state
- Split contexts by feature/domain
- Avoid putting everything in one global context

```typescript
// ✅ Good - Feature-specific context
const EpisodeContext = createContext()
const AuthContext = createContext()

// ❌ Bad - Everything in one context
const GlobalContext = createContext()
```

#### Performance Optimization
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  return <ComplexVisualization data={data} />
})

// Use useMemo for expensive computations
const processedData = useMemo(() => {
  return heavyDataProcessing(rawData)
}, [rawData])

// Use useCallback for stable function references
const handleSubmit = useCallback((data: FormData) => {
  api.submit(data)
}, [])
```

### 4. Error Handling

#### Error Boundaries
```typescript
// Wrap feature sections with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <FeatureComponent />
</ErrorBoundary>
```

#### API Error Handling
```typescript
try {
  const data = await api.fetchData()
  setData(data)
} catch (error) {
  // Log to monitoring service
  logger.error('Failed to fetch data', error)
  
  // Show user-friendly message
  showNotification({
    type: 'error',
    message: 'Unable to load data. Please try again.'
  })
}
```

## 🔧 Development Workflow

### 1. Component Development Checklist

- [ ] Define clear TypeScript interfaces
- [ ] Keep component under 200 lines
- [ ] Add JSDoc comments for complex logic
- [ ] Implement error boundaries
- [ ] Add loading states
- [ ] Handle edge cases (empty data, errors)
- [ ] Optimize with React.memo if needed
- [ ] Test with different screen sizes
- [ ] Check accessibility (ARIA labels, keyboard navigation)

### 2. Code Review Checklist

- [ ] No console.logs in production code
- [ ] No any types
- [ ] Proper error handling
- [ ] Components follow single responsibility
- [ ] Hooks follow rules of hooks
- [ ] No memory leaks (cleanup in useEffect)
- [ ] Proper TypeScript types
- [ ] Constants extracted
- [ ] Code is DRY (Don't Repeat Yourself)

### 3. Performance Guidelines

#### Bundle Size
- Lazy load heavy components
- Use dynamic imports for large libraries
- Tree-shake unused code

```typescript
// Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// Dynamic import
const loadChart = async () => {
  const { Chart } = await import('chart-library')
  return new Chart(config)
}
```

#### Rendering Optimization
- Use React.memo for pure components
- Implement proper key props in lists
- Avoid inline function definitions in render
- Use CSS for animations when possible

## 🏛️ Scalability Patterns

### 1. Feature Modules

Each feature should be self-contained:
```
features/
└── episode/
    ├── index.ts           # Public API
    ├── Episode.tsx        # Main component
    ├── components/        # Feature components
    ├── hooks/            # Feature hooks
    ├── services/         # Feature services
    ├── types/            # Feature types
    └── tests/            # Feature tests
```

### 2. Dependency Injection

```typescript
// services/ServiceProvider.tsx
interface Services {
  api: ApiService
  auth: AuthService
  storage: StorageService
}

const ServiceContext = createContext<Services>()

export const useServices = () => useContext(ServiceContext)
```

### 3. Feature Flags

```typescript
// features/flags.ts
const FEATURE_FLAGS = {
  NEW_QUIZ_ENGINE: process.env.REACT_APP_NEW_QUIZ === 'true',
  BETA_FEATURES: process.env.REACT_APP_BETA === 'true'
}

// Usage
if (FEATURE_FLAGS.NEW_QUIZ_ENGINE) {
  return <NewQuizComponent />
}
return <LegacyQuizComponent />
```

## 📊 Monitoring & Debugging

### 1. Logging Strategy

```typescript
// utils/logger.ts
const logger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) console.log(message, data)
    // Send to monitoring service in production
  },
  error: (message: string, error: Error) => {
    console.error(message, error)
    // Send to error tracking service
  }
}
```

### 2. Performance Monitoring

```typescript
// Use React DevTools Profiler
<Profiler id="Episode" onRender={onRenderCallback}>
  <EpisodeComponent />
</Profiler>
```

## 🚀 Deployment Considerations

### 1. Environment Variables

```typescript
// config/env.ts
export const config = {
  API_URL: process.env.REACT_APP_API_URL,
  APP_VERSION: process.env.REACT_APP_VERSION,
  ENVIRONMENT: process.env.REACT_APP_ENV
}
```

### 2. Build Optimization

```json
// package.json scripts
{
  "build:prod": "npm run build && npm run analyze",
  "analyze": "source-map-explorer 'build/static/js/*.js'"
}
```

## 📋 Quick Reference

### Do's ✅
- Split large components
- Use TypeScript strictly
- Handle errors gracefully
- Optimize performance
- Write self-documenting code
- Follow consistent patterns
- Test edge cases

### Don'ts ❌
- Use 'any' type
- Ignore error handling
- Create components > 200 lines
- Put business logic in components
- Use inline styles extensively
- Forget cleanup in useEffect
- Mix concerns in single component

## 🔄 Continuous Improvement

This document is a living guide. Update it as:
- New patterns emerge
- Better practices are discovered
- Team grows and needs change
- Technology stack evolves

Last Updated: [Current Date]
Version: 1.0.0