# Evolution-Todo Constitution

## Project Vision
Transform a simple console application into a production-ready, full-stack web application demonstrating modern development practices.

## Phase II Principles

### 1. Architecture
- **Monorepo Structure**: Single repository, multiple phases
- **API-First Design**: Backend exposes RESTful APIs
- **Component Separation**: Clear frontend/backend boundaries
- **Database Persistence**: PostgreSQL for production data
- **JWT Authentication**: Secure, stateless authentication

### 2. Technology Stack

#### Frontend
- Next.js 16+ (App Router)
- TypeScript (optional for speed)
- Tailwind CSS for styling
- Better Auth for authentication
- Responsive, mobile-first design

#### Backend
- FastAPI (Python)
- SQLModel for ORM
- Neon PostgreSQL (or SQLite for dev)
- JWT token authentication
- Pydantic for validation

### 3. Development Methodology
- **Spec-Driven Development**: Write specs before code
- **AI-Assisted Coding**: Claude Code generates implementation
- **Iterative Development**: Build feature by feature
- **Test as You Go**: Manual testing after each feature

### 4. Security Requirements
- Password hashing (bcrypt)
- JWT tokens for session management
- User data isolation (no cross-user access)
- Input validation on all endpoints
- SQL injection prevention (via SQLModel)

### 5. Feature Priorities (Phase II)

**MUST HAVE (Today):**
- User registration/login
- JWT authentication
- Basic CRUD for tasks
- Multi-user support
- Simple web UI

**NICE TO HAVE (If Time):**
- Task priorities
- Task tags/categories
- Search functionality
- Better UI/UX

**FUTURE (Phase III+):**
- Recurring tasks
- Reminders/notifications
- Advanced filtering
- Real-time updates

### 6. Quality Standards
- Clean, readable code
- Proper error handling
- API documentation
- RESTful conventions
- Responsive design

### 7. Deployment (If Time Permits)
- Frontend: Vercel
- Backend: Railway/Render
- Database: Neon PostgreSQL
- Environment variables properly configured

## Success Criteria
- ✅ Working web application
- ✅ User can register/login
- ✅ User can manage their tasks
- ✅ Multi-user isolation working
- ✅ Deployed and accessible (bonus)