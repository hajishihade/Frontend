# Furbio V3 Complete API Reference

**Version**: 3.1  
**Base URL**: `http://localhost:3002/api/v1`  
**Last Updated**: 2024-11-XX

## Available Route Modules (30+)

- **Authentication**: `/auth`
- **Content Hierarchy**: `/subjects`, `/chapters`, `/lectures`, `/sections`, `/points`, `/spoints`
- **Quiz Formats**: `/mcqs`, `/flashcards`, `/sequence-quizzes`, `/drag-drop-tables`, `/paragraph-blanks`, `/venn-diagrams`
- **Sessions**: `/sessions`, `/session-state`
- **Stories**: `/stories` (NEW in v3.1)
- **Practice**: `/practice`, `/quiz`
- **User Features**: `/users/me/metrics`, `/users/me/preferences`, `/users/me/config`
- **Content Features**: `/variants`, `/tags`, `/imports`, `/export`
- **Advanced**: `/webhooks`, `/devices`, `/sync`, `/activities`, `/notifications`
- **System**: `/config`, `/learning-paths`

## Quick Start

### Configuration
```javascript
const API_BASE = 'http://localhost:3002/api/v1';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}` // Required for most endpoints
};
```

### Response Format
```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null,
  "meta": {
    "timestamp": "2024-01-20T10:30:00.000Z",
    "requestId": "req_abc123def456"
  }
}
```

## Authentication

### Register
```http
POST /auth/register
{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "SecurePass123!@#",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```http
POST /auth/login
{
  "emailOrUsername": "john@example.com",
  "password": "SecurePass123!@#"
}
```
Returns: `{ token, refreshToken, user }`

### Refresh Token
```http
POST /auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

## Content Management

### Content Hierarchy
Subject → Chapter → Lecture → Section → Point → SPoint

### Create Content
```http
POST /subjects
{
  "name": "Mathematics",
  "description": "Math topics",
  "visibility": "personal"
}

POST /chapters
{
  "name": "Algebra",
  "description": "Basic algebra",
  "subjectId": "uuid",
  "orderIndex": 1
}

POST /spoints
{
  "name": "2+2=4",
  "defaultContent": "Two plus two equals four",
  "visibility": "personal"
}
```

### Link Content (Many-to-Many)
```http
POST /subjects/{subjectId}/chapters/{chapterId}
POST /chapters/{chapterId}/lectures/{lectureId}
POST /points/{pointId}/spoints/{spointId}
```

## Session Management

### Create Session
```http
POST /sessions
{
  "name": "Study Algebra",
  "mode": "study" // or "practice" or "mix"
}
```

### Add Content to Session
```http
POST /sessions/{id}/content
{
  "contentId": "uuid",
  "contentType": "subject" // or chapter/lecture/section/point/spoint
}
```

### Expand & Generate Pages
```http
POST /sessions/{id}/auto-expand    // Expand to spoints
POST /sessions/{id}/pages/generate  // Create study pages
```

### Session State Management
```http
PUT /sessions/{id}/activate    // Resume session
PUT /sessions/{id}/complete    // Complete session
```

## Learning Stories (v3.1)

Stories are containers for organizing related sessions and tracking progress over time.

### Create Story
```http
POST /stories
{
  "name": "My Diabetes Learning Journey",
  "description": "Tracking my progress in understanding diabetes"
}
```

### List Stories
```http
GET /stories
```

### Get Story Details
```http
GET /stories/{id}
```

### Update Story
```http
PUT /stories/{id}
{
  "name": "Updated name",
  "description": "Updated description",
  "status": "active" // or "archived"
}
```

### Delete Story (Soft Delete)
```http
DELETE /stories/{id}
```
Note: Sessions associated with the story are preserved

### Get Story Sessions
```http
GET /stories/{id}/sessions
```

### Get Story Progress
```http
GET /stories/{id}/progress
```
Returns overall progress metrics and session impact analysis

### Track SPoint Timeline
```http
GET /stories/{id}/timeline/{spointId}
```
Shows how a specific SPoint performed across all story sessions

### Associate Session with Story
```http
POST /sessions
{
  "name": "Diabetes Study Session 1",
  "mode": "study",
  "storyId": "story_uuid"  // Optional story association
}
```

### Get Session Snapshots
```http
GET /stories/sessions/{sessionId}/snapshots
```
Returns all metric snapshots taken during session lifecycle

### Get Session Impact
```http
GET /stories/sessions/{sessionId}/impact
```
Analyzes the learning impact of a specific session

### Create Session from Weak Points
```http
POST /stories/sessions/from-weak-points
{
  "sourceSessionId": "session_uuid",
  "threshold": 0.6,  // Optional, default 0.6
  "name": "Weak Points Practice"
}
```

## Quiz Formats

### 1. MCQ (Multiple Choice)
```http
POST /mcqs
{
  "question": "What is 2+2?",
  "allows_multiple_answers": false,
  "options": [
    { "option_text": "3", "is_correct": false },
    { "option_text": "4", "is_correct": true }
  ],
  "spoint_ids": ["uuid1", "uuid2"]  // Automatically links CORRECT options to these spoints!
}

POST /mcqs/{id}/validate
{
  "selectedOptionIds": ["optionId"]
}

// Note: MCQ option-level spoint connections are handled automatically:
// - When creating/updating MCQ with spoint_ids, correct options are linked
// - When querying by spoint, it uses these option-level connections
// - No separate endpoints needed - it's built into the CRUD operations!
```

### 2. Flashcards
```http
POST /flashcards
{
  "question": "What is the capital of France?",
  "answer": "Paris",
  "spoint_ids": ["uuid"]
}
```

### 3. Sequence Quiz
```http
POST /sequence-quizzes
{
  "name": "Order of operations",
  "instructions": "Arrange in correct order",
  "allows_alternative_orders": false,
  "steps": [
    { "content": "Parentheses", "correct_position": 1 },
    { "content": "Multiplication", "correct_position": 2 }
  ]
}

// Cell-level spoint connection
POST /sequence-quizzes/{id}/steps/{stepId}/spoints
{
  "spoint_ids": ["uuid1", "uuid2"]
}
```

### 4. Drag-Drop Table
```http
POST /drag-drop-tables
{
  "name": "Multiplication Table",
  "instructions": "Fill in the blanks",
  "rows": 3,
  "columns": 3,
  "cells": [
    {
      "row_position": 0,
      "column_position": 0,
      "content": "×",
      "is_header_row": true,
      "is_header_column": true
    },
    {
      "row_position": 1,
      "column_position": 2,
      "content": " ",
      "correct_answer": "6",
      "is_draggable": true
    }
  ]
}

// Cell-level spoint connection
POST /drag-drop-tables/{id}/cells/{cellId}/spoints
{
  "spoint_ids": ["uuid"]
}

POST /drag-drop-tables/{id}/validate
{
  "solution": [
    { "cellId": "uuid", "answer": "12" },
    { "cellId": "uuid", "answer": "15" }
  ]
}
```

### 5. Paragraph Blanks
```http
POST /paragraph-blanks
{
  "text_template": "The capital of ___ is Paris",
  "instructions": "Fill in the blanks",
  "answers": [
    { "blank_number": 1, "correct_answer": "France" }
  ]
}

// Cell-level spoint connection
POST /paragraph-blanks/{id}/blanks/{answerId}/spoints
{
  "spoint_ids": ["uuid"]
}
```

### 6. Venn Diagram
```http
POST /venn-diagrams
{
  "title": "Number Classification",
  "instructions": "Classify the numbers",
  "left_circle_label": "Even",
  "right_circle_label": "Prime",
  "items": [
    { "content": "2", "correct_placement": "intersection" },
    { "content": "3", "correct_placement": "right" },
    { "content": "4", "correct_placement": "left" },
    { "content": "5", "correct_placement": "outside" }
  ]
}

// Cell-level spoint connection
POST /venn-diagrams/{id}/items/{itemId}/spoints
{
  "spoint_ids": ["uuid"]
}
```

## Practice System

### Start Practice Session
```http
POST /practice/start
{
  "scope": "wrong_only", // or "global", "bookmarked", "low_confidence"
  "itemCount": 20,
  "formats": ["mcq", "flashcard"], // optional filter
  "tags": ["hard_for_me"] // optional filter
}
```

### Submit Practice Answer
```http
POST /practice/items/{id}/submit
{
  "answer": "user's answer",
  "confidence": 3, // 1-5
  "timeSpentMs": 15000
}
```

### Tag Items
```http
POST /spoints/{id}/tags
{
  "tags": ["hard_for_me", "review_later"]
}
```

## Metrics & Analytics

### Get User Metrics
```http
GET /users/me/metrics
GET /users/me/weak-areas
GET /users/me/activity-stats
GET /subjects/{id}/metrics
```

## Key Implementation Notes

1. **Authentication**: Required for all endpoints except `/health/*`
2. **Cell-Level Tracking**: 4/6 quiz formats support granular spoint connections
3. **Many-to-Many**: All content relationships are many-to-many
4. **Soft Delete**: Use `is_deleted` field, items not actually removed
5. **Pagination**: Use `limit` and `offset` query params
6. **Filtering**: Most list endpoints support filtering by visibility, owner, etc.

## Error Codes
- `AUTH_TOKEN_INVALID` - Invalid or expired token
- `RESOURCE_NOT_FOUND` - Item doesn't exist
- `VALIDATION_FAILED` - Invalid request data
- `PERMISSION_DENIED` - No access to resource
- `BUSINESS_RULE_VIOLATION` - Operation not allowed

## Additional Features

### Content Adoptions
```http
GET /spoints/{id}/adoption-tree
POST /spoints/{id}/adopt
DELETE /spoints/{id}/unadopt
```

### Content Variants
```http
POST /variants
{
  "contentType": "spoint",
  "contentId": "uuid",
  "variantType": "rewrite",
  "variantText": "Alternative text"
}
GET /variants/{contentType}/{contentId}
```


### Import System
```http
POST /imports
{
  "name": "Import job name",
  "contentType": "spoint"
}
POST /imports/{jobId}/upload (multipart/form-data)
GET /imports/{jobId}/preview
POST /imports/{jobId}/confirm
```

### Export System
```http
POST /export/data
{
  "format": "csv", // or "json", "excel", "pdf", "markdown"
  "entities": ["subjects", "spoints"]
}
GET /export/session/{id}?format=pdf
POST /export/quiz-results
```

### Webhooks
```http
POST /webhooks
{
  "url": "https://your-endpoint.com",
  "events": ["session.created", "quiz.submitted"],
  "customHeaders": {}
}
```

### Device Sync
```http
POST /devices/register
GET /devices
POST /sync/pull
POST /sync/push
POST /sync/resolve-conflicts
```

### Activity Tracking
```http
GET /activities
GET /activities/recent
GET /activities/stats
```

### Learning Paths
```http
POST /learning-paths
GET /learning-paths/user
POST /learning-paths/{id}/start
POST /learning-paths/{id}/progress
```

### Configuration
```http
GET /config/{key}
PUT /config/{key}
GET /config/presets
POST /config/apply-preset
```

### Notifications
```http
GET /notifications
POST /notifications/mark-read
GET /notifications/preferences
PUT /notifications/preferences
```

## Rate Limits
- Authenticated: 1000 requests/hour
- Unauthenticated: 100 requests/hour