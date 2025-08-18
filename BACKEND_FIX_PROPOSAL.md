# Backend Fix Proposal: Respect Granular Content Selection

## Current Problem
When specific content items are added to a session (e.g., 2 sections out of 5), the backend returns ALL siblings when fetching the session hierarchy, not just the selected items.

## Why Backend Fix is Better Than Frontend Workarounds

### ✅ **Advantages of Backend Fix:**
1. **Single Source of Truth** - Backend knows exactly what was added
2. **Works Everywhere** - Dashboard, direct access, mobile, any client
3. **No Storage Needed** - No localStorage/sessionStorage tricks
4. **Better Performance** - Less data transferred
5. **Cleaner Code** - No complex filtering logic in frontend
6. **Consistent** - All clients see the same thing
7. **Maintainable** - Fix once, works forever

### ❌ **Disadvantages of Frontend Workarounds:**
1. **Fragile** - Breaks when accessing from different routes
2. **Storage Issues** - localStorage can be cleared, not shared across devices
3. **Complex** - Requires filtering logic in multiple places
4. **Inconsistent** - Different clients might show different content
5. **Performance** - Downloads unnecessary data then filters it out

## What Backend Is Currently Doing

### When Adding Content (`POST /sessions/{id}/content`):
```
Frontend sends: { contentId: "section-123", contentType: "section" }
Backend does:
1. Adds section-123 to session_content table ✓
2. Possibly adds all sibling sections ✗
3. Or marks parent lecture as included ✗
```

### When Fetching Hierarchy (`GET /sessions/{id}/hierarchy`):
```
Backend does:
1. Looks at session_content table
2. Finds section-123 or lecture-456
3. Returns ALL sections under that lecture ✗
4. Instead of returning ONLY section-123 ✓
```

## Proposed Backend Changes

### Option 1: Track Explicit Selections (Recommended)
```sql
-- Add column to track if content was explicitly selected or auto-included
ALTER TABLE session_content 
ADD COLUMN selection_type ENUM('explicit', 'auto_expanded', 'parent_included') 
DEFAULT 'explicit';

-- When adding content:
INSERT INTO session_content (session_id, content_id, content_type, selection_type)
VALUES (?, ?, ?, 'explicit');

-- When fetching hierarchy:
SELECT * FROM session_content 
WHERE session_id = ? 
AND selection_type = 'explicit';  -- Only return explicit selections
```

### Option 2: Store Granular Selections
```sql
-- Create a new table for granular selections
CREATE TABLE session_selections (
  session_id UUID,
  content_id UUID,
  content_type VARCHAR(50),
  include_children BOOLEAN DEFAULT true,
  exclude_ids JSON,  -- Array of excluded child IDs
  PRIMARY KEY (session_id, content_id)
);
```

### Option 3: Modify Hierarchy Endpoint
```python
# Current behavior (probably):
def get_session_hierarchy(session_id):
    content_items = get_session_content(session_id)
    for item in content_items:
        if item.type == 'section':
            # Returns ALL sections in parent lecture
            return get_all_siblings(item)  # ✗ Wrong
    
# Fixed behavior:
def get_session_hierarchy(session_id):
    content_items = get_session_content(session_id)
    hierarchy = []
    for item in content_items:
        # Only return what was explicitly added
        hierarchy.append(get_single_item_with_children(item))  # ✓ Correct
    return hierarchy
```

## API Changes Needed

### 1. Content Addition Endpoint
**Current:** `POST /sessions/{id}/content`
```json
{
  "contentId": "section-123",
  "contentType": "section"
}
```

**Enhanced (Optional):**
```json
{
  "contentId": "section-123",
  "contentType": "section",
  "includeChildren": true,    // Include all points under this section
  "includeSiblings": false    // DON'T include sibling sections
}
```

### 2. Hierarchy Endpoint
**Current:** `GET /sessions/{id}/hierarchy`
- Returns all content including siblings

**Fixed:** `GET /sessions/{id}/hierarchy`
- Returns ONLY explicitly added content
- No siblings unless they were also explicitly added

**Alternative:** Add query parameter
```
GET /sessions/{id}/hierarchy?explicit_only=true
```

## Implementation Priority

### High Priority (Must Have):
1. **Fix hierarchy endpoint** to return only selected content
2. **Track selection type** in database

### Medium Priority (Should Have):
1. **Add includeChildren flag** for granular control
2. **Store exclusion lists** for partial selections

### Low Priority (Nice to Have):
1. **Audit trail** of what was selected and why
2. **API to retrieve original selections**

## Database Query Examples

### Current Query (Problematic):
```sql
-- Probably returns all siblings
SELECT DISTINCT s.*, c.*, l.*, sec.*, p.*
FROM sessions s
JOIN session_content sc ON s.id = sc.session_id
LEFT JOIN sections sec ON sc.content_id = sec.lecture_id  -- Gets ALL sections!
WHERE s.id = ?
```

### Fixed Query:
```sql
-- Only returns exactly what was added
SELECT s.*, c.*, l.*, sec.*, p.*
FROM sessions s
JOIN session_content sc ON s.id = sc.session_id
LEFT JOIN sections sec ON sc.content_id = sec.id  -- Only the specific section
WHERE s.id = ? AND sc.content_type = 'section'
```

## Migration Strategy

1. **Add backward compatibility flag**
   ```
   GET /sessions/{id}/hierarchy?mode=explicit  // New behavior
   GET /sessions/{id}/hierarchy              // Old behavior (default)
   ```

2. **Gradual rollout**
   - Test with specific sessions first
   - Monitor for issues
   - Switch default behavior when stable

3. **Clean up frontend**
   - Remove localStorage workarounds
   - Remove filtering functions
   - Simplify Episode page

## Testing the Fix

### Test Case 1: Specific Section Selection
1. Create session
2. Add only Section 2 and Section 4 from a lecture
3. Call GET /sessions/{id}/hierarchy
4. **Expected**: Only Section 2 and 4 returned
5. **NOT**: All 5 sections

### Test Case 2: Mixed Selection
1. Add entire Chapter A
2. Add only Section 3 from Chapter B
3. **Expected**: All of Chapter A + only Section 3 from Chapter B

### Test Case 3: Single Point Selection
1. Add just one point
2. **Expected**: Only that point, no siblings

## Summary

**Current Approach**: Frontend workarounds are complex and fragile

**Correct Approach**: Backend should return only what was explicitly selected

**Key Principle**: The backend should be the single source of truth for what content belongs in a session

**Next Steps**:
1. Confirm backend code location
2. Implement the fix
3. Test thoroughly
4. Remove frontend workarounds