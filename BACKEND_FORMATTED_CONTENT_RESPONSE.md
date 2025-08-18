# Backend Response: Formatted Content for SPoints

## Executive Summary

Good news! The backend already has a complete system for storing and managing formatted/custom content through the **Content Variants** feature. This system is more flexible than just storing formatted content - it allows multiple variant types with session-specific or persistent storage.

## 1. Database Schema

### Current Tables

#### `content_variants` table (exists)
```sql
CREATE TABLE content_variants (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID, -- NULL for persistent, session ID for session-specific
  content_type VARCHAR(20), -- includes 'spoint'
  content_id UUID NOT NULL,
  variant_type VARCHAR(20), -- 'rewrite', 'summary', 'mnemonic', 'simplified', 'expanded'
  variant_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  context_tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

**Key Points:**
- ✅ Supports session-specific content (when `session_id` is provided)
- ✅ Supports persistent content (when `session_id` is NULL)
- ✅ Can store rich text/JSON in `variant_text` field
- ✅ Supports multiple variant types
- ✅ Has priority system for multiple variants

### NOT in `expanded_spoints` table
The `session_expanded_spoints` table does NOT have a formatted_content column. The design uses the separate `content_variants` table instead, which is more flexible.

## 2. Available API Endpoints

### A. Create/Update Formatted Content

**Endpoint**: `POST /api/v1/variants`

**Request Body**:
```json
{
  "sessionId": "uuid-of-session", // Required for session-specific content
  "contentType": "spoint",
  "contentId": "uuid-of-spoint",
  "variantType": "rewrite", // Default, can be others
  "variantText": "{\"time\":1697234567890,\"blocks\":[...]}", // Your EditorJS JSON as string
  "priority": 0,
  "contextTags": ["edited", "formatted"],
  "expiresAt": null // Optional expiration
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "variant-uuid",
    "userId": "user-uuid",
    "sessionId": "session-uuid",
    "contentType": "spoint",
    "contentId": "spoint-uuid",
    "variantType": "rewrite",
    "variantText": "{\"time\":1697234567890,\"blocks\":[...]}",
    "isActive": true,
    "priority": 0,
    "contextTags": ["edited", "formatted"],
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z",
    "expiresAt": null
  }
}
```

### B. Update Existing Variant

**Endpoint**: `PUT /api/v1/variants/{variantId}`

**Request Body**:
```json
{
  "variantText": "{\"updated\":\"content\"}",
  "isActive": true,
  "priority": 1
}
```

### C. Get Active Variant for Content

**Endpoint**: `GET /api/v1/variants/active?contentType=spoint&contentId={spointId}&sessionId={sessionId}`

**Response**: Returns the active variant if exists

### D. List All Variants

**Endpoint**: `GET /api/v1/variants?contentType=spoint&contentId={spointId}&sessionId={sessionId}`

### E. Delete Variant

**Endpoint**: `DELETE /api/v1/variants/{variantId}`

### F. Delete All Variants for Session

**Endpoint**: `DELETE /api/v1/variants/session/{sessionId}`

## 3. How to Use for Your Use Case

### Frontend Implementation Steps:

1. **Save Formatted Content**:
```javascript
// When user edits content in EditorJS
const editorData = await editor.save();

const response = await fetch('/api/v1/variants', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sessionId: currentSessionId,
    contentType: 'spoint',
    contentId: expandedSpointId, // Note: use spoint_id, not expanded_spoint_id
    variantType: 'rewrite',
    variantText: JSON.stringify(editorData), // Store as JSON string
    contextTags: ['user-edited', 'formatted']
  })
});
```

2. **Retrieve Formatted Content**:
```javascript
// Check for active variant
const response = await fetch(
  `/api/v1/variants/active?contentType=spoint&contentId=${spointId}&sessionId=${sessionId}`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);

if (response.ok && response.data.data) {
  const variant = response.data.data;
  const formattedContent = JSON.parse(variant.variantText);
  // Load into EditorJS
} else {
  // Use default content
}
```

## 4. Important Notes

### Content IDs
- Use the actual `spoint_id` (not `expanded_spoint_id`) when creating variants
- The system tracks variants by the core content ID, not the session expansion ID

### Session vs Persistent
- With `sessionId`: Content is specific to that session only
- Without `sessionId`: Content persists across all sessions
- For your use case, always include `sessionId`

### Variant Types
- Use `"rewrite"` as the default variant type for user edits
- Other types available: `summary`, `mnemonic`, `simplified`, `expanded`

### Current API Response
The `/api/v1/sessions/{id}/spoints` endpoint currently does NOT include variant data. To get formatted content:
1. First fetch spoints as normal
2. Then check for variants using the variant endpoints
3. Merge the data in frontend

## 5. Authentication & Permissions

- User must be authenticated
- User must own the session to create session-specific variants
- Variants are user-specific (each user has their own)
- No special permissions required beyond normal authentication

## 6. Recommended Frontend Approach

```javascript
// Enhanced SPoint component
async function loadSPointContent(expandedSpointId, spointId, sessionId) {
  // 1. Check for variant first
  try {
    const variantResponse = await getActiveVariant(spointId, sessionId);
    if (variantResponse.success && variantResponse.data) {
      return {
        content: JSON.parse(variantResponse.data.variantText),
        isFormatted: true,
        variantId: variantResponse.data.id
      };
    }
  } catch (e) {
    console.log('No variant found, using default');
  }
  
  // 2. Fall back to default content
  return {
    content: defaultContent,
    isFormatted: false
  };
}

// Auto-save implementation
async function autoSaveContent(editorData, spointId, sessionId, variantId = null) {
  const payload = {
    variantText: JSON.stringify(editorData),
    contextTags: ['auto-saved', new Date().toISOString()]
  };
  
  if (variantId) {
    // Update existing
    return await updateVariant(variantId, payload);
  } else {
    // Create new
    return await createVariant({
      ...payload,
      sessionId,
      contentType: 'spoint',
      contentId: spointId,
      variantType: 'rewrite'
    });
  }
}
```

## Summary

✅ **Backend fully supports** storing formatted content through the Variants system  
✅ **All necessary endpoints exist** - no new backend work needed  
✅ **Session-specific storage** is supported  
✅ **Rich text/JSON storage** works perfectly in `variant_text` field  

The frontend just needs to:
1. Use the variant endpoints to save EditorJS data
2. Check for variants when loading spoints
3. Handle the JSON serialization/deserialization

No backend changes required! 🎉