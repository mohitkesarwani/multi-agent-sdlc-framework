# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

This guide will help you get the Multi-Agent SDLC Framework running on your local machine in just a few minutes.

---

## Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v16.x or later) - [Download](https://nodejs.org/)
- ✅ **npm** (v7.x or later) - Comes with Node.js
- ✅ **MongoDB** (v5.x or later) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- ✅ **Git** - [Download](https://git-scm.com/downloads)
- ✅ **Code Editor** - [VS Code](https://code.visualstudio.com/) (recommended)

### Quick Check

Open your terminal and verify installations:

```bash
node --version   # Should show v16.x or higher
npm --version    # Should show v7.x or higher
mongod --version # Should show v5.x or higher
git --version    # Should show v2.x or higher
```

---

## Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/mohitkesarwani/multi-agent-sdlc-framework.git

# Navigate to the project directory
cd multi-agent-sdlc-framework

# Or if you're using this as a template, clone your fork
git clone https://github.com/YOUR_USERNAME/your-project-name.git
cd your-project-name
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd src/backend
npm install
cd ../..

# Install frontend dependencies
cd src/frontend
npm install
cd ../..
```

**⏱️ This should take 2-3 minutes**

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your settings
nano .env
# or
code .env  # If using VS Code
```

**Minimum required configuration:**

```bash
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database (use one of these)
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/multi-agent-sdlc

# Option 2: MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

**💡 Pro Tip:** Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Start MongoDB (if using local)

```bash
# On macOS/Linux
mongod --dbpath ~/data/db

# On Windows
mongod --dbpath C:\data\db

# Or if MongoDB is installed as a service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Skip this step if using MongoDB Atlas (cloud)**

---

## Running the Application

### Option 1: Run Everything at Once (Recommended)

Open **3 terminal windows**:

#### Terminal 1: Backend Server

```bash
cd src/backend
npm run dev
```

Expected output:
```
[nodemon] starting `node server.js`
✓ MongoDB connected
✓ Server running on http://localhost:5000
```

#### Terminal 2: Frontend Application

```bash
cd src/frontend
npm run dev
```

Expected output:
```
  VITE v2.x ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Terminal 3: Agent Orchestrator (when needed)

```bash
node orchestrator.js
```

Expected output:
```
🚀 MULTI-AGENT SDLC ORCHESTRATOR STARTING...

✓ Loading agent registry
✓ Initializing PROJECT_KNOWLEDGE.md as SSOT
✓ Setting up approval gates
✓ Framework ready
```

### Option 2: Use npm Scripts (Alternative)

```bash
# Start backend in development mode
npm run dev:backend

# Start frontend in development mode
npm run dev:frontend

# Start orchestrator
npm run orchestrator
```

---

## Verify Installation

### 1. Check Backend API

Open your browser or use curl:

```bash
# Check health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-02-08T12:00:00.000Z"}
```

Or visit: http://localhost:5000/api/health

### 2. Check Frontend

Open your browser and visit: http://localhost:5173

You should see the application homepage.

### 3. Check Database Connection

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use multi-agent-sdlc

# Show collections
show collections

# Exit
exit
```

---

## Common Tasks

### 1. Create a New User

**Using the API:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Using the Frontend:**
1. Go to http://localhost:5173
2. Click "Register" or "Sign Up"
3. Fill out the registration form
4. Submit

### 2. Login

**Using the API:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Response will include a JWT token:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Make Authenticated Requests

```bash
# Use the token from login response
TOKEN="your-jwt-token-here"

# Access protected endpoint
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run backend tests only
cd src/backend
npm test

# Run frontend tests only
cd src/frontend
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### 5. Run Linter

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### 6. Build for Production

```bash
# Build backend (if needed)
cd src/backend
npm run build

# Build frontend
cd src/frontend
npm run build

# Output will be in src/frontend/dist/
```

### 7. Seed Database (Optional)

```bash
# Run database seeding script
npm run seed

# Or manually
node scripts/seed.js
```

### 8. Reset Database

```bash
# Drop all collections
mongosh multi-agent-sdlc --eval "db.dropDatabase()"

# Or use the script
npm run db:reset
```

---

## Using the Agent Orchestrator

The orchestrator is the core of the multi-agent system. Here's how to use it:

### 1. Start Orchestrator

```bash
node orchestrator.js
```

### 2. Follow the Workflow

The orchestrator will guide you through:

1. **Discovery Phase (BA Agent)**
   - You'll be prompted to describe your requirements
   - Example: "Build an e-commerce platform with product catalog and shopping cart"

2. **Architecture Phase (System Architect)**
   - Review the proposed architecture
   - Approve or request changes

3. **Planning Phase (Planner Agent)** 🚨 **Approval Gate #1**
   - Review the implementation plan
   - Approve task breakdown and estimates
   - Type "approve" to continue

4. **Execution Phase (Dev Swarm)**
   - Agents generate code
   - Review generated files

5. **Validation Phase (QA Agent)**
   - Tests are run automatically
   - Review test results

6. **Security Audit (Security Sentinel)** 🚨 **Approval Gate #2**
   - Security scan results are displayed
   - Approve if no critical issues
   - Type "approve" to proceed

7. **Complete**
   - Project is ready for deployment

### 3. Check PROJECT_KNOWLEDGE.md

All agent decisions are recorded in:
```bash
cat docs/PROJECT_KNOWLEDGE.md
```

This is your **Single Source of Truth (SSOT)** for the project.

---

## Troubleshooting

### Problem: MongoDB Connection Error

**Error:**
```
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Make sure MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# If not running, start it
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Problem: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux

# Or use a different port
# Edit .env and change PORT=5001
```

### Problem: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or in the specific folder
cd src/backend
rm -rf node_modules package-lock.json
npm install
```

### Problem: JWT Secret Not Set

**Error:**
```
Error: JWT_SECRET is not defined
```

**Solution:**
```bash
# Make sure .env file exists
cp .env.example .env

# Generate a secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env file
JWT_SECRET=<generated-secret>
```

### Problem: Permission Denied

**Error:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER ./node_modules

# Or use sudo (not recommended)
sudo npm install
```

### Problem: React App Won't Start

**Error:**
```
Error: Cannot find module 'vite'
```

**Solution:**
```bash
cd src/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem: Database Access Denied

**Error:**
```
MongoServerError: Authentication failed
```

**Solution:**
```bash
# Check MongoDB URI in .env
# Make sure username and password are correct
# If using Atlas, check IP whitelist

# For local MongoDB without auth (development only):
MONGODB_URI=mongodb://localhost:27017/multi-agent-sdlc
```

---

## Next Steps

Now that you have the framework running, here's what to do next:

### 1. 📚 Read the Documentation
- [Agent Instructions](AGENT_INSTRUCTIONS.md) - How agents work
- [Agent Framework](AGENT_FRAMEWORK.md) - Technical deep dive
- [Template Usage](TEMPLATE_USAGE.md) - Customization guide

### 2. 🛠️ Customize for Your Project
- Update `package.json` with your project name
- Modify `README.md` with your project description
- Configure agents in `.agent-config/` folder

### 3. 🎨 Customize the UI
- Edit frontend components in `src/frontend/components/`
- Update styles in `src/frontend/styles/`
- Modify Tailwind config in `tailwind.config.js`

### 4. 📝 Define Your Requirements
- Fill out [Requirements Template](REQUIREMENTS_TEMPLATE.md)
- Run the orchestrator: `node orchestrator.js`
- Let agents build your application

### 5. 🔒 Review Security
- Read [Security Checklist](SECURITY_CHECKLIST.md)
- Configure environment variables properly
- Never commit `.env` file

### 6. 🚀 Deploy Your Application
- Build production version
- Choose hosting provider (Heroku, AWS, Vercel, etc.)
- Set up CI/CD pipeline
- Configure production database

---

## Helpful Commands Cheat Sheet

```bash
# Development
npm run dev:backend    # Start backend in dev mode
npm run dev:frontend   # Start frontend in dev mode
node orchestrator.js   # Start agent orchestrator

# Testing
npm test              # Run all tests
npm test -- --watch   # Run tests in watch mode
npm test -- --coverage # Run tests with coverage

# Code Quality
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix linting issues

# Building
npm run build         # Build for production

# Database
npm run seed          # Seed database with sample data
npm run db:reset      # Reset database

# Git
git status            # Check file status
git add .             # Stage all changes
git commit -m "msg"   # Commit changes
git push              # Push to remote
```

---

## Learning Resources

### Official Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

### Video Tutorials
- [Node.js Crash Course](https://www.youtube.com/results?search_query=nodejs+crash+course)
- [React Tutorial](https://www.youtube.com/results?search_query=react+tutorial)
- [MongoDB Tutorial](https://www.youtube.com/results?search_query=mongodb+tutorial)

### Community
- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Discussions](https://github.com/mohitkesarwani/multi-agent-sdlc-framework/discussions)
- [Discord Community](#) (if available)

---

## Getting Help

### Found a Bug?
Open an issue on GitHub:
https://github.com/mohitkesarwani/multi-agent-sdlc-framework/issues

### Have a Question?
- Check the [FAQ](TEMPLATE_USAGE.md#faq)
- Search existing issues
- Ask in GitHub Discussions

### Need Support?
- 📧 Email: [support@example.com]
- 💬 Discord: [Link to Discord]
- 📖 Documentation: [docs/](../docs/)

---

## Success! 🎉

You now have the Multi-Agent SDLC Framework running locally. You're ready to:

- ✅ Explore the codebase
- ✅ Run the agent orchestrator
- ✅ Build your application
- ✅ Deploy to production

**Happy coding! 🚀**

---

**Last Updated:** 2024-02-08  
**Version:** 1.0.0  
**Feedback:** Please report issues or suggestions on GitHub
