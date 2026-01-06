# REST API Endpoints Specification

## Base URL
- Development: `http://localhost:8000`
- Production: `https://your-backend.railway.app`

## Authentication
Protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2025-01-06T12:00:00Z"
}
```

**Errors:**
- 400: Username/email already exists
- 400: Invalid input (validation error)

---

### POST /api/auth/login
Login and receive JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 401: Invalid credentials

---

## Task Endpoints (Protected)

### GET /api/tasks
Get all tasks for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2025-01-06T10:00:00Z",
    "updated_at": "2025-01-06T10:00:00Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "title": "Finish report",
    "description": "",
    "completed": true,
    "created_at": "2025-01-06T11:00:00Z",
    "updated_at": "2025-01-06T12:00:00Z"
  }
]
```

---

### POST /api/tasks
Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New task",
  "description": "Optional description"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "user_id": 1,
  "title": "New task",
  "description": "Optional description",
  "completed": false,
  "created_at": "2025-01-06T13:00:00Z",
  "updated_at": "2025-01-06T13:00:00Z"
}
```

---

### PUT /api/tasks/{task_id}
Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (partial update allowed):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2025-01-06T10:00:00Z",
  "updated_at": "2025-01-06T14:00:00Z"
}
```

**Errors:**
- 404: Task not found
- 403: Task belongs to another user

---

### DELETE /api/tasks/{task_id}
Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
- 404: Task not found
- 403: Task belongs to another user

---

## Error Response Format
All errors return:
```json
{
  "detail": "Error message here"
}
```

## CORS
Backend allows requests from:
- `http://localhost:3000` (development)
- Production frontend URL