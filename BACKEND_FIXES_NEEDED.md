# Backend Investigation Needed

## 1. Study Time Update Endpoint (500 Error)
**Endpoint Being Called**: `POST /api/v1/sessions/{sessionId}/progress/time`

### What's Happening:
- Frontend calls this endpoint every 60 seconds
- Getting 500 Internal Server Error response
- This might mean the endpoint exists but has an error, OR it doesn't exist at all

### Questions:
1. **Does this endpoint exist?** Check your routes for `/progress/time`
2. **If it exists**, what's causing the 500 error? Check logs for:
   - Missing database tables?
   - Invalid SQL queries?
   - Missing required fields?
3. **If it doesn't exist**, is there a different endpoint for tracking study time?

### What Frontend is Sending:
```json
{
  "timeMs": 60000,  // Time in milliseconds since last update
  "pageSpointId": "expanded_spoint_id_here",  // Current spoint being studied
  "activityType": "study"
}
```

### If This Endpoint Should Exist:
Please let us know:
- The correct endpoint URL for tracking study time
- Required request format
- Expected response format

### If It's Not Needed:
Let us know if we should stop calling this endpoint entirely.

## 2. Duplicate Content in SPoints

### Issue:
The `default_content` field contains duplicate lines (same sentence appears multiple times).

### Example:
Instead of:
```
This is a sentence about biology.
```

Backend is sending:
```
This is a sentence about biology.
This is a sentence about biology.
```

### Investigation Needed:

**First, check if this is actually happening:**
1. Call `GET /api/v1/sessions/{sessionId}/spoints` 
2. Look at the `default_content` field
3. Are there duplicate lines in the content?

**If yes, check where it's coming from:**
```sql
SELECT 
    sp.id,
    sp.name,
    sp.default_content,
    LENGTH(sp.default_content) - LENGTH(REPLACE(sp.default_content, '\n', '')) as newline_count
FROM spoints sp
JOIN expanded_spoints es ON es.spoint_id = sp.id
WHERE es.session_id = 'YOUR_SESSION_ID';
```

## 3. Formatted Content Support

### What We're Trying to Do:
Save and load EditorJS formatted content (with colors, styles, etc.) for each spoint

### Questions:
1. **Is there already a way to save custom/formatted content?**
2. **Check the database schema** - does `expanded_spoints` have any columns for custom content?
3. **Are there existing endpoints** for saving user edits to spoints?

### Frontend is Currently Trying:
```
PUT /api/v1/sessions/{sessionId}/spoints/{expandedSpointId}/formatted-content
```

With this payload:
```json
{
  "formatted_content": {
    "time": 1697234567890,
    "blocks": [/* EditorJS blocks */],
    "version": "2.28.0"
  }
}
```

**If this doesn't exist**, please tell us the correct way to save user edits.

## 4. Summary - What We Need From Backend

### Please Check and Provide:

1. **Database Schema**:
   - Run `DESCRIBE expanded_spoints;` and share the results
   - Run `DESCRIBE spoints;` and share the results
   - Any other relevant tables for content storage

2. **API Documentation**:
   - List of all endpoints related to sessions and spoints
   - Especially any endpoints for:
     - Saving user edits
     - Tracking study time
     - Managing session progress

3. **Current Behavior**:
   - Check if spoints really have duplicate content
   - Check server logs for the 500 error on `/progress/time`
   - Let us know what's already implemented vs what needs to be built

4. **Correct Approach**:
   - How should we save formatted content?
   - Should we track study time? If yes, how?
   - Any other best practices we should follow?

## Note
We're not assuming nothing exists - we want to understand what's already built and use it correctly. Please help us understand the current backend implementation so we can integrate properly!