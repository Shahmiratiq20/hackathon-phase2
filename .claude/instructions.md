# Instructions for Claude Code

## Project Context
This is Phase II of Evolution-Todo hackathon project. Full-stack web application with FastAPI backend and Next.js frontend.

## When Making Changes

### Always:
1. Read `@specs/` folder first
2. Follow existing code structure
3. Maintain consistent style
4. Add comments with task references
5. Test changes manually
6. Update documentation if needed

### Backend Changes
- Location: `phase-2-web/backend/src/`
- Follow SQLAlchemy patterns
- Use type hints
- Handle errors with HTTPException
- Test via Swagger UI at `/docs`

### Frontend Changes
- Location: `phase-2-web/frontend/app/`
- Use TypeScript
- Follow Tailwind conventions
- Test in browser
- Check console for errors

### Database Changes
- Update models in `src/models/database.py`
- Create migration plan
- Test data integrity

## Common Commands

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

### Testing
- Backend: http://127.0.0.1:8000/docs
- Frontend: http://localhost:3000

## File Locations

**Backend Files:**
- Models: `backend/src/models/database.py`
- Schemas: `backend/src/schemas/schemas.py`
- Auth: `backend/src/auth.py`
- Routes: `backend/src/routers/`
- Main: `backend/src/main.py`

**Frontend Files:**
- Login: `frontend/app/page.tsx`
- Dashboard: `frontend/app/dashboard/page.tsx`
- API Client: `frontend/lib/api.ts`

## Important Notes

### Token Format
- **MUST** store user_id as STRING in JWT
- Convert to int when querying database
```python
# Token creation
{"sub": str(user.id)}

# Token validation
user_id = int(payload.get("sub"))
```

### CORS
- Only allows: localhost:3000, 127.0.0.1:3000
- Update if frontend URL changes

### Database
- SQLite file: `backend/todo.db`
- Auto-created on first run
- Users and tasks tables

## Troubleshooting

### 401 Unauthorized
- Check token in localStorage
- Verify Authorization header format
- Check user exists in database

### CORS Errors
- Check frontend URL in CORS middleware
- Verify request includes credentials

### Database Errors
- Delete `todo.db` and restart
- Check model relationships
- Verify foreign keys

## Need Help?
Refer to:
- `@CONSTITUTION.md` - Project principles
- `@specs/` - Feature specifications
- `@history/adr/` - Architecture decisions