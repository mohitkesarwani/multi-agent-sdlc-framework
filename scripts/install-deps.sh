#!/bin/bash
# ============================================
# Dependency Installation Script
# ============================================
# Installs all project dependencies for root,
# backend, and frontend
# ============================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

main() {
    print_header "Installing Project Dependencies"
    
    # Root dependencies
    if [ -f "package.json" ]; then
        echo "Installing root dependencies..."
        npm install
        print_success "Root dependencies installed"
    fi
    
    # Backend dependencies
    if [ -f "src/backend/package.json" ]; then
        echo "Installing backend dependencies..."
        cd src/backend
        npm install
        cd ../..
        print_success "Backend dependencies installed"
    fi
    
    # Frontend dependencies
    if [ -f "src/frontend/package.json" ]; then
        echo "Installing frontend dependencies..."
        cd src/frontend
        npm install
        cd ../..
        print_success "Frontend dependencies installed"
    fi
    
    print_header "All Dependencies Installed!"
    print_success "Ready to start development"
}

main
