#!/bin/bash
# ============================================
# Multi-Agent SDLC Framework - Setup Script
# ============================================
# This script initializes the project for first-time use
# It installs dependencies, sets up configuration files,
# and prepares the development environment
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "Multi-Agent SDLC Framework Setup"
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    print_success "Node.js $(node -v) detected"
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm -v) detected"
    
    # Optional: Check for MongoDB
    if command_exists mongod; then
        print_success "MongoDB detected"
    else
        print_warning "MongoDB not detected. You'll need MongoDB running for the backend."
    fi
    
    # Optional: Check for Docker
    if command_exists docker; then
        print_success "Docker detected"
    else
        print_warning "Docker not detected. Docker is optional but recommended."
    fi
    
    # Create environment files
    print_header "Setting Up Environment Files"
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
            print_warning "Please update .env with your actual values"
        else
            print_warning ".env.example not found, skipping root .env creation"
        fi
    else
        print_info ".env already exists, skipping"
    fi
    
    if [ ! -f "src/backend/.env" ]; then
        if [ -f "src/backend/.env.example" ]; then
            cp src/backend/.env.example src/backend/.env
            print_success "Created src/backend/.env from .env.example"
            print_warning "Please update src/backend/.env with your actual values"
        else
            print_warning "src/backend/.env.example not found"
        fi
    else
        print_info "src/backend/.env already exists, skipping"
    fi
    
    # Install dependencies
    print_header "Installing Dependencies"
    
    # Root dependencies
    print_info "Installing root dependencies..."
    npm install
    print_success "Root dependencies installed"
    
    # Backend dependencies
    if [ -d "src/backend" ]; then
        print_info "Installing backend dependencies..."
        cd src/backend && npm install && cd ../..
        print_success "Backend dependencies installed"
    fi
    
    # Frontend dependencies
    if [ -d "src/frontend" ]; then
        print_info "Installing frontend dependencies..."
        cd src/frontend && npm install && cd ../..
        print_success "Frontend dependencies installed"
    fi
    
    # Create necessary directories
    print_header "Creating Project Directories"
    
    mkdir -p logs
    mkdir -p uploads
    mkdir -p src/backend/logs
    mkdir -p src/backend/uploads
    print_success "Created necessary directories"
    
    # Set up Git hooks (optional)
    print_header "Setting Up Git Hooks (Optional)"
    
    if [ -d ".git" ]; then
        # Create pre-commit hook for linting
        cat > .git/hooks/pre-commit << 'HOOKEOF'
#!/bin/bash
npm run lint
HOOKEOF
        chmod +x .git/hooks/pre-commit
        print_success "Git pre-commit hook created"
    else
        print_warning "Not a git repository, skipping git hooks"
    fi
    
    # Display next steps
    print_header "Setup Complete!"
    
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Update environment variables in .env and src/backend/.env"
    echo "2. Start MongoDB (if not using Docker): mongod"
    echo "3. Start the backend: cd src/backend && npm run dev"
    echo "4. Start the frontend: cd src/frontend && npm run dev"
    echo ""
    echo "Or use Docker Compose:"
    echo "  docker-compose -f infrastructure/docker/docker-compose.yml up"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run main function
main
