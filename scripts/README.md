# Setup Scripts

This directory contains utility scripts for setting up and managing the Multi-Agent SDLC Framework.

## Available Scripts

### 🚀 setup.sh
**Purpose:** Initial project setup for first-time use

**What it does:**
- Checks for required dependencies (Node.js, npm, MongoDB, Docker)
- Creates `.env` files from `.env.example` templates
- Installs all project dependencies (root, backend, frontend)
- Creates necessary directories (logs, uploads)
- Sets up Git hooks for code quality

**Usage:**
```bash
./scripts/setup.sh
```

**Requirements:**
- Node.js 16+
- npm 8+

**Optional:**
- MongoDB (for database)
- Docker (for containerized development)

---

### 🔧 init-backend.sh
**Purpose:** Initialize the backend with database setup and admin user

**What it does:**
- Verifies MongoDB connection
- Installs backend dependencies if needed
- Runs database migrations
- Optionally creates an admin user

**Usage:**
```bash
./scripts/init-backend.sh
```

**Prerequisites:**
- MongoDB must be running
- `src/backend/.env` must exist (run `setup.sh` first)

---

### 📦 install-deps.sh
**Purpose:** Install or update all project dependencies

**What it does:**
- Installs/updates root dependencies
- Installs/updates backend dependencies
- Installs/updates frontend dependencies

**Usage:**
```bash
./scripts/install-deps.sh
```

**When to use:**
- After pulling latest changes with new dependencies
- When `node_modules` directories are deleted
- To update dependencies to latest versions

---

### 🗄️ migrate.sh
**Purpose:** Run database migrations

**What it does:**
- Loads environment variables
- Executes pending database migrations
- Updates database schema

**Usage:**
```bash
./scripts/migrate.sh
```

**Note:** This is a template script. Customize it based on your migration tool:
- [migrate-mongo](https://github.com/seppevs/migrate-mongo) for MongoDB
- [Sequelize](https://sequelize.org/) for SQL databases
- Custom migration scripts

---

## Quick Start Guide

### First Time Setup
Run these scripts in order:

```bash
# 1. Initial setup
./scripts/setup.sh

# 2. Update environment variables
nano src/backend/.env  # or use your preferred editor

# 3. Initialize backend
./scripts/init-backend.sh
```

### Development Workflow

```bash
# Install/update dependencies after git pull
./scripts/install-deps.sh

# Run migrations if schema changed
./scripts/migrate.sh
```

---

## Script Execution Permissions

All scripts should be executable. If you encounter permission errors, run:

```bash
chmod +x scripts/*.sh
```

---

## Customization

These scripts are designed to be customized for your specific needs:

1. **Environment Variables:** Add new variables in `.env.example`
2. **Dependencies:** Update package.json files
3. **Migrations:** Add migration logic to `migrate.sh`
4. **Database Seeding:** Extend `init-backend.sh` with seed data
5. **Pre/Post Hooks:** Add custom logic before or after main operations

---

## Troubleshooting

### "Command not found" errors
- Ensure scripts have execute permissions: `chmod +x scripts/*.sh`
- Run scripts from project root: `./scripts/setup.sh`

### MongoDB connection errors
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Test connection: `mongosh <your-connection-string>`

### Node.js version errors
- Check version: `node -v`
- Update Node.js: Visit [nodejs.org](https://nodejs.org/)
- Use nvm: `nvm install 18 && nvm use 18`

### Permission denied errors
- Some operations may require sudo
- Check file/directory permissions
- Ensure current user owns project files

---

## CI/CD Integration

These scripts can be used in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Setup project
  run: ./scripts/setup.sh

- name: Run migrations
  run: ./scripts/migrate.sh
```

---

## Contributing

When adding new scripts:

1. Follow the existing naming convention
2. Add comprehensive comments
3. Include error handling (`set -e`)
4. Use colored output for better UX
5. Update this README
6. Make scripts idempotent (safe to run multiple times)

---

## Additional Resources

- [Project README](../README.md)
- [Setup Guide](../SETUP_GUIDE.md)
- [Docker Documentation](../infrastructure/docker/)
- [Agent Configuration](../.agent-config/)
