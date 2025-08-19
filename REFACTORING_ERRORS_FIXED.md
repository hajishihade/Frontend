# Refactoring Errors Fixed - Important Reminders

## Critical Errors to Avoid:

### 1. **Variable Name Mismatch**
- **Error:** `currentSpointIndex is not defined`
- **Fix:** Changed all occurrences of `currentSpointIndex` to `currentIndex`
- **Reminder:** Always check variable names match between parent and child components

### 2. **Array Access Without Null Checks**
- **Error:** `Cannot read properties of undefined (reading '0')` in Table.tsx
- **Multiple locations affected:**
  - `userTable[row][col]` - Need to check `userTable && userTable[row]` first
  - `table.correctAnswers[rowIndex][colIndex]` - Need null checks
- **Fix Applied:**
```typescript
// WRONG
const cellValue = userTable[row][col]

// CORRECT
if (!userTable || !userTable[row]) {
  return defaultValue
}
const cellValue = userTable[row][col]
```

### 3. **Editor Destroy Promise Handling**
- **Error:** `Cannot read properties of undefined (reading 'catch')`
- **Issue:** `editor.destroy()` might not return a promise
- **Fix:**
```typescript
// CORRECT way to destroy editor
if (editorRef.current && typeof editorRef.current.destroy === 'function') {
  try {
    const destroyResult = editorRef.current.destroy()
    if (destroyResult && typeof destroyResult.then === 'function') {
      await destroyResult
    }
  } catch (e) {
    console.error('Error destroying editor:', e)
  }
}
```

### 4. **Fallback Data Format Mismatch**
- **Error:** Table/Paragraph/Venn components receiving wrong data format
- **Fix:** Each quiz type needs specific fallback data structure:
```typescript
// Table needs:
{
  title: string,
  rowHeaders: string[],
  columnHeaders: string[],
  correctAnswers: string[][],
  availableCells: string[]
}

// Paragraph needs:
{
  title: string,
  text: string, // with _____ for blanks
  blanks: string[],
  availableWords: string[]
}

// Venn needs:
{
  title: string,
  circles: Array<{id, label, color}>,
  items: string[],
  correctPlacements: Record<string, string[]>
}
```

### 5. **Component Flag Issues**
- **Error:** Blank page when `USE_REFACTORED_COMPONENTS` was false but old functions were removed
- **Fix:** Set flag to `true` after removing old render functions

## Best Practices for Refactoring:

1. **Always add null checks for arrays/objects:**
   - Check array exists before accessing index
   - Check nested properties exist before accessing

2. **Match prop names exactly:**
   - Parent passes `currentIndex`, child receives `currentIndex` (not `currentSpointIndex`)

3. **Validate data structure:**
   - Ensure mock/fallback data matches component expectations
   - Different quiz types need different data structures

4. **Test incrementally:**
   - Extract component → Import it → Use it → Remove old code
   - Test after each step

5. **Handle async operations safely:**
   - Check if functions return promises before using .then() or .catch()
   - Wrap in try-catch blocks

6. **Preserve functionality:**
   - Keep the same props and behavior when extracting components
   - Don't change logic during extraction, just move it