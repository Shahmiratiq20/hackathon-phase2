# Project Context for Claude Code

## Project Overview
**Evolution-Todo**: Full-stack web application demonstrating evolution from console app to production-ready web application.

## Current Phase: Phase II Complete
Multi-user todo application with authentication and database persistence.

## Project Structure
```
hackathon-todo/
├── .claude/                    # Claude Code context
├── .specify/                   # SpecKit configuration
├── phase-1-cli/               # Phase I (Console - deprecated)
├── phase-2-web/               # Phase II (Full-Stack - CURRENT)
│   ├── backend/               # FastAPI + SQLAlchemy
│   │   └── src/
│   │       ├── models/        # Database models
│   │       ├── schemas/       # Pydantic schemas
│   │       ├── routers/       # API routes
│   │       ├── auth.py        # Authentication
│   │       └── main.py        # FastAPI app
│   └── frontend/              # Next.js 16 + TypeScript
│       ├── app/               # Pages
│       │   ├── page.tsx       # Login/Register
│       │   └── dashboard/     # Dashboard
│       └── lib/
│           └── api.ts         # API client
├── specs/                     # Feature specifications
├── history/                   # Development history
│   ├── prompts/              # Claude prompts used
│   └── adr/                  # Architecture decisions
└── README.md
```

## Technology Stack

### Backend
- **Framework**: FastAPI 0.95.0
- **ORM**: SQLAlchemy 1.4.46
- **Database**: SQLite (dev), PostgreSQL (prod-ready)
- **Auth**: JWT with python-jose
- **Password**: bcrypt 3.2.2
- **Validation**: Pydantic 1.10.13

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React useState/useEffect
- **Storage**: localStorage (tokens)

## Key Features Implemented

### Authentication
- User registration with email validation
- Login with JWT token generation
- Protected routes with bearer token
- Multi-user isolation

### Task Management (CRUD)
- Create tasks with title & description
- View all user's tasks
- Update task (title, description, status)
- Delete task with confirmation
- Toggle complete/incomplete status

### UI Features
- Modern gradient design
- Stats dashboard (total, pending, completed, progress%)
- Responsive cards
- Modal dialogs
- Loading states
- Error handling

## API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login (returns JWT)
```

### Tasks (Protected)
```
GET    /api/tasks        - Get user's tasks
POST   /api/tasks        - Create task
PUT    /api/tasks/{id}   - Update task
DELETE /api/tasks/{id}   - Delete task
```

## Database Schema

### users
- id (PK, Integer)
- username (Unique, String 50)
- email (Unique, String 100)
- hashed_password (String 255)
- created_at (DateTime)

### tasks
- id (PK, Integer)
- user_id (FK → users.id)
- title (String 200)
- description (Text, nullable)
- completed (Boolean, default False)
- created_at (DateTime)
- updated_at (DateTime)

## Known Issues & Solutions

### Issue 1: Pydantic Version Conflicts
**Problem**: Python 3.14 + Pydantic 2.x requires Rust compiler  
**Solution**: Downgraded to Pydantic 1.10.13

### Issue 2: Bcrypt Compatibility
**Problem**: bcrypt 5.x has compatibility issues  
**Solution**: Downgraded to bcrypt 3.2.2

### Issue 3: JWT Subject Type Error
**Problem**: python-jose requires string subject in JWT  
**Solution**: Store user_id as string: `{"sub": str(user.id)}`  
Convert back: `user_id = int(payload.get("sub"))`

### Issue 4: 401 Unauthorized on Protected Routes
**Problem**: HTTPBearer not working properly  
**Solution**: Manual token extraction from Authorization header

## Running the Application

### Backend
```bash
cd phase-2-web/backend
python -m uvicorn src.main:app --port 8000
```

### Frontend
```bash
cd phase-2-web/frontend
npm run dev
```

**Access**: http://localhost:3000

## Development Workflow

1. **Read specifications** in `specs/` folder
2. **Implement features** in order
3. **Test manually** via browser
4. **Document decisions** in `history/adr/`
5. **Commit changes** with descriptive messages

## Code Conventions

### Backend
- Type hints on all functions
- Pydantic schemas for validation
- Error handling with HTTPException
- Print statements for debugging

### Frontend
- TypeScript for type safety
- Client components (`'use client'`)
- Tailwind for styling
- Console logs for debugging

## Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens (24-hour expiry)
- ✅ CORS configured (localhost:3000 only)
- ✅ SQL injection prevented (SQLAlchemy ORM)
- ✅ Multi-user data isolation
- ⚠️ SECRET_KEY should be environment variable (production)
- ⚠️ No token refresh mechanism (simple for hackathon)

## Future Enhancements (Phase III)

- [ ] Task priorities (high/medium/low)
- [ ] Task tags/categories
- [ ] Search & filter functionality
- [ ] Due dates & reminders
- [ ] Recurring tasks
- [ ] Real-time updates (WebSockets)
- [ ] Email notifications
- [ ] Export tasks (CSV/JSON)
- [ ] Dark mode
- [ ] Mobile app (React Native)

## Deployment (When Ready)

### Backend
- Platform: Railway/Render
- Database: Neon PostgreSQL
- Environment: Production SECRET_KEY

### Frontend
- Platform: Vercel
- Auto-deploy from GitHub
- Environment: API_URL

## Contact & Support

- **Developer**: [Your Name]
- **Hackathon**: Phase II - Full-Stack Web Application
- **Deadline**: January 6, 2026, 6:00 PM
- **Status**: ✅ Complete

---

**Last Updated**: January 6, 2026  
**Phase**: II (Full-Stack)  
**Status**: Production Ready