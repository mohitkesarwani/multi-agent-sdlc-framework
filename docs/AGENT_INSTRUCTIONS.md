# Agent Instructions for Multi-Agent SDLC Framework

## Table of Contents
- [Overview](#overview)
- [How to Use This Framework](#how-to-use-this-framework)
- [Agent Roles and Responsibilities](#agent-roles-and-responsibilities)
- [Best Practices for Agent-Driven Development](#best-practices-for-agent-driven-development)
- [Code Quality Standards](#code-quality-standards)
- [Security Requirements](#security-requirements)
- [Testing Guidelines](#testing-guidelines)
- [Communication Protocol](#communication-protocol)

---

## Overview

The Multi-Agent SDLC Framework is a revolutionary approach to software development where specialized AI agents collaborate to deliver production-ready applications. Each agent has specific responsibilities, expertise, and must follow strict handover protocols to ensure quality and traceability.

### Core Principles
1. **Single Source of Truth (SSOT)**: `PROJECT_KNOWLEDGE.md` is the authoritative source for all project decisions
2. **Gate-Based Workflow**: Human approval gates at critical phases ensure alignment
3. **Specialization**: Each agent excels in its domain; never overstep your boundaries
4. **Iterative Development**: Build → Test → Refine → Deploy cycles
5. **Security-First**: Security is not optional; it's embedded in every phase

---

## How to Use This Framework

### For Agents

#### 1. **Identify Your Role**
Read your specific agent configuration file in `.agent-config/`:
- `01_Requirement_Agent.md` - Business Analyst
- `02_System_Architect.md` - System Designer
- `03_Implementation_Planner.md` - Sprint Planner
- `04_FullStack_Dev_Swarm.md` - Development Team
- `05_Quality_Assurance.md` - QA Engineer
- `06_Security_Sentinel.md` - Security Auditor

#### 2. **Follow the Workflow States**
```
DISCOVERY → ARCHITECTURE → PLANNING → EXECUTION → VALIDATION → SECURITY_AUDIT → COMPLETE
```

#### 3. **Always Update PROJECT_KNOWLEDGE.md**
Every agent must:
- Read the current state from `PROJECT_KNOWLEDGE.md`
- Perform your assigned task
- Update `PROJECT_KNOWLEDGE.md` with your findings
- Hand over to the next agent

#### 4. **Respect Approval Gates**
Two critical gates require human approval:
- **Gate #1**: After Planning Phase (before development)
- **Gate #2**: After Security Audit (before deployment)

### For Humans/Project Managers

#### 1. **Initialize the Framework**
```bash
npm install
node orchestrator.js
```

#### 2. **Provide Clear Requirements**
When the BA Agent asks questions, be specific:
- Describe the business problem clearly
- Identify target users and their needs
- Define success criteria
- Mention any technical constraints

#### 3. **Review and Approve**
At approval gates, review:
- Implementation plan and effort estimates
- Security audit results
- Test coverage reports

---

## Agent Roles and Responsibilities

### 🕵️ 01_Requirement_Agent (Business Analyst)

**Primary Responsibility**: Gather and document business requirements

**Tasks**:
- Interview stakeholders
- Extract business goals and constraints
- Create user stories with acceptance criteria
- Document functional and non-functional requirements
- Update `PROJECT_KNOWLEDGE.md` with requirements section

**Output**:
```markdown
## BUSINESS_REQUIREMENTS

### User Stories
As a [role], I want to [action], so that [benefit]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2

### Non-Functional Requirements
- Performance: [metric]
- Security: [requirements]
- Scalability: [needs]
```

**Handover To**: System Architect

---

### 🏗️ 02_System_Architect (System Designer)

**Primary Responsibility**: Design technical architecture and data models

**Tasks**:
- Design MongoDB/Mongoose schemas
- Define API contracts (REST endpoints)
- Create Entity Relationship Diagrams (ERD)
- Specify data validation rules (Zod/Joi)
- Design authentication and authorization strategy
- Document technology stack decisions

**Output**:
```markdown
## TECHNICAL_ARCHITECTURE

### Database Schema
- User Model: { username, email, password, role }
- Product Model: { name, price, category, inventory }

### API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/products
- POST /api/products

### Technology Stack
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Frontend: React + Vite
- Validation: Zod
```

**Handover To**: Implementation Planner

---

### 📋 03_Implementation_Planner (Sprint Planner)

**Primary Responsibility**: Break architecture into actionable development tasks

**Tasks**:
- Create detailed task breakdown
- Estimate effort (story points or hours)
- Identify dependencies between tasks
- Prioritize tasks (P0, P1, P2)
- Create sprint plan
- **🚨 PAUSE FOR HUMAN APPROVAL GATE #1**

**Output**:
```markdown
## IMPLEMENTATION_PLAN

### Sprint 1: Foundation (Estimated: 40 hours)
- [ ] Setup Express server (4h)
- [ ] Configure MongoDB connection (2h)
- [ ] Create User model + routes (6h)
- [ ] Implement JWT authentication (8h)
- [ ] Setup React + Vite (4h)
- [ ] Create routing structure (4h)

### Sprint 2: Core Features (Estimated: 60 hours)
- [ ] Product CRUD operations (12h)
- [ ] Shopping cart functionality (16h)
- [ ] Checkout flow (20h)
- [ ] Admin dashboard (12h)

### Dependencies
- User auth must complete before product features
- Frontend routing depends on API completion
```

**Handover To**: Development Swarm (after approval)

---

### 👨‍💻 04_FullStack_Dev_Swarm (Development Team)

**Primary Responsibility**: Implement the application code

**Sub-Agents**:
- **04a_Backend_Dev_Agent**: Implements backend services
- **04b_Frontend_Dev_Agent**: Implements UI components

**Backend Dev Tasks**:
- Create Mongoose models with validation
- Implement Express routes and controllers
- Write middleware (authentication, validation, error handling)
- Use Zod/Joi for request validation
- Implement business logic in services
- Follow RESTful API principles

**Frontend Dev Tasks**:
- Create React components
- Implement state management (Context API or Redux)
- Build custom hooks for data fetching
- Implement form validation
- Create responsive UI with Tailwind CSS
- Handle API integration

**Code Structure**:
```
src/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── services/        # Business logic
│   └── server.js        # Entry point
├── frontend/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   ├── context/         # Global state
│   ├── services/        # API client
│   └── App.jsx          # Main app
```

**Handover To**: Quality Assurance

---

### 🧪 05_Quality_Assurance (QA Engineer)

**Primary Responsibility**: Ensure code quality through comprehensive testing

**Tasks**:
- Write unit tests (Jest/Vitest)
- Write integration tests
- Verify test coverage (minimum 80%)
- Run linting (ESLint)
- Check code formatting (Prettier)
- Perform manual smoke testing
- **If tests fail**: Loop back to Development Team

**Test Requirements**:
```javascript
// Backend Unit Test Example
describe('User Controller', () => {
  test('should register new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', email: 'test@example.com', password: 'Test123!' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});

// Frontend Unit Test Example
describe('LoginForm Component', () => {
  test('should display validation error for invalid email', () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

**Coverage Thresholds**:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

**Handover To**: Security Sentinel

---

### 🛡️ 06_Security_Sentinel (Security Auditor)

**Primary Responsibility**: Identify and mitigate security vulnerabilities

**Tasks**:
- Scan for NoSQL injection vulnerabilities
- Check for XSS (Cross-Site Scripting) vulnerabilities
- Verify no hardcoded secrets (API keys, passwords)
- Ensure proper JWT validation
- Check CORS configuration
- Verify HTTPS enforcement
- Validate input sanitization
- Check authentication and authorization
- **🚨 PAUSE FOR HUMAN APPROVAL GATE #2** (if critical/high severity issues found)

**Security Checklist**:
```markdown
## SECURITY_AUDIT_RESULTS

### ✅ Passed Checks
- [x] No hardcoded secrets found
- [x] Environment variables properly configured
- [x] JWT tokens have expiration
- [x] Passwords hashed with bcrypt (10+ rounds)
- [x] SQL/NoSQL injection protection
- [x] XSS protection headers enabled
- [x] CORS properly configured
- [x] Rate limiting implemented
- [x] Input validation on all endpoints

### ⚠️ Warnings
- [ ] [None]

### 🚨 Critical Issues
- [ ] [None]
```

**Handover To**: Deployment (after approval)

---

## Best Practices for Agent-Driven Development

### 1. **Communication Protocol**

#### Always Follow This Format:
```markdown
## Agent: [Your Agent Name]
## Phase: [Current Workflow State]
## Status: [IN_PROGRESS | COMPLETED | BLOCKED]

### What I Did:
- Action 1
- Action 2

### What I Found:
- Observation 1
- Observation 2

### What I Updated:
- Updated PROJECT_KNOWLEDGE.md section: [section_name]
- Created files: [list]
- Modified files: [list]

### Handover:
- Ready to transition to: [Next Agent]
- Blockers: [None | List blockers]
```

### 2. **Version Control Discipline**

#### Commit Messages Format:
```
[AGENT_NAME] Phase: Brief description

Detailed explanation of changes made.

Files changed:
- src/backend/models/User.js
- src/frontend/pages/Login.jsx

Updated: PROJECT_KNOWLEDGE.md (ARCHITECTURE section)
```

#### Branching Strategy:
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/[agent-name]-[feature]` - Agent working branch
- `hotfix/[issue]` - Critical fixes

### 3. **Documentation Standards**

#### Every Code File Must Include:
```javascript
/**
 * @file User.js
 * @description Mongoose model for User entity
 * @agent 04a_Backend_Dev_Agent
 * @created 2024-02-08
 * @lastModified 2024-02-08
 */
```

#### Every Function Must Include:
```javascript
/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Unique username
 * @param {string} userData.email - Valid email address
 * @param {string} userData.password - Password (min 8 chars)
 * @returns {Promise<Object>} User object with JWT token
 * @throws {ValidationError} If validation fails
 * @throws {DuplicateError} If user already exists
 */
async function registerUser(userData) {
  // Implementation
}
```

### 4. **Error Handling Standards**

#### Backend Error Handling:
```javascript
// Use centralized error handler
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// In controllers
try {
  const user = await userService.register(req.body);
  res.status(201).json({ success: true, data: user });
} catch (error) {
  next(new AppError('Registration failed', 400));
}

// Global error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

#### Frontend Error Handling:
```javascript
// Custom hook for error handling
function useErrorHandler() {
  const [error, setError] = useState(null);
  
  const handleError = (error) => {
    setError(error.response?.data?.error || 'An error occurred');
    console.error('Error:', error);
  };
  
  const clearError = () => setError(null);
  
  return { error, handleError, clearError };
}

// Usage in components
const { error, handleError } = useErrorHandler();

try {
  await api.post('/auth/login', credentials);
} catch (err) {
  handleError(err);
}
```

---

## Code Quality Standards

### 1. **JavaScript/Node.js Standards**

#### Code Style:
- Use ES6+ features (const, let, arrow functions, async/await)
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable names (camelCase)
- Keep functions small (< 50 lines)
- Avoid deeply nested code (max 3 levels)

#### Linting Configuration:
```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error"
  }
}
```

### 2. **React Best Practices**

#### Component Structure:
```jsx
// ✅ Good
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired
};

export default UserProfile;
```

#### Hooks Guidelines:
- Custom hooks must start with `use`
- Extract reusable logic into custom hooks
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations

### 3. **Database Best Practices**

#### Mongoose Schema Example:
```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false // Never return password in queries
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

---

## Security Requirements

### 1. **Authentication & Authorization**

#### JWT Implementation:
```javascript
// Token generation
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Auth middleware
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new AppError('Not authenticated', 401));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return next(new AppError('Invalid token', 401));
  }
};

// Role-based authorization
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Unauthorized', 403));
    }
    next();
  };
};
```

### 2. **Input Validation**

#### Zod Validation Example:
```javascript
const { z } = require('zod');

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string()
    .email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        errors: error.errors
      });
    }
  };
};

// Usage
router.post('/register', validate(registerSchema), authController.register);
```

### 3. **Security Headers**

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  max: 100, // Max requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));
```

---

## Testing Guidelines

### 1. **Backend Testing**

#### Unit Tests:
```javascript
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('username', 'testuser');
    });
    
    it('should reject duplicate username', async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!'
      });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'another@example.com',
          password: 'Test123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### 2. **Frontend Testing**

#### Component Tests:
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  it('should render login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  
  it('should show validation errors', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
  
  it('should submit form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Test123!');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Test123!'
      });
    });
  });
});
```

### 3. **Integration Tests**

```javascript
describe('User Authentication Flow', () => {
  it('should complete full registration and login flow', async () => {
    // Register
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!'
      });
    
    expect(registerResponse.status).toBe(201);
    const { token } = registerResponse.body.data;
    
    // Access protected route
    const profileResponse = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.data.email).toBe('test@example.com');
  });
});
```

---

## Communication Protocol

### Inter-Agent Communication

#### Handover Checklist:
```markdown
## Handover: [Current Agent] → [Next Agent]

### Prerequisites Met:
- [x] All tasks completed
- [x] PROJECT_KNOWLEDGE.md updated
- [x] Code committed and pushed
- [x] Tests passing
- [x] Documentation updated

### Summary for Next Agent:
[Brief summary of what was accomplished]

### Important Notes:
- [Any blockers or concerns]
- [Technical debt incurred]
- [Decisions made that affect downstream work]

### Files Modified:
- [List of files]

### Next Steps:
- [What the next agent should focus on]
```

### Human Communication

#### Status Updates:
Provide regular status updates in this format:
```markdown
## Daily Standup Update

**Agent**: [Your Name]
**Date**: [YYYY-MM-DD]

### Yesterday:
- Completed [task 1]
- Completed [task 2]

### Today:
- Working on [task 3]
- Will start [task 4]

### Blockers:
- [None or list blockers]

### Progress:
- [X%] complete on current phase
```

---

## Conclusion

Following these instructions ensures:
- ✅ Consistent code quality across all agents
- ✅ Proper documentation and traceability
- ✅ Security-first development approach
- ✅ Comprehensive test coverage
- ✅ Smooth handovers between agents
- ✅ Clear communication with humans

**Remember**: You are part of a team. Your work enables the next agent. Quality over speed. Security is non-negotiable.
