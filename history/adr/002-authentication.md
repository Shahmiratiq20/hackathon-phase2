# ADR 002: JWT Authentication Strategy

**Date:** 2026-01-06  
**Status:** Accepted

## Context
Need secure user authentication for multi-user todo application.

## Decision
Implemented JWT (JSON Web Token) based authentication with:
- Access tokens (24-hour expiry)
- Bearer token in Authorization header
- User ID stored in token as string

## Implementation
```python
# Token creation
access_token = create_access_token(data={"sub": str(user.id)})

# Token validation
payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
user_id = int(payload.get("sub"))
```

## Key Changes
**Issue:** python-jose requires string subject  
**Solution:** Store user_id as string in token, convert to int when querying

## Security Considerations
- Passwords hashed with bcrypt
- Tokens expire after 24 hours
- CORS configured for frontend only
- SQL injection prevented by SQLAlchemy

## Consequences
**Positive:**
- Stateless authentication
- Scalable design
- Standard approach

**Trade-offs:**
- No token refresh mechanism (simple for hackathon)
- No logout tracking (tokens valid until expiry)