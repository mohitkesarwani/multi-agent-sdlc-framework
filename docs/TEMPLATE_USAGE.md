# Template Usage Guide

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Cloning and Customization](#cloning-and-customization)
- [Configuration Steps](#configuration-steps)
- [File Structure Explanation](#file-structure-explanation)
- [Environment Setup](#environment-setup)
- [Customization Guide](#customization-guide)
- [Deployment Guide](#deployment-guide)
- [FAQ](#faq)

---

## Overview

The Multi-Agent SDLC Framework is a template repository designed to accelerate software development by leveraging AI agents that collaborate throughout the entire Software Development Life Cycle (SDLC). This guide will walk you through how to use this template for your own projects.

### What's Included

✅ **Complete SDLC Agent System**
- Business Analyst Agent for requirements gathering
- System Architect Agent for technical design
- Implementation Planner for project planning
- Full-Stack Development Swarm (Backend + Frontend)
- Quality Assurance Agent for testing
- Security Sentinel for vulnerability scanning

✅ **Pre-configured Technology Stack**
- Backend: Node.js + Express + MongoDB + Mongoose
- Frontend: React + Vite + Tailwind CSS
- Testing: Jest + Vitest
- Validation: Zod
- Security: Helmet, bcrypt, JWT

✅ **Project Structure**
- Organized folder structure
- Configuration files
- Example code
- Comprehensive documentation

✅ **CI/CD Ready**
- GitHub Actions workflows (optional)
- Environment configuration
- Deployment scripts

---

## Getting Started

### Prerequisites

Before using this template, ensure you have:

- **Node.js** (v16.x or later)
- **npm** or **yarn** (v7.x or later)
- **MongoDB** (v5.x or later) - Local or cloud instance
- **Git** (v2.x or later)
- **Code Editor** (VS Code recommended)
- **GitHub Account** (for template cloning)

### Quick Start (5 Minutes)

```bash
# 1. Clone the template repository
git clone https://github.com/mohitkesarwani/multi-agent-sdlc-framework.git my-project
cd my-project

# 2. Install dependencies
npm install

# 3. Copy environment configuration
cp .env.example .env

# 4. Edit .env with your settings
nano .env

# 5. Start MongoDB (if running locally)
mongod --dbpath /path/to/your/db

# 6. Start the orchestrator
node orchestrator.js
```

---

## Cloning and Customization

### Method 1: Use as GitHub Template

1. **Navigate to the repository**: https://github.com/mohitkesarwani/multi-agent-sdlc-framework

2. **Click "Use this template"** button (green button at the top right)

3. **Configure your new repository**:
   - Owner: Select your account or organization
   - Repository name: Enter your project name (e.g., `my-awesome-app`)
   - Description: Describe your project
   - Visibility: Public or Private
   - Click "Create repository from template"

4. **Clone your new repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/my-awesome-app.git
   cd my-awesome-app
   ```

### Method 2: Manual Clone and Customize

```bash
# 1. Clone the template
git clone https://github.com/mohitkesarwani/multi-agent-sdlc-framework.git my-project
cd my-project

# 2. Remove the original Git history
rm -rf .git

# 3. Initialize a new Git repository
git init

# 4. Create initial commit
git add .
git commit -m "Initial commit from Multi-Agent SDLC template"

# 5. Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/my-project.git

# 6. Push to your repository
git branch -M main
git push -u origin main
```

### Method 3: Download as ZIP

1. Go to https://github.com/mohitkesarwani/multi-agent-sdlc-framework
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Rename the folder to your project name
5. Initialize Git and commit

---

## Configuration Steps

### 1. Update package.json

Customize your project metadata:

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "My awesome application built with Multi-Agent SDLC Framework",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/my-awesome-app.git"
  }
}
```

### 2. Configure Environment Variables

Edit `.env` file:

```bash
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/my-awesome-app
MONGODB_URI_TEST=mongodb://localhost:27017/my-awesome-app-test

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

**Important**: Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Update README.md

Replace the template README with your project information:

```bash
cp TEMPLATE_README.md README.md
# Edit README.md with your project details
```

### 4. Customize Agent Configuration (Optional)

If you want to modify agent behavior, edit files in `.agent-config/`:

- `01_Requirement_Agent.md` - Requirements gathering
- `02_System_Architect.md` - Architecture design
- `03_Implementation_Planner.md` - Planning
- `04_FullStack_Dev_Swarm.md` - Development
- `05_Quality_Assurance.md` - Testing
- `06_Security_Sentinel.md` - Security

### 5. Initialize PROJECT_KNOWLEDGE.md

The orchestrator uses `docs/PROJECT_KNOWLEDGE.md` as the single source of truth. Initialize it:

```bash
# The file already exists with a template structure
# You can customize it for your project needs
nano docs/PROJECT_KNOWLEDGE.md
```

---

## File Structure Explanation

```
multi-agent-sdlc-framework/
│
├── .agent-config/                   # Agent instruction files
│   ├── 01_Requirement_Agent.md
│   ├── 02_System_Architect.md
│   ├── 03_Implementation_Planner.md
│   ├── 04_FullStack_Dev_Swarm.md
│   ├── 05_Quality_Assurance.md
│   └── 06_Security_Sentinel.md
│
├── docs/                            # Project documentation
│   ├── PROJECT_KNOWLEDGE.md         # Single source of truth
│   ├── AGENT_INSTRUCTIONS.md        # Agent guidelines
│   ├── AGENT_FRAMEWORK.md           # Technical framework docs
│   ├── TEMPLATE_USAGE.md            # This file
│   ├── REQUIREMENTS_TEMPLATE.md     # Requirements template
│   ├── ARCHITECTURE_TEMPLATE.md     # Architecture template
│   ├── SECURITY_CHECKLIST.md        # Security checklist
│   └── QUICK_START.md               # Quick start guide
│
├── src/
│   ├── backend/                     # Backend application
│   │   ├── config/                  # Configuration files
│   │   ├── controllers/             # Request handlers
│   │   ├── middleware/              # Express middleware
│   │   ├── models/                  # Mongoose models
│   │   ├── routes/                  # Express routes
│   │   ├── services/                # Business logic
│   │   ├── server.js                # Express server entry
│   │   └── package.json
│   │
│   └── frontend/                    # Frontend application
│       ├── components/              # React components
│       ├── pages/                   # Page components
│       ├── hooks/                   # Custom React hooks
│       ├── context/                 # React Context
│       ├── services/                # API client
│       ├── styles/                  # CSS/Tailwind
│       ├── App.jsx                  # Main app component
│       ├── main.jsx                 # Entry point
│       ├── vite.config.js           # Vite configuration
│       └── package.json
│
├── scripts/                         # Utility scripts
│   ├── setup.sh                     # Setup script
│   ├── seed.js                      # Database seeding
│   └── deploy.sh                    # Deployment script
│
├── infrastructure/                  # Infrastructure as code
│   ├── docker/                      # Docker files
│   └── terraform/                   # Terraform configs
│
├── .github/                         # GitHub configuration
│   └── workflows/                   # GitHub Actions
│
├── orchestrator.js                  # Main orchestrator
├── package.json                     # Root package.json
├── .env.example                     # Environment template
├── .eslintrc.json                   # ESLint config
├── .prettierrc                      # Prettier config
├── jest.config.js                   # Jest config
├── vite.config.js                   # Vite config
└── README.md                        # Project README
```

### Key Files Explained

#### `orchestrator.js`
The master controller that manages all agents and workflow. This is the entry point for the multi-agent system.

#### `docs/PROJECT_KNOWLEDGE.md`
**Single Source of Truth (SSOT)** - All agents read from and write to this file. It contains:
- Business requirements
- Technical architecture
- Implementation plans
- Test results
- Security audit findings

#### `.agent-config/`
Configuration files for each agent. These files instruct agents on their responsibilities and workflows.

#### `src/backend/`
Node.js + Express backend with:
- RESTful API structure
- MongoDB/Mongoose integration
- Authentication middleware
- Input validation

#### `src/frontend/`
React + Vite frontend with:
- Component-based architecture
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling

---

## Environment Setup

### 1. Install Node.js Dependencies

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

### 2. Setup MongoDB

#### Option A: Local MongoDB

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb

# Verify MongoDB is running
sudo systemctl status mongodb

# Create database (automatic on first connection)
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/myapp?retryWrites=true&w=majority
   ```

### 3. Start Development Servers

```bash
# Terminal 1: Start backend
cd src/backend
npm run dev

# Terminal 2: Start frontend
cd src/frontend
npm run dev

# Terminal 3: Run orchestrator (when needed)
node orchestrator.js
```

### 4. Verify Setup

Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

Test API health:
```bash
curl http://localhost:5000/api/health
```

---

## Customization Guide

### 1. Change Technology Stack

#### Replace MongoDB with PostgreSQL

1. Install PostgreSQL and Sequelize:
   ```bash
   npm install pg pg-hstore sequelize
   npm uninstall mongoose
   ```

2. Update `src/backend/config/database.js`:
   ```javascript
   const { Sequelize } = require('sequelize');
   
   const sequelize = new Sequelize(process.env.DATABASE_URL, {
     dialect: 'postgres',
     logging: false
   });
   
   module.exports = sequelize;
   ```

3. Convert Mongoose models to Sequelize models

#### Replace React with Vue.js

1. Create new Vite project with Vue:
   ```bash
   npm create vite@latest src/frontend -- --template vue
   ```

2. Copy your API service files

3. Update orchestrator agent configs

### 2. Add Custom Agents

Create a new agent configuration file:

```bash
# Create agent file
touch .agent-config/07_Custom_Agent.md
```

Example content:
```markdown
# 🤖 07_Custom_Agent - Custom Role

## Core Responsibility
[Describe what this agent does]

## Workflow
[Describe the workflow steps]

## Output
[Describe what this agent produces]

## Handover To
[Next agent in the chain]
```

Register in `orchestrator.js`:
```javascript
const AGENT_REGISTRY = {
  // ... existing agents
  CUSTOM: {
    id: '07_Custom_Agent',
    role: 'Custom Role',
    responsibilities: ['Task 1', 'Task 2'],
    canTransitionTo: ['NEXT_AGENT'],
    instructionFile: '.agent-config/07_Custom_Agent.md'
  }
};
```

### 3. Customize UI Theme

#### Update Tailwind Configuration

Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          // ... your colors
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  }
};
```

### 4. Add Custom Middleware

Create middleware file:
```javascript
// src/backend/middleware/customMiddleware.js
module.exports = (req, res, next) => {
  // Your custom logic
  console.log('Custom middleware executed');
  next();
};
```

Register in `server.js`:
```javascript
const customMiddleware = require('./middleware/customMiddleware');
app.use(customMiddleware);
```

### 5. Configure CI/CD

#### GitHub Actions Example

Create `.github/workflows/ci.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: echo "Deploy your app here"
```

---

## Deployment Guide

### 1. Production Environment Setup

Create `.env.production`:
```bash
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/prod-db
JWT_SECRET=super-secure-production-secret
FRONTEND_URL=https://yourdomain.com
```

### 2. Deploy Backend

#### Option A: Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create my-awesome-app-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

#### Option B: Deploy to AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@ec2-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/YOUR_USERNAME/my-project.git
cd my-project

# Install dependencies
npm install --production

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start src/backend/server.js --name "my-app-api"

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

#### Option C: Deploy with Docker

```bash
# Build Docker image
docker build -t my-app-backend ./src/backend

# Run container
docker run -d \
  -p 5000:5000 \
  -e MONGODB_URI=your-uri \
  -e JWT_SECRET=your-secret \
  --name my-app-api \
  my-app-backend
```

### 3. Deploy Frontend

#### Option A: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd src/frontend

# Deploy
vercel

# Follow prompts and link to your project
```

#### Option B: Deploy to Netlify

```bash
# Build frontend
cd src/frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Deploy to AWS S3 + CloudFront

```bash
# Build frontend
cd src/frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 4. Setup Domain and SSL

#### Using Cloudflare

1. Add your domain to Cloudflare
2. Point DNS to your server IP
3. Enable "Always Use HTTPS"
4. SSL/TLS: Set to "Full (strict)"

#### Using Let's Encrypt (for self-hosted)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

---

## FAQ

### Q: Can I use this template for commercial projects?
**A:** Yes! This template is open-source (check LICENSE file for details).

### Q: Do I need to use all agents?
**A:** No, you can disable agents you don't need by modifying `orchestrator.js`.

### Q: Can I use a different database?
**A:** Yes! Replace MongoDB with PostgreSQL, MySQL, or any database. Update the models and connection logic.

### Q: Is this production-ready?
**A:** The structure is production-ready, but you should review and customize security settings, error handling, and performance optimizations for your specific needs.

### Q: How do I add authentication to my app?
**A:** The template includes JWT authentication. Check `src/backend/middleware/auth.js` and extend as needed.

### Q: Can I use TypeScript instead of JavaScript?
**A:** Yes! Install TypeScript and convert files:
```bash
npm install --save-dev typescript @types/node @types/express
npx tsc --init
```

### Q: How do I run tests?
**A:**
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Q: How do I add a new API endpoint?
**A:**
1. Create controller in `src/backend/controllers/`
2. Create route in `src/backend/routes/`
3. Register route in `server.js`
4. Add tests

### Q: Where do I put database migrations?
**A:** Create a `migrations/` folder and use a migration tool like:
- Mongoose: `migrate-mongoose`
- Sequelize: Built-in migrations
- Custom: Write migration scripts

### Q: How do I handle file uploads?
**A:** Install multer:
```bash
npm install multer
```
Configure in middleware and add to routes.

---

## Getting Help

### Resources
- 📚 **Documentation**: Check `docs/` folder for detailed guides
- 💬 **Issues**: Open an issue on GitHub
- 🌟 **Examples**: Check the example code in `src/`
- 📖 **Blog**: Read setup tutorials on the project wiki

### Community
- GitHub Discussions: Ask questions and share ideas
- Stack Overflow: Tag your questions with `multi-agent-sdlc`

### Support
For bugs and feature requests, please open an issue on GitHub:
https://github.com/mohitkesarwani/multi-agent-sdlc-framework/issues

---

## Next Steps

After setting up your project from this template:

1. ✅ Complete the [Quick Start Guide](QUICK_START.md)
2. ✅ Read [Agent Instructions](AGENT_INSTRUCTIONS.md)
3. ✅ Review [Security Checklist](SECURITY_CHECKLIST.md)
4. ✅ Fill out [Requirements Template](REQUIREMENTS_TEMPLATE.md)
5. ✅ Design architecture using [Architecture Template](ARCHITECTURE_TEMPLATE.md)
6. ✅ Start development with `node orchestrator.js`

**Happy coding! 🚀**
