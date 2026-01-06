# Phase II Implementation Prompts

## Date: January 6, 2026

### Backend Setup Prompts

**Prompt 1: Project Structure**
```
Create Phase II folder structure for full-stack todo app:
- backend/ (FastAPI)
- frontend/ (Next.js)
- specs/ (specifications)
```

**Prompt 2: Backend Models**
```
Create SQLAlchemy models for:
- User table (username, email, hashed_password)
- Task table (user_id FK, title, description, completed)
```

**Prompt 3: Authentication**
```
Implement JWT authentication with:
- Register endpoint
- Login endpoint
- Password hashing with bcrypt
- Token generation
```

**Prompt 4: Task API Routes**
```
Create REST API endpoints:
- GET /api/tasks (get user's tasks)
- POST /api/tasks (create task)
- PUT /api/tasks/{id} (update task)
- DELETE /api/tasks/{id} (delete task)
```

---

### Frontend Setup Prompts

**Prompt 5: Next.js Setup**
```
Create Next.js 16 app with:
- TypeScript
- Tailwind CSS
- App Router
```

**Prompt 6: API Client**
```
Create API utility with functions for:
- register, login
- getTasks, createTask, updateTask, deleteTask
```

**Prompt 7: Login Page**
```
Design attractive login/register page with:
- Tab switching
- Form validation
- Gradient design
- Error handling
```

**Prompt 8: Dashboard UI**
```
Create dashboard with:
- Stats cards (total, pending, completed, progress)
- Task list with checkboxes
- Add task modal
- Delete confirmation
- Modern gradient design
```

---

## Key Decisions

1. **SQLite for development** - Fast setup, no external DB needed
2. **JWT authentication** - Stateless, scalable
3. **Tailwind CSS** - Rapid UI development
4. **Manual token handling** - Fixed HTTPBearer issues
5. **String user_id in JWT** - Fixed python-jose compatibility

---

## Challenges & Solutions

**Challenge 1: Pydantic version conflicts**
- Solution: Downgraded to Pydantic 1.10.13

**Challenge 2: Bcrypt version error**
- Solution: Downgraded to bcrypt 3.2.2

**Challenge 3: JWT "Subject must be a string" error**
- Solution: Changed token payload from `{"sub": int(user.id)}` to `{"sub": str(user.id)}`

**Challenge 4: 401 Unauthorized on protected routes**
- Solution: Manual token extraction from Authorization header instead of HTTPBearer

---

## Total Implementation Time
- Backend: ~2 hours
- Frontend: ~1.5 hours
- Debugging: ~1 hour
- Total: ~4.5 hours