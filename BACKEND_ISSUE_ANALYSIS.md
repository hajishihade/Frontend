# Backend Content Expansion Issue

## Problem Statement
When selecting specific items (e.g., only "Introduction" and "Overview Point 2"), the Episode page shows ALL content at that level, including siblings that were NOT selected.

## Root Cause Analysis

### Frontend (CreateSession.tsx)
✅ **Working Correctly**
- Only sends explicitly checked items
- Console logs show correct items being sent
- Example: If user selects 2 sections, only those 2 section IDs are sent

### Backend Behavior
❌ **Issue Identified**

When content is added via `POST /sessions/{id}/content`:

1. **Current Behavior**:
   - Receives specific content ID (e.g., section-123)
   - Adds that content to session_content table
   - May trigger auto-expansion that includes siblings
   - Returns ALL content at that level

2. **Expected Behavior**:
   - Receives specific content ID
   - Adds ONLY that content
   - Does NOT add siblings
   - Returns ONLY selected content

## Evidence from Backend Documentation

From `Ultimate_backend_docu.md`:
```typescript
// Auto-expand content if configured
if (items.some(item => item.autoExpand)) {
  for (const item of items.filter(i => i.autoExpand)) {
    await this.autoExpandContent(client, sessionId, item);
  }
}
```

This suggests the backend has auto-expansion logic that might be:
1. Expanding content to include all children
2. Including siblings when a parent level item is added

## API Endpoints Involved

1. **Content Addition**: `POST /sessions/{id}/content`
   - Adds content to session
   - May trigger auto-expansion

2. **Hierarchy Fetch**: `GET /sessions/{id}/hierarchy`
   - Returns ALL content in session
   - Used by Episode page sidebar

3. **Auto-Expand** (if called): `POST /sessions/{id}/auto-expand`
   - Explicitly expands content
   - Not called by frontend

## Solutions

### Option 1: Frontend Workaround (Quick Fix)
Modify Episode page to filter content based on what was originally selected:
1. Store selected IDs in session metadata
2. Filter hierarchy response to show only selected items
3. Hide siblings that weren't explicitly selected

### Option 2: Backend Fix (Proper Solution)
Modify backend behavior:
1. Add flag to prevent auto-expansion: `autoExpand: false`
2. Only add exact items specified
3. Respect granular selection

### Option 3: New API Parameter
Add parameter to content addition:
```json
POST /sessions/{id}/content
{
  "contentId": "section-123",
  "contentType": "section",
  "expandChildren": false,  // Don't expand to points
  "includeSiblings": false  // Don't include sibling sections
}
```

## Immediate Workaround

Since we can't modify the backend immediately, implement frontend filtering:

1. **Store Selection Intent**
   - Save selected item IDs to localStorage or session metadata
   - Track "explicit selections" vs "expanded content"

2. **Filter Episode Sidebar**
   - When displaying hierarchy, only show items that were explicitly selected
   - Hide siblings unless they were checked

3. **Visual Indicator**
   - Show which items were explicitly selected vs auto-included
   - Allow user to hide/show auto-included content

## Testing to Confirm

1. Check browser Network tab when creating session
2. Look for POST requests to `/sessions/{id}/content`
3. Verify only selected IDs are sent
4. Check GET `/sessions/{id}/hierarchy` response
5. Confirm it returns MORE than what was sent

## Recommended Action

1. **Immediate**: Implement frontend filtering (Option 1)
2. **Long-term**: Request backend change to respect granular selection
3. **Document**: Add note about this behavior for users

## Code Changes Needed

### Episode.tsx
```typescript
// Filter hierarchy based on original selection
const filterHierarchy = (hierarchy, selectedIds) => {
  // Only show items that were explicitly selected
  return hierarchy.filter(item => selectedIds.includes(item.id))
}
```

### CreateSession.tsx
```typescript
// Store selected IDs for later filtering
localStorage.setItem(`session-${sessionId}-selections`, JSON.stringify(itemsToSend))
```