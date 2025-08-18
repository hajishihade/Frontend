# Episode Page Refactoring Proposal

## Current State Analysis

The `Episode.tsx` file has grown to **6,673 lines** with:
- **25 useState hooks** - excessive state management in one component
- **122+ constant/function declarations** - too much business logic
- Multiple responsibilities mixed together (UI, data fetching, state management, quiz logic, editor management)
- Hard-coded mock data (sequences, tables, paragraphs, venn diagrams)
- Complex nested conditionals and rendering logic

## Problems with Current Structure

1. **Unmaintainable Size**: Single file is too large to navigate and understand
2. **High Complexity**: Mixing multiple concerns makes debugging difficult
3. **Poor Testability**: Hard to unit test individual features
4. **Performance Issues**: Unnecessary re-renders due to all state in one component
5. **Code Duplication**: Similar patterns repeated for different quiz types
6. **Tight Coupling**: Business logic mixed with presentation

## Proposed Architecture

### 1. Core Structure Breakdown

```
src/
├── pages/
│   └── Episode/
│       ├── index.tsx (main container ~200 lines)
│       ├── Episode.types.ts
│       └── Episode.hooks.ts
├── components/episode/
│   ├── modes/
│   │   ├── StudyMode/
│   │   │   ├── index.tsx
│   │   │   ├── StudyMode.hooks.ts
│   │   │   └── StudyMode.types.ts
│   │   ├── PracticeMode/
│   │   │   ├── index.tsx  
│   │   │   ├── PracticeMode.hooks.ts
│   │   │   └── PracticeMode.types.ts
│   │   └── MixMode/
│   │       ├── index.tsx
│   │       ├── MixMode.hooks.ts
│   │       └── MixMode.types.ts
│   ├── editor/
│   │   ├── EpisodeEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── EditorCommands.ts
│   │   └── editor.utils.ts
│   ├── navigation/
│   │   ├── SpointNavigation.tsx
│   │   ├── ContentHierarchy.tsx
│   │   └── ProgressIndicator.tsx
│   └── session/
│       ├── SessionManager.tsx
│       ├── SessionTimer.tsx
│       └── SessionProgress.tsx
├── hooks/episode/
│   ├── useEpisodeData.ts
│   ├── useSpointNavigation.ts
│   ├── useSessionTracking.ts
│   ├── useEditorState.ts
│   └── useQuizState.ts
├── services/episode/
│   ├── episodeService.ts
│   ├── spointService.ts
│   └── contentService.ts
└── stores/
    ├── episodeStore.ts (Zustand)
    ├── editorStore.ts
    └── quizStore.ts
```

### 2. State Management Strategy

**Use Zustand for Global State:**
```typescript
// stores/episodeStore.ts
interface EpisodeStore {
  // Session data
  sessionId: string | null
  sessionData: SessionData | null
  spoints: SessionSpoint[]
  currentSpointIndex: number
  
  // Navigation
  setCurrentSpoint: (index: number) => void
  goToNext: () => void
  goToPrevious: () => void
  
  // Content
  contentCache: Map<string, any>
  saveContent: (spointId: string, content: any) => void
}
```

**Local Component State:**
- UI-specific state (modals, popovers, temporary selections)
- Form inputs before submission
- Animation/transition states

### 3. Component Responsibilities

#### Main Episode Container (~200 lines)
```typescript
// pages/Episode/index.tsx
export default function EpisodePage() {
  const { mode } = useEpisodeMode()
  const { sessionData, loading, error } = useEpisodeData()
  
  if (loading) return <EpisodeLoader />
  if (error) return <EpisodeError error={error} />
  
  return (
    <EpisodeLayout>
      <EpisodeHeader />
      <EpisodeContent>
        {mode === 'study' && <StudyMode />}
        {mode === 'practice' && <PracticeMode />}
        {mode === 'mix' && <MixMode />}
      </EpisodeContent>
      <EpisodeSidebar />
    </EpisodeLayout>
  )
}
```

#### Custom Hooks for Business Logic
```typescript
// hooks/episode/useEpisodeData.ts
export function useEpisodeData(sessionId: string) {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Data fetching logic here
  }, [sessionId])
  
  return { data, loading, error }
}
```

### 4. Data Layer Separation

**Move Mock Data to Fixtures:**
```typescript
// fixtures/episode/mockContent.ts
export const MOCK_SEQUENCES = { /* ... */ }
export const MOCK_TABLES = { /* ... */ }
export const MOCK_PARAGRAPHS = { /* ... */ }
```

**API Service Layer:**
```typescript
// services/episode/episodeService.ts
class EpisodeService {
  async getSessionData(sessionId: string) { /* ... */ }
  async getSpoints(sessionId: string) { /* ... */ }
  async saveSpointContent(spointId: string, content: any) { /* ... */ }
}
```

### 5. Implementation Steps

#### Phase 1: Extract Core Components (Week 1)
1. Create new folder structure
2. Extract StudyMode component with its logic
3. Extract PracticeMode component
4. Extract MixMode component
5. Move mock data to fixtures

#### Phase 2: State Management (Week 2)
1. Set up Zustand stores
2. Extract custom hooks
3. Migrate state from Episode.tsx to stores
4. Implement proper data flow

#### Phase 3: Editor Refactoring (Week 3)
1. Extract Editor component and toolbar
2. Create editor commands module
3. Implement editor state management
4. Add proper TypeScript types

#### Phase 4: Clean Up & Testing (Week 4)
1. Remove old Episode.tsx
2. Add unit tests for hooks
3. Add component tests
4. Performance optimization

### 6. Benefits of Refactoring

1. **Maintainability**: Each component under 500 lines
2. **Testability**: Isolated units easy to test
3. **Performance**: Better re-render optimization
4. **Reusability**: Components can be used elsewhere
5. **Developer Experience**: Easier to understand and modify
6. **Type Safety**: Better TypeScript coverage

### 7. Migration Strategy

1. **Create parallel implementation** - Don't break existing functionality
2. **Feature flag** - Toggle between old and new implementation
3. **Incremental migration** - Move one mode at a time
4. **Maintain backward compatibility** - Keep APIs consistent
5. **Comprehensive testing** - Test each migrated piece

### 8. Quick Wins (Can do immediately)

1. **Extract mock data** to separate files
2. **Create custom hooks** for data fetching
3. **Split modes** into separate components
4. **Extract editor logic** to separate module
5. **Move constants** to configuration files

### 9. Performance Optimizations

1. **Use React.memo** for expensive components
2. **Implement virtual scrolling** for long lists
3. **Lazy load** quiz components
4. **Cache API responses** in Zustand
5. **Debounce** auto-save operations

### 10. Next Steps

1. Review and approve this proposal
2. Create feature branch for refactoring
3. Set up new folder structure
4. Begin with Phase 1 extractions
5. Regular code reviews at each phase

## Conclusion

This refactoring will transform the unmaintainable 6,673-line file into a modular, testable, and maintainable architecture. The investment in refactoring will pay off through:
- Faster feature development
- Fewer bugs
- Better performance
- Improved developer experience

The gradual migration approach ensures the application remains functional throughout the refactoring process.