# Claude Code Instructions - Phase II Full-Stack Application

## Project Context
You are building **Phase II** of Evolution-Todo: a full-stack web application with Next.js frontend and FastAPI backend.

## Your Role
Generate production-ready code based on specifications. Follow the structure and conventions defined in the constitution and specs.

## Project Structure
```
phase-2-web/
├── frontend/           # Next.js 16 App Router
│   ├── src/app/        # Pages
│   ├── src/components/ # React components
│   └── src/lib/        # Utils, API client
└── backend/            # FastAPI
    ├── src/
    │   ├── models/     # SQLModel models
    │   ├── schemas/    # Pydantic schemas
    │   ├── routers/    # API routes
    │   └── main.py     # FastAPI app
    └── tests/
```

## Workflow
1. Read specifications from `@../specs/`
2. Read constitution principles from `@../constitution.md`
3. Generate code following best practices
4. Use type hints (Python) and TypeScript (optional for speed)
5. Implement proper error handling

## Backend Guidelines (FastAPI)
- Use SQLModel for database models
- Use Pydantic schemas for request/response
- JWT authentication with `python-jose`
- Password hashing with `passlib[bcrypt]`
- CORS enabled for frontend communication
- All routes under `/api/` prefix

## Frontend Guidelines (Next.js)
- Use App Router (not Pages Router)
- Server components by default
- Client components only when needed
- Tailwind CSS for styling
- API calls via fetch in `src/lib/api.ts`
- Better Auth for authentication (if time permits)

## Database
- Use SQLModel models
- Auto-generate tables on startup
- SQLite for development (fast setup)
- PostgreSQL for production (if deployed)

## Authentication Flow
1. User registers: POST /api/auth/register
2. User logs in: POST /api/auth/login → receives JWT token
3. Frontend stores token in localStorage
4. All API requests include: `Authorization: Bearer <token>`
5. Backend validates token on protected routes

## API Conventions
- RESTful design
- JSON responses
- HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)
- Error format: `{"detail": "Error message"}`

## Constraints
- No manual coding - generate from specs
- Keep it simple for time constraint
- Focus on functionality over polish
- Prioritize MUST HAVE features

## Testing Strategy
- Manual testing via browser
- Test user registration/login
- Test task CRUD operations
- Verify multi-user isolation

Ready to implement! Use: "Implement [feature-name]" to start.