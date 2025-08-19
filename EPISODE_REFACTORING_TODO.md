# Episode.tsx Refactoring - Complete TODO & Error Prevention Guide

## 📊 Current Status
- **Original file size:** 5,054 lines
- **Current file size:** 2,625 lines (48% reduction)
- **Target file size:** ~1,000 lines (80% reduction)
- **Components extracted:** 16
- **Custom hooks created:** 6

## ⚠️ CRITICAL ERRORS TO NEVER REPEAT

### 1. **Variable Name Mismatches**
```typescript
// ❌ WRONG - Passing wrong prop name
<StudyMode currentSpointIndex={currentIndex} />

// ✅ CORRECT - Props must match exactly
<StudyMode currentIndex={currentIndex} />
```
**Prevention:** Always check prop names match between parent and child components

### 2. **Array/Object Access Without Null Checks**
```typescript
// ❌ WRONG - Will crash if userTable or row is undefined
const value = userTable[row][col]

// ✅ CORRECT - Defensive programming
if (!userTable || !userTable[row]) {
  return defaultValue
}
const value = userTable[row][col]
```
**Prevention:** ALWAYS add null checks before accessing nested properties

### 3. **Promise Handling Assumptions**
```typescript
// ❌ WRONG - Assumes destroy() returns a promise
editorRef.current.destroy().catch(e => console.error(e))

// ✅ CORRECT - Check if it's actually a promise
const result = editorRef.current.destroy()
if (result && typeof result.then === 'function') {
  await result
}
```
**Prevention:** Never assume a function returns a promise - always check

### 4. **Incorrect Mock Data Structure**
```typescript
// ❌ WRONG - Table component expects specific structure
setQuizData({ data: [] })

// ✅ CORRECT - Match exact component requirements
setQuizData({
  title: string,
  rowHeaders: string[],
  columnHeaders: string[],
  correctAnswers: string[][],
  availableCells: string[]
})
```
**Prevention:** Always verify data structure matches component's interface

### 5. **File Operations Without Reading First**
```typescript
// ❌ WRONG - Cannot write without reading first
Write(filePath, content)

// ✅ CORRECT - Read, then edit
Read(filePath)
Edit(filePath, oldContent, newContent)
```
**Prevention:** For existing files, ALWAYS use Read → Edit, not Write

### 6. **Component Extraction Without Import Updates**
```typescript
// ❌ WRONG - Extract component but forget to import
// Remove old code, forget to add import

// ✅ CORRECT - Follow this order:
// 1. Create new component file
// 2. Add import in parent
// 3. Replace old code with component
// 4. Test it works
// 5. Remove old code
```
**Prevention:** Use a systematic extraction process

## 🎯 IMMEDIATE PRIORITY TASKS

### Phase 1: Data Extraction (Reduce by ~1,000 lines)
- [ ] Create `/src/mockData/episode/` directory
- [ ] Extract contentHierarchy tree data to `hierarchyData.ts` (36 lines)
- [ ] Extract spointSequences to `sequenceData.ts` (~200 lines)
- [ ] Extract spointTables to `tableData.ts` (~150 lines)
- [ ] Extract spointParagraphs to `paragraphData.ts` (~150 lines)
- [ ] Extract spointVennDiagrams to `vennData.ts` (~100 lines)
- [ ] Extract spointMCQs to `mcqData.ts` (~150 lines)
- [ ] Extract spointFlashcards to `flashcardData.ts` (~50 lines)
- [ ] Extract contentStructure to `contentStructure.ts` (~100 lines)
- [ ] Update imports in Episode.tsx
- [ ] Test each extraction works

### Phase 2: Helper Functions Extraction (Reduce by ~200 lines)
- [ ] Create `/src/utils/episode/` directory
- [ ] Extract `validateAndCleanEditorData` to `editorUtils.ts` (85 lines)
- [ ] Extract `convertToEditorJS` to `editorUtils.ts` (80 lines)
- [ ] Extract `extractContentIdsFromHierarchy` to `hierarchyUtils.ts` (50 lines)
- [ ] Extract `filterHierarchyBySelections` to `hierarchyUtils.ts` (70 lines)
- [ ] Add proper TypeScript types for all functions
- [ ] Update imports in Episode.tsx
- [ ] Test helper functions work correctly

### Phase 3: Component Further Breakdown (Reduce by ~400 lines)
- [ ] Extract `renderTreeItems` logic to separate TreeRenderer component
- [ ] Extract practice session queue logic to QueueManager component
- [ ] Extract auto-save logic to AutoSaveManager component
- [ ] Extract drag-and-drop handlers to DragDropManager component
- [ ] Extract editor initialization logic to EditorInitializer component

### Phase 4: State Management Optimization
- [ ] Create `EpisodeContext` provider
- [ ] Combine all 6 hooks into context
- [ ] Wrap Episode component with provider
- [ ] Update child components to use context
- [ ] Remove prop drilling
- [ ] Test context works properly

### Phase 5: Type Safety Improvements
- [ ] Replace all `any` types with proper interfaces
- [ ] Create `types/episode/` directory
- [ ] Define `PracticeSessionConfig` interface properly
- [ ] Define `SessionData` interface
- [ ] Define `QuizData` interfaces for each quiz type
- [ ] Add JSDoc comments for complex types

### Phase 6: Performance Optimization
- [ ] Add React.memo to all pure components
- [ ] Implement useMemo for expensive computations
- [ ] Add useCallback for event handlers
- [ ] Implement virtual scrolling for tree view
- [ ] Add lazy loading for quiz components
- [ ] Profile and measure performance

### Phase 7: Error Handling & Recovery
- [ ] Add ErrorBoundary component
- [ ] Implement fallback UI for errors
- [ ] Add retry mechanisms for API calls
- [ ] Implement auto-save recovery
- [ ] Add user-friendly error messages
- [ ] Create error logging system

### Phase 8: Testing & Validation
- [ ] Test all quiz modes work
- [ ] Test drag-and-drop functionality
- [ ] Test practice session flow
- [ ] Test auto-save functionality
- [ ] Test error recovery
- [ ] Test with different data sizes

## 📋 EXTRACTION CHECKLIST (Use for EVERY extraction)

### Before Starting:
- [ ] Run `npm run dev` - ensure app works
- [ ] Note current line count of target file
- [ ] Identify exact code to extract
- [ ] Plan the new file structure

### During Extraction:
1. [ ] Create new component/utility file
2. [ ] Copy code to new file (don't cut yet)
3. [ ] Add all necessary imports to new file
4. [ ] Export the component/function properly
5. [ ] Import in parent file
6. [ ] Replace old code with new component/function call
7. [ ] Save and check hot reload - NO ERRORS
8. [ ] Test functionality works
9. [ ] Only NOW remove old code
10. [ ] Save and test again

### After Extraction:
- [ ] Run the app, test the feature
- [ ] Check browser console for errors
- [ ] Verify line count reduction
- [ ] Commit the working change

## 🚀 OPTIMIZATION GOALS

### File Size Targets:
- Episode.tsx: < 1,000 lines
- Each component: < 300 lines
- Each hook: < 150 lines
- Each utility: < 100 lines

### Performance Targets:
- Initial load: < 2 seconds
- Mode switch: < 100ms
- Quiz load: < 50ms
- Auto-save: < 200ms

### Code Quality Targets:
- Zero `any` types
- 100% prop validation
- All functions documented
- No console errors/warnings

## 🛠️ TOOLS TO USE

### For File Operations:
- `Read` → `Edit` for existing files
- `MultiEdit` for multiple changes
- `Grep` for searching patterns
- `Glob` for finding files

### For Testing:
- `npm run dev` - Start dev server
- `npm run typecheck` - Check types
- `npm run lint` - Check code quality
- Browser DevTools - Check for errors

## 📝 PROGRESS TRACKING

### Completed: ✅
- [x] Extract 6 quiz components
- [x] Extract 10 StudyMode toolbars
- [x] Extract Toolbar component
- [x] Extract Sidebar component
- [x] Extract PracticeSessionDialog
- [x] Create 6 custom hooks
- [x] Fix runtime errors
- [x] Remove old render functions

### In Progress: 🔄
- [ ] Extract mock data
- [ ] Extract helper functions

### Not Started: ⏳
- [ ] Create context provider
- [ ] Add error boundaries
- [ ] Performance optimization
- [ ] Type safety improvements

## 💡 REMEMBER

1. **Test after EVERY change** - Don't batch changes
2. **Use hot reload** - Don't restart server unless necessary
3. **Check browser console** - Catch errors early
4. **Preserve functionality** - Don't break working features
5. **Document complex logic** - Future you will thank you
6. **Commit working states** - Can rollback if needed
7. **Follow the checklist** - Prevents mistakes
8. **Ask user before major changes** - Especially architecture changes

## 🎯 SUCCESS CRITERIA

- [ ] Episode.tsx under 1,000 lines
- [ ] Zero console errors
- [ ] All features working
- [ ] Types properly defined
- [ ] Performance improved
- [ ] Code maintainable
- [ ] Documentation complete

---

**Last Updated:** 2025-01-19
**Next Review:** After Phase 1 completion