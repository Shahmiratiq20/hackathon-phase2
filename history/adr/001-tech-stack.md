# ADR 001: Technology Stack Selection

**Date:** 2026-01-06  
**Status:** Accepted

## Context
Need to build full-stack web application with authentication and database persistence for Phase II hackathon.

## Decision
Selected the following technology stack:

### Backend
- **FastAPI** - Fast, modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Development database (easy setup)
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

## Rationale

**Why FastAPI?**
- Native async support
- Automatic API documentation
- Fast development
- Python ecosystem

**Why SQLite?**
- Zero configuration
- File-based (portable)
- Perfect for development
- Can migrate to PostgreSQL later

**Why JWT?**
- Stateless authentication
- Scalable
- Industry standard

**Why Next.js?**
- Server-side rendering
- App Router (modern)
- Great developer experience
- Easy deployment

**Why Tailwind?**
- Rapid UI development
- Consistent design system
- No CSS conflicts

## Consequences

**Positive:**
- Fast development
- Modern tech stack
- Good performance
- Easy to maintain

**Negative:**
- SQLite not for production scale
- Need to learn multiple technologies
- Version compatibility issues (resolved)

## Alternatives Considered
- Django REST Framework (slower development)
- PostgreSQL from start (complex setup)
- React without Next.js (more boilerplate)