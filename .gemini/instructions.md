# Instructions for Gemini Code Assist

## Welcome! 👋

You're working on **Evolution-Todo**, a hackathon project showcasing full-stack development with modern technologies.

---

## Quick Context

### What is this project?
A multi-user todo application with:
- User authentication (JWT)
- Full CRUD operations
- Beautiful modern UI
- Database persistence

### Current Status
✅ **Phase II Complete** - All features working, ready for submission

---

## How to Help

### When User Asks for Changes:

1. **Read Context First**
   - Check `@.gemini/project-context.md`
   - Review `@specs/` for requirements
   - Check `@history/adr/` for decisions

2. **Understand the Structure**
   - Backend: `phase-2-web/backend/src/`
   - Frontend: `phase-2-web/frontend/app/`
   - Don't modify Phase I files

3. **Follow Patterns**
   - Backend: SQLAlchemy + Pydantic + FastAPI
   - Frontend: Next.js + TypeScript + Tailwind
   - Auth: JWT with string user_id

4. **Test Your Changes**
   - Backend: Check Swagger UI at `/docs`
   - Frontend: Test in browser
   - Verify in database: `sqlite3 todo.db`

---

## Common Requests & How to Handle

### "Add a new feature"
1. Define API endpoint (if backend needed)
2. Update database models (if schema change)
3. Create/update frontend component
4. Test end-to-end flow

### "Fix a bug"
1. Identify location (backend/frontend)
2. Check error logs/console
3. Review related code
4. Apply fix following existing patterns
5. Test thoroughly

### "Improve UI"
1. Check current Tailwind classes
2. Maintain gradient theme (blue/purple/pink)
3. Keep responsive design
4. Test on different screen sizes

### "Add validation"
1. Backend: Add to Pydantic schema
2. Frontend: Add form validation
3. Show user-friendly error messages

---

## Important Technical Details

### JWT Token Handling
**MUST FOLLOW THIS PATTERN:**
```python
# Creating token (auth_routes.py)
access_token = create_access_token(data={"sub": str(user.id)})
# ⚠️ MUST be string!

# Validating token (task_routes.py)
user_id = int(payload.get("sub"))
# ⚠️ Convert to int for DB query
```

**Why?** python-jose requires string subject in JWT.

### Database Queries
```python
# ✅ Get user's tasks only
tasks = db.query(Task).filter(Task.user_id == current_user.id).all()

# ❌ Don't expose other users' data
tasks = db.query(Task).all()  # WRONG - security issue
```

### Frontend API Calls
```typescript
// Always include token
const token = localStorage.getItem('token');
fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## File Structure Guide

### Backend Files

**Core Files:**
- `src/main.py` - FastAPI app, CORS, startup
- `src/auth.py` - JWT utilities, password hashing
- `src/models/database.py` - SQLAlchemy models
- `src/schemas/schemas.py` - Pydantic validation
- `src/routers/auth_routes.py` - Register, Login
- `src/routers/task_routes.py` - CRUD endpoints

**When to Edit:**
- API changes → `routers/`
- Database schema → `models/database.py`
- Request/response validation → `schemas/schemas.py`
- Auth logic → `auth.py`
- CORS/middleware → `main.py`

### Frontend Files

**Core Files:**
- `app/page.tsx` - Login/Register page
- `app/dashboard/page.tsx` - Task management
- `lib/api.ts` - API client functions

**When to Edit:**
- UI changes → `app/*/page.tsx`
- API integration → `lib/api.ts`
- Styling → Tailwind classes in components

---

## Code Quality Standards

### Python (Backend)
```python
# ✅ Good
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Task:
    """Create a new task for the authenticated user."""
    new_task = Task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task
```

**Requirements:**
- Type hints on all parameters and returns
- Docstrings for public functions
- Proper error handling (HTTPException)
- Dependency injection (Depends)

### TypeScript (Frontend)
```typescript
// ✅ Good
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

const handleAddTask = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await api.createTask(token, newTask);
    loadTasks();
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
};
```

**Requirements:**
- Type interfaces for data structures
- Async/await for API calls
- Try-catch for error handling
- Clear function names

---

## Testing Strategy

### Manual Testing Flow
1. **Backend** (Swagger UI):
   - Register user
   - Login (get token)
   - Create task (with token)
   - Get tasks
   - Update task
   - Delete task

2. **Frontend** (Browser):
   - Register new account
   - Login
   - Add 3 tasks
   - Mark 1 complete
   - Update 1 task
   - Delete 1 task
   - Logout
   - Login again (verify persistence)

3. **Database** (SQLite):
```bash
   sqlite3 phase-2-web/backend/todo.db
   SELECT * FROM users;
   SELECT * FROM tasks;
```

---

## Debug Checklist

### Backend Not Working?
- [ ] Backend server running? (port 8000)
- [ ] Check terminal for errors
- [ ] Database file exists? (`todo.db`)
- [ ] CORS configured correctly?
- [ ] Print statements showing in logs?

### Frontend Not Working?
- [ ] Frontend server running? (port 3000)
- [ ] Check browser console (F12)
- [ ] Token in localStorage?
- [ ] API URL correct? (127.0.0.1:8000)
- [ ] Network tab shows requests?

### 401 Errors?
- [ ] Token format correct? (Bearer + space + token)
- [ ] Token not expired? (24 hours)
- [ ] User exists in database?
- [ ] User ID in token as string?

---

## Gemini-Specific Tips

### Use Your Strengths:
- **Code Generation**: Generate boilerplate fast
- **Pattern Recognition**: Spot inconsistencies
- **Documentation**: Write clear explanations
- **Refactoring**: Improve code structure
- **Testing Ideas**: Suggest edge cases

### Best Practices:
1. Always explain what you're doing
2. Show before/after code
3. Highlight important changes
4. Suggest testing steps
5. Warn about breaking changes

### Example Response Format:
```
I'll help you add [feature]. Here's what we need to change:

1. Backend Changes (phase-2-web/backend/):
   - Update src/routers/task_routes.py
   - Add new endpoint

2. Frontend Changes (phase-2-web/frontend/):
   - Update app/dashboard/page.tsx
   - Add UI component

3. Testing:
   - Test endpoint at /docs
   - Verify in browser

[Provide complete code with comments]
```

---

## Emergency Fixes

### If Something Breaks:

1. **Database Issues**
```bash
   # Reset database
   rm phase-2-web/backend/todo.db
   # Restart backend (auto-recreates)
```

2. **Token Issues**
```javascript
   // Clear frontend storage
   localStorage.clear();
   // Re-login
```

3. **Server Won't Start**
```bash
   # Kill existing process
   # Windows: taskkill /F /IM python.exe
   # Then restart
```

---

## Success Metrics

You're doing great if:
- ✅ Code follows existing patterns
- ✅ Changes are minimal and focused
- ✅ No breaking changes to working features
- ✅ User experience improves
- ✅ Code is testable
- ✅ Documentation updated

---

## Remember

- **Read context before coding**
- **Test your changes**
- **Maintain consistency**
- **Security first** (user isolation!)
- **User experience matters**

---

**You've got this! 🚀**

For questions, refer to:
- `@.gemini/project-context.md` (this file)
- `@specs/` (requirements)
- `@history/adr/` (decisions)
- `@CONSTITUTION.md` (principles)