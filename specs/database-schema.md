# Database Schema Specification

## Tables

### users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique user ID |
| username | String(50) | Unique, Not Null | User's login name |
| email | String(100) | Unique, Not Null | User's email |
| hashed_password | String(255) | Not Null | Bcrypt hashed password |
| created_at | DateTime | Default: now() | Account creation time |

**Indexes:**
- username (unique)
- email (unique)

---

### tasks
Stores todo tasks for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique task ID |
| user_id | Integer | Foreign Key → users.id, Not Null | Owner of task |
| title | String(200) | Not Null | Task title |
| description | Text | Nullable | Task description |
| completed | Boolean | Default: False | Completion status |
| created_at | DateTime | Default: now() | Task creation time |
| updated_at | DateTime | Default: now(), Auto-update | Last modified time |

**Indexes:**
- user_id (for filtering)
- completed (for status queries)

**Foreign Keys:**
- user_id → users.id (ON DELETE CASCADE)

---

## Relationships
- One User → Many Tasks (1:N)
- User deletion cascades to tasks

## Sample Data
```sql
-- User
INSERT INTO users (username, email, hashed_password) 
VALUES ('testuser', 'test@example.com', '$2b$12$...');

-- Tasks
INSERT INTO tasks (user_id, title, description, completed)
VALUES 
  (1, 'Buy groceries', 'Milk, eggs, bread', false),
  (1, 'Finish report', 'Q4 analysis', false);
```