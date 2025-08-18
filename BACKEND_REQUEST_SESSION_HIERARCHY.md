# Backend Request: Session Content Hierarchy Endpoint

## Problem
The Episode page sidebar needs to show the full content hierarchy for a session:
- Subject > Chapter > Lecture > Section > Point > SPoints

Currently, the `/sessions/{id}/spoints` endpoint returns flat spoints without hierarchy information.

## Required Endpoint

### GET /api/v1/sessions/{sessionId}/hierarchy

Returns the complete content hierarchy for a session, organized by subjects, chapters, lectures, sections, and points.

### Expected Response Format
```json
{
  "success": true,
  "data": {
    "sessionId": "abc123",
    "sessionName": "Study Session 1",
    "storyId": "story123",
    "storyName": "Medical School Story",
    "subjects": [
      {
        "id": "subj1",
        "name": "Anatomy",
        "chapters": [
          {
            "id": "chap1",
            "name": "Cardiovascular System",
            "lectures": [
              {
                "id": "lec1",
                "name": "Heart Anatomy",
                "sections": [
                  {
                    "id": "sec1",
                    "name": "Heart Chambers",
                    "points": [
                      {
                        "id": "point1",
                        "name": "Left Ventricle",
                        "spoints": [
                          {
                            "expanded_spoint_id": "esp1",
                            "spoint_id": "sp1",
                            "name": "Left ventricle pumps oxygenated blood",
                            "is_completed": false
                          },
                          {
                            "expanded_spoint_id": "esp2",
                            "spoint_id": "sp2",
                            "name": "Thickest chamber wall",
                            "is_completed": true
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Alternative: Enhance Existing Endpoint

If creating a new endpoint is not preferred, enhance `/sessions/{id}/spoints` to include hierarchy info:

```json
{
  "success": true,
  "data": {
    "sessionName": "Study Session 1",
    "storyName": "Medical School Story",
    "spoints": [
      {
        "expanded_spoint_id": "esp1",
        "spoint_id": "sp1",
        "name": "Left ventricle pumps oxygenated blood",
        "is_completed": false,
        "hierarchy": {
          "subject_name": "Anatomy",
          "subject_id": "subj1",
          "chapter_name": "Cardiovascular System",
          "chapter_id": "chap1",
          "lecture_name": "Heart Anatomy",
          "lecture_id": "lec1",
          "section_name": "Heart Chambers",
          "section_id": "sec1",
          "point_name": "Left Ventricle",
          "point_id": "point1"
        }
      }
    ]
  }
}
```

## SQL Query Suggestion

```sql
SELECT 
  es.id as expanded_spoint_id,
  es.spoint_id,
  es.is_completed,
  sp.name as spoint_name,
  p.id as point_id,
  p.name as point_name,
  sec.id as section_id,
  sec.name as section_name,
  l.id as lecture_id,
  l.name as lecture_name,
  c.id as chapter_id,
  c.name as chapter_name,
  sub.id as subject_id,
  sub.name as subject_name,
  s.name as session_name,
  st.name as story_name
FROM expanded_spoints es
JOIN spoints sp ON es.spoint_id = sp.id
JOIN points p ON sp.point_id = p.id
JOIN sections sec ON p.section_id = sec.id
JOIN lectures l ON sec.lecture_id = l.id
JOIN chapters c ON l.chapter_id = c.id
JOIN subjects sub ON c.subject_id = sub.id
JOIN sessions s ON es.session_id = s.id
LEFT JOIN stories st ON s.story_id = st.id
WHERE es.session_id = ?
ORDER BY sub.order_index, c.order_index, l.order_index, sec.order_index, p.order_index, es.ordinal_position
```

## Priority
**HIGH** - The Episode page sidebar cannot show proper hierarchy without this data.

## Current Workaround
Currently grouping spoints artificially into "Section 1, 2, 3" which doesn't reflect the actual content structure.