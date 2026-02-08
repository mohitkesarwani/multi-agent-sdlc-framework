#!/bin/bash
# ============================================
# Backend Initialization Script
# ============================================
# Initializes the backend with database setup,
# admin user creation, and initial data seeding
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

main() {
    print_header "Backend Initialization"
    
    # Check if .env exists
    if [ ! -f "src/backend/.env" ]; then
        print_error "src/backend/.env not found. Please run setup.sh first."
        exit 1
    fi
    
    # Load environment variables
    export $(cat src/backend/.env | grep -v '^#' | xargs)
    
    print_info "Checking MongoDB connection..."
    
    # Try to connect to MongoDB
    if command -v mongosh >/dev/null 2>&1; then
        if mongosh "$MONGODB_URI" --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
            print_success "MongoDB connection successful"
        else
            print_error "Cannot connect to MongoDB at $MONGODB_URI"
            print_info "Make sure MongoDB is running"
            exit 1
        fi
    else
        print_info "mongosh not found, skipping MongoDB connection check"
    fi
    
    # Install backend dependencies if needed
    print_info "Checking backend dependencies..."
    cd src/backend
    if [ ! -d "node_modules" ]; then
        print_info "Installing backend dependencies..."
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi
    
    # Run database migrations (if migration script exists)
    if [ -f "../../scripts/migrate.sh" ]; then
        print_info "Running database migrations..."
        ../../scripts/migrate.sh
        print_success "Migrations completed"
    else
        print_info "No migration script found, skipping migrations"
    fi
    
    # Create admin user (optional)
    print_header "Admin User Setup (Optional)"
    
    read -p "Do you want to create an admin user? (y/n): " CREATE_ADMIN
    if [ "$CREATE_ADMIN" = "y" ] || [ "$CREATE_ADMIN" = "Y" ]; then
        read -p "Admin email: " ADMIN_EMAIL
        read -sp "Admin password: " ADMIN_PASSWORD
        echo ""
        
        # Create admin user using Node script
        node -e "
        const mongoose = require('mongoose');
        const bcrypt = require('bcryptjs');
        const User = require('./models/User');
        
        mongoose.connect('$MONGODB_URI')
          .then(async () => {
            const hashedPassword = await bcrypt.hash('$ADMIN_PASSWORD', 12);
            const admin = await User.create({
              email: '$ADMIN_EMAIL',
              password: hashedPassword,
              name: 'Admin',
              role: 'admin',
              status: 'active'
            });
            console.log('Admin user created:', admin.email);
            process.exit(0);
          })
          .catch(err => {
            console.error('Error:', err.message);
            process.exit(1);
          });
        " && print_success "Admin user created" || print_error "Failed to create admin user"
    fi
    
    cd ../..
    
    print_header "Backend Initialization Complete!"
    print_success "Backend is ready to use"
    echo ""
    echo "Start the backend with:"
    echo "  cd src/backend && npm run dev"
}

main
