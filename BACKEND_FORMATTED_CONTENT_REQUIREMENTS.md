# Backend Check: Formatted Content for SPoints

## Overview
The Episode page now supports rich text formatting using EditorJS. The frontend needs to save and load formatted content (colors, sizes, styles, etc.) for each spoint in a session.

## Questions for Backend Team

### 1. Database Schema Check

**Question**: Does the `expanded_spoints` table already have a column for storing formatted content?

Please check:
```sql
DESCRIBE expanded_spoints;
-- or
SHOW COLUMNS FROM expanded_spoints;
```

**Looking for**: A JSON or TEXT column that could store formatted content (might be named `formatted_content`, `content_data`, `custom_content`, etc.)

If it exists:
- What is the column name?
- What is the data type?
- Is there any existing data in it?

### 2. API Endpoints Check

#### A. Save Formatted Content
**Question**: Is there an existing endpoint to save formatted/custom content for a spoint?

Check for endpoints like:
- `PUT /api/v1/sessions/{sessionId}/spoints/{expandedSpointId}/content`
- `PUT /api/v1/sessions/{sessionId}/spoints/{expandedSpointId}/formatted-content`
- `POST /api/v1/spoints/{expandedSpointId}/content`
- Or any similar endpoint

If it exists:
- What is the exact endpoint URL?
- What is the expected request format?
- What fields does it accept?
- What is the response format?

**Frontend needs to send**:
```json
{
  "formatted_content": {
    "time": 1697234567890,
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "This is <mark class=\"cdx-marker\">highlighted</mark> and <b>bold</b> text"
        }
      },
      {
        "type": "header",
        "data": {
          "text": "Header with formatting",
          "level": 2
        }
      }
    ],
    "version": "2.28.0"
  }
}
```

#### B. Get Formatted Content
**Question**: Does the existing `GET /api/v1/sessions/{sessionId}/spoints` endpoint already return formatted/custom content?

Please check the current response. Does it include any field for custom/formatted content like:
- `formatted_content`
- `custom_content`
- `user_content`
- `edited_content`

Current response structure we see:

```json
{
  "success": true,
  "data": [
    {
      "expanded_spoint_id": "esp1",
      "spoint_id": "sp1",
      "name": "Cell Biology Introduction",
      "default_content": "Plain text content...",
      "formatted_content": {
        "time": 1697234567890,
        "blocks": [...]
      },
      "is_completed": false,
      "ordinal_position": 1,
      "visibility": "global",
      "display_format": "study"
    }
  ]
}
```

### 3. Current Frontend Implementation

The frontend is currently trying to:
1. Call `PUT /api/v1/sessions/{sessionId}/spoints/{expandedSpointId}/formatted-content` to save
2. Expect formatted content in the response from `GET /api/v1/sessions/{sessionId}/spoints`

**If these don't exist**, please let us know:
- What endpoints ARE available for saving custom content?
- What is the correct way to persist user edits to spoint content?
- Is there a different approach we should use?

### 4. Authentication & Permissions

**Question**: What authentication/permissions are required to save content?
- Does the user need to own the session?
- Can any logged-in user edit content in their active session?
- Are there any restrictions on editing spoint content?

### 5. Existing Database Queries

**Question**: Can you share the current SQL queries used for:
1. Retrieving spoints for a session
2. Any existing queries that handle custom/user content

This will help us understand the current data model.

### 6. What We Need to Know

Please provide:
1. **Current database schema** for `expanded_spoints` and related tables
2. **List of available API endpoints** for spoint content management
3. **Example of current API response** from `GET /api/v1/sessions/{sessionId}/spoints`
4. **Any existing documentation** about content management in sessions

### 7. Use Case

What the frontend needs to do:
1. User edits spoint content (adds colors, formatting, etc.)
2. Auto-save after 5 seconds of no typing
3. When user returns to the spoint, show their formatted version
4. If no formatted version exists, show the default content

## If Nothing Exists Yet

If there's no current support for saving formatted content, please let us know:
1. Can this feature be added?
2. What would be the best approach given the current architecture?
3. Any constraints or considerations we should be aware of?

## Summary

We're not asking to build new features if they already exist. We need to understand:
- What's already available in the backend
- How to properly use existing endpoints
- What the correct field names and formats are

Please check your current implementation and let us know what's available!