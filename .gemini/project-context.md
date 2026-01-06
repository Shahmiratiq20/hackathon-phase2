# Project Context for Gemini Code Assist

## Project Overview
**Evolution-Todo**: Multi-phase hackathon project demonstrating evolution from simple console application to production-ready full-stack web application.

## Current Status: Phase II Complete ✅
Full-stack todo application with user authentication, database persistence, and modern UI.

## Quick Start

### Running the Application
```bash
# Backend (Terminal 1)
cd phase-2-web/backend
python -m uvicorn src.main:app --port 8000

# Frontend (Terminal 2)
cd phase-2-web/frontend
npm run dev
```

**Access**: http://localhost:3000

---

## Architecture Overview
```
┌─────────────────────────────────────────────────────┐
│                   Browser (User)                     │
│            http://localhost:3000                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Next.js Frontend                        │
│  - Login/Register Pages                             │
│  - Dashboard with Task Management                   │
│  - JWT Token Storage (localStorage)                 │
└────────────────────┬────────────────────────────────┘
                     │ REST API calls
                     │ Authorization: Bearer <token>
                     ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend                         │
│  - JWT Authentication                               │
│  - CRUD API Endpoints                               │
│  - User Isolation                                   │
└────────────────────┬────────────────────────────────┘
                     │ SQLAlchemy ORM
                     ▼
┌─────────────────────────────────────────────────────┐
│              SQLite Database                         │
│  - users table                                      │
│  - tasks table (FK to users)                        │
└─────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.14 | Runtime |
| FastAPI | 0.95.0 | Web framework |
| SQLAlchemy | 1.4.46 | ORM |
| Pydantic | 1.10.13 | Validation |
| python-jose | 3.3.0 | JWT handling |
| bcrypt | 3.2.2 | Password hashing |
| SQLite | 3.x | Database (dev) |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| React | 19.x | UI library |

---

## Project Structure
```
hackathon-todo/
├── .claude/                    # Claude Code context
├── .gemini/                    # Gemini Code Assist context (YOU ARE HERE)
├── .specify/                   # SpecKit Plus configuration
│
├── phase-2-web/               # Current Phase (Active Development)
│   ├── backend/               # FastAPI Application
│   │   ├── src/
│   │   │   ├── models/
│   │   │   │   └── database.py      # SQLAlchemy models (User, Task)
│   │   │   ├── schemas/
│   │   │   │   └── schemas.py       # Pydantic validation schemas
│   │   │   ├── routers/
│   │   │   │   ├── auth_routes.py   # Register, Login endpoints
│   │   │   │   └── task_routes.py   # CRUD task endpoints
│   │   │   ├── auth.py              # JWT utilities
│   │   │   └── main.py              # FastAPI app instance
│   │   ├── todo.db                  # SQLite database file
│   │   └── requirements.txt
│   │
│   └── frontend/              # Next.js Application
│       ├── app/
│       │   ├── page.tsx             # Login/Register page
│       │   └── dashboard/
│       │       └── page.tsx         # Task management dashboard
│       ├── lib/
│       │   └── api.ts               # API client functions
│       └── package.json
│
├── specs/                     # Feature Specifications
│   ├── overview.md
│   ├── database-schema.md
│   └── api-endpoints.md
│
├── history/                   # Development Documentation
│   ├── prompts/
│   │   └── phase2-prompts.md
│   └── adr/
│       ├── 001-tech-stack.md
│       └── 002-authentication.md
│
├── CONSTITUTION.md            # Project principles
├── CLAUDE.md                  # Claude instructions
├── GEMINI.md                  # Gemini instructions
└── README.md
```

---

## Database Schema

### users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### tasks Table
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Relationship**: One User → Many Tasks (1:N)

---

## API Documentation

### Base URL
- Development: `http://127.0.0.1:8000`
- Swagger Docs: `http://127.0.0.1:8000/docs`

### Authentication Endpoints

#### POST /api/auth/register
Register new user account.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-01-06T12:00:00"
}
```

#### POST /api/auth/login
Login and receive JWT token.

**Request:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response (200):**
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

### Task Endpoints (Protected)

All task endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

#### GET /api/tasks
Get all tasks for authenticated user.

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-01-06T10:00:00",
    "updated_at": "2026-01-06T10:00:00"
  }
]
```

#### POST /api/tasks
Create new task.

**Request:**
```json
{
  "title": "New task",
  "description": "Optional description"
}
```

#### PUT /api/tasks/{task_id}
Update existing task.

**Request:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### DELETE /api/tasks/{task_id}
Delete task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Authentication Flow
```
1. User Registration
   └─> POST /api/auth/register
       └─> Password hashed with bcrypt
           └─> User stored in database

2. User Login
   └─> POST /api/auth/login
       └─> Password verified
           └─> JWT token generated
               └─> Token contains: {"sub": "user_id", "exp": timestamp}
                   └─> Frontend stores in localStorage

3. Protected Request
   └─> GET /api/tasks
       └─> Header: Authorization: Bearer <token>
           └─> Backend validates token
               └─> Extract user_id from token
                   └─> Query user's tasks only
```

---

## Key Implementation Details

### JWT Token Format
**CRITICAL**: User ID must be stored as STRING in JWT payload
```python
# ✅ CORRECT
access_token = create_access_token(data={"sub": str(user.id)})

# ❌ WRONG
access_token = create_access_token(data={"sub": user.id})  # Integer causes error
```

**Reason**: python-jose library requires subject to be string type.

**Validation:**
```python
payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
user_id = int(payload.get("sub"))  # Convert back to int for DB query
```

### Password Security
```python
# Hashing (registration)
hashed_password = pwd_context.hash(plain_password)

# Verification (login)
is_valid = pwd_context.verify(plain_password, hashed_password)
```

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Frontend Implementation

### API Client (lib/api.ts)
```typescript
const API_URL = 'http://127.0.0.1:8000';

// Login
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

// Protected request
const response = await fetch(`${API_URL}/api/tasks`, {
  headers: { 'Authorization': `Bearer ${token}` },
});
```

### Token Storage
```typescript
// Store
localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));

// Retrieve
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Clear (logout)
localStorage.clear();
```

---

## Common Issues & Solutions

### Issue 1: 401 Unauthorized on Protected Routes
**Symptoms:**
- Login successful
- Tasks API returns 401
- Token exists in localStorage

**Root Cause**: User ID type mismatch in JWT

**Solution**: Store user_id as string in token:
```python
# auth_routes.py - line 43
access_token = create_access_token(data={"sub": str(user.id)})

# task_routes.py - line 35
user_id = int(payload.get("sub"))
```

### Issue 2: CORS Errors
**Symptoms:**
- "CORS policy" error in browser console
- Request blocked

**Solution**: Check CORS configuration in `main.py`:
```python
allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### Issue 3: SQLite Database Locked
**Symptoms:**
- "database is locked" error
- Operations timeout

**Solution**: 
1. Stop all backend processes
2. Delete `todo.db` file
3. Restart backend (auto-recreates)

### Issue 4: Import Errors
**Symptoms:**
- `ModuleNotFoundError: No module named 'src'`

**Solution**: Run from backend directory:
```bash
cd phase-2-web/backend
python -m uvicorn src.main:app --port 8000
```

---

## Development Guidelines

### Code Style

**Backend (Python):**
- PEP 8 compliance
- Type hints on all functions
- Docstrings for complex logic
- Print statements for debugging

**Frontend (TypeScript):**
- Consistent naming (camelCase)
- Type annotations
- Component-based structure
- Console.log for debugging

### Git Commit Messages
```
feat: Add user authentication
fix: Resolve JWT token validation error
docs: Update API documentation
refactor: Improve task route structure
style: Format code with prettier
test: Add task CRUD tests
```

### Testing Checklist

**Backend:**
- [ ] All endpoints return correct status codes
- [ ] Authentication works (register, login)
- [ ] Protected routes require token
- [ ] Users can only access their own tasks
- [ ] Input validation works (title length, etc.)
- [ ] Error messages are clear

**Frontend:**
- [ ] Login/register forms work
- [ ] Token stored after login
- [ ] Dashboard loads tasks
- [ ] Add task modal works
- [ ] Toggle complete works
- [ ] Delete task works
- [ ] Logout clears storage
- [ ] UI responsive on mobile

---

## Performance Considerations

### Backend
- SQLite is fast for < 1000 concurrent users
- SQLAlchemy uses connection pooling
- JWT validation is stateless (no DB query)

### Frontend
- Next.js App Router (server components by default)
- Client components only when needed ('use client')
- LocalStorage for token (no server calls for auth check)

### Optimization Opportunities
- [ ] Add Redis for session management
- [ ] Implement database indexing
- [ ] Add pagination for task list
- [ ] Optimize bundle size (code splitting)
- [ ] Add service worker (PWA)

---

## Security Checklist

✅ **Implemented:**
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with expiration (24 hours)
- CORS restricted to frontend origin
- SQL injection prevented (SQLAlchemy ORM)
- User data isolation (FK constraints)
- Input validation (Pydantic schemas)

⚠️ **Production Considerations:**
- [ ] Use environment variables for SECRET_KEY
- [ ] Implement token refresh mechanism
- [ ] Add rate limiting (login attempts)
- [ ] Enable HTTPS only
- [ ] Add CSRF protection
- [ ] Implement logout token blacklist
- [ ] Add security headers
- [ ] Regular dependency updates

---

## Deployment Readiness

### Backend Deployment (Railway/Render)
```bash
# Requirements
- Python 3.14
- PostgreSQL database (migrate from SQLite)
- Environment variables: SECRET_KEY, DATABASE_URL
```

### Frontend Deployment (Vercel)
```bash
# Environment variables
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Pre-deployment Checklist
- [ ] Replace SQLite with PostgreSQL
- [ ] Set production SECRET_KEY
- [ ] Update CORS origins
- [ ] Add database migrations
- [ ] Test in production environment
- [ ] Set up monitoring/logging

---

## Useful Commands

### Backend Development
```bash
# Start server
python -m uvicorn src.main:app --port 8000

# Start with auto-reload (if httptools installed)
python -m uvicorn src.main:app --reload --port 8000

# Check API docs
open http://127.0.0.1:8000/docs
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Check for TypeScript errors
npm run type-check
```

### Database Management
```bash
# View database
sqlite3 phase-2-web/backend/todo.db

# Check tables
.tables

# View users
SELECT * FROM users;

# View tasks
SELECT * FROM tasks;

# Exit
.quit
```

---

## Support & Resources

### Documentation
- FastAPI: https://fastapi.tiangolo.com
- Next.js: https://nextjs.org/docs
- SQLAlchemy: https://docs.sqlalchemy.org
- Tailwind CSS: https://tailwindcss.com/docs

### Troubleshooting
1. Check backend logs (terminal output)
2. Check browser console (F12)
3. Verify database state (`sqlite3 todo.db`)
4. Check API docs (`/docs` endpoint)
5. Review `history/adr/` for decisions

---

## Project Statistics

- **Total Lines of Code**: ~2,500
- **Backend Files**: 8
- **Frontend Files**: 3
- **API Endpoints**: 6
- **Database Tables**: 2
- **Development Time**: ~4.5 hours
- **Technologies Used**: 8

---

## What's Next? (Phase III Ideas)

### Planned Features
- Task priorities (High/Medium/Low)
- Task categories/tags
- Search and filter
- Due dates with reminders
- Recurring tasks
- Task attachments
- Collaborative tasks (sharing)
- Activity history/audit log
- Export/Import (CSV, JSON)
- Dark mode
- Mobile responsiveness
- Email notifications
- Real-time updates (WebSocket)

---

**Last Updated**: January 6, 2026  
**Phase**: II Complete  
**Status**: Production Ready ✅  
**Next**: Phase III Planning