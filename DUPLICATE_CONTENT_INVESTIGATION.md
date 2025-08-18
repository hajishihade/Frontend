# Duplicate Content Investigation

## Problem
The Episode page is showing the same sentence/content multiple times in different blocks for a single spoint.

## Investigation Steps

### 1. Frontend Analysis
Added detailed logging to the Episode.tsx to track:
- Raw content received from backend
- Number of lines in the content
- Detection of duplicate lines within each spoint
- Conversion process to EditorJS blocks

### 2. Test Tool Created
Created `test-spoints-api.html` to directly query the backend API and analyze:
- Raw API response structure
- Content of each spoint
- Detection of duplicate lines within content
- Detection of identical content across different spoints

### 3. Key Findings

The issue appears to be that the backend is sending content with duplicate lines. Possible causes:

1. **Database Issue**: The content might be stored with duplicates in the database
   - Check the `default_content` column in the `spoints` table
   - Check the `formatted_content` column in `expanded_spoints` table

2. **Content Generation Issue**: When content is added to spoints, it might be duplicated during:
   - Initial content creation
   - Content expansion from points to spoints
   - Content formatting/processing

3. **API Processing Issue**: The backend might be:
   - Concatenating content incorrectly
   - Duplicating content during serialization
   - Merging content from multiple sources incorrectly

## Debugging Information to Check

Open the browser console on the Episode page and look for:

1. **"🔍 ANALYZING SPOINTS FOR DUPLICATES:"** - Shows analysis of each spoint
2. **"⚠️ DUPLICATE LINES in SPoint"** - Indicates which spoint has duplicate lines
3. **"🔍 convertToEditorJS input:"** - Shows exact text being converted
4. **"📄 Raw content from backend:"** - Shows the raw content received

## Backend Checks Needed

### SQL Queries to Run:

```sql
-- Check for duplicate lines in spoint content
SELECT 
    sp.id,
    sp.name,
    sp.default_content,
    LENGTH(sp.default_content) as content_length,
    (LENGTH(sp.default_content) - LENGTH(REPLACE(sp.default_content, '\n', ''))) as line_count
FROM spoints sp
JOIN expanded_spoints es ON es.spoint_id = sp.id
WHERE es.session_id = 'YOUR_SESSION_ID'
ORDER BY es.ordinal_position;

-- Check if content is duplicated during expansion
SELECT 
    p.name as point_name,
    sp.name as spoint_name,
    sp.default_content
FROM spoints sp
JOIN points p ON sp.point_id = p.id
WHERE sp.default_content LIKE '%same_text%same_text%';
```

## Possible Solutions

### If Backend is the Issue:
1. **Fix data generation**: Ensure content is not duplicated when creating spoints
2. **Clean existing data**: Remove duplicate lines from existing spoint content
3. **Fix API serialization**: Ensure content is not duplicated during API response

### If Frontend is the Issue:
1. **Already identified**: The `convertToEditorJS` function splits by `\n` and creates blocks
2. **Current behavior**: Each line becomes a separate paragraph block
3. **Proper fix**: Backend should send proper content without duplicates

## Next Steps

1. Use the test tool (`test-spoints-api.html`) to check actual API response
2. Check browser console for the detailed logs added
3. Verify if the backend is sending duplicate lines or if it's a frontend issue
4. Fix the root cause in the backend if that's where the duplication occurs

## Important Note

We should NOT mask this issue in the frontend by removing duplicates. The backend should send correct, non-duplicated content for each spoint. The frontend should display exactly what it receives to maintain data integrity.