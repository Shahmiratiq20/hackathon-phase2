# Gemini Code Assist Instructions

## Overview
This is a full-stack web application built for a hackathon. Use Gemini Code Assist to help develop, debug, and enhance the application.

## Quick Start for Gemini

### Project Context
Read: `@.gemini/project-context.md`

### Code Structure
- Backend: `phase-2-web/backend/src/`
- Frontend: `phase-2-web/frontend/app/`
- Specs: `specs/`

### Key Technologies
- Backend: FastAPI + SQLAlchemy + JWT
- Frontend: Next.js 16 + TypeScript + Tailwind
- Database: SQLite (dev)

## When Assisting

1. **Read context first**: Check `.gemini/` folder
2. **Follow patterns**: Match existing code style
3. **Test changes**: Verify manually
4. **Document**: Update relevant files
5. **Security**: Maintain user isolation

## Important Rules

### Backend
- User ID in JWT must be string: `{"sub": str(user.id)}`
- Convert to int for queries: `int(payload.get("sub"))`
- Use type hints always
- Handle errors with HTTPException

### Frontend
- Include token in headers: `Authorization: Bearer <token>`
- Store in localStorage
- Type all interfaces
- Use Tailwind for styling

## Common Tasks

### Add Feature
1. Define API endpoint (backend)
2. Add validation schema
3. Create UI component (frontend)
4. Test end-to-end

### Fix Bug
1. Check logs (terminal/console)
2. Identify file location
3. Apply fix following patterns
4. Test thoroughly

### Improve UI
1. Maintain gradient theme
2. Use Tailwind utilities
3. Keep responsive
4. Test on mobile

## Resources
- Full context: `.gemini/project-context.md`
- Instructions: `.gemini/instructions.md`
- Specifications: `specs/`
- Decisions: `history/adr/`

---

**Happy Coding! 🚀**