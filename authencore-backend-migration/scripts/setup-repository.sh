#!/bin/bash

# Repository Setup Script
# This script helps set up the AuthenCore Backend Migration repository

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}AuthenCore Backend Migration - Repository Setup${NC}"
echo "================================================="
echo ""

# Function to print success messages
success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print warning messages
warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print error messages
error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to print info messages
info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        error "Git is not installed. Please install Git and try again."
        exit 1
    fi
    success "Git is installed"
}

# Initialize git repository if not already initialized
init_git_repo() {
    if [ ! -d "$PROJECT_ROOT/.git" ]; then
        info "Initializing Git repository..."
        cd "$PROJECT_ROOT"
        git init
        success "Git repository initialized"
    else
        success "Git repository already exists"
    fi
}

# Create initial commit
create_initial_commit() {
    cd "$PROJECT_ROOT"
    
    # Add all files
    git add .
    
    # Check if there are any changes to commit
    if git diff --staged --quiet; then
        warning "No changes to commit"
    else
        git commit -m "Initial commit: AuthenCore Backend Migration Package

This commit includes:
- Complete Docker configuration for development and production
- 11 Supabase Edge Functions for backend functionality
- PostgreSQL database schema and migrations
- Security configurations and rate limiting
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation and deployment guides
- Environment configuration templates
- Backup and monitoring scripts

Ready for production deployment."
        success "Initial commit created"
    fi
}

# Set up GitHub repository
setup_github() {
    echo ""
    info "GitHub Repository Setup Instructions:"
    echo ""
    echo "1. Go to GitHub.com and create a new repository:"
    echo "   Repository name: authencore-backend-migration"
    echo "   Description: Complete deployment package for AuthenCore Analytics platform"
    echo "   Visibility: Private (recommended) or Public"
    echo ""
    echo "2. Once created, add the remote origin:"
    echo -e "   ${YELLOW}git remote add origin https://github.com/YOUR_USERNAME/authencore-backend-migration.git${NC}"
    echo ""
    echo "3. Push the code to GitHub:"
    echo -e "   ${YELLOW}git branch -M main${NC}"
    echo -e "   ${YELLOW}git push -u origin main${NC}"
    echo ""
    echo "4. (Optional) Set up GitHub Actions secrets:"
    echo "   Go to Settings > Secrets and variables > Actions"
    echo "   Add the following secrets:"
    echo "   - OPENAI_API_KEY"
    echo "   - RESEND_API_KEY"
    echo "   - DATABASE_URL"
    echo "   - And other environment variables as needed"
    echo ""
}

# Set up environment file
setup_environment() {
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        info "Setting up environment file..."
        cp "$PROJECT_ROOT/config/environment.template" "$PROJECT_ROOT/.env"
        success "Environment file created from template"
        warning "Please edit .env file with your actual configuration values"
    else
        success "Environment file already exists"
    fi
}

# Make scripts executable
make_scripts_executable() {
    info "Making scripts executable..."
    chmod +x "$PROJECT_ROOT/scripts"/*.sh
    success "Scripts are now executable"
}

# Validate repository structure
validate_structure() {
    info "Validating repository structure..."
    
    required_files=(
        "README.md"
        "DEPLOYMENT_GUIDE.md"
        "ENVIRONMENT_SETUP.md"
        "DEPLOYMENT_CHECKLIST.md"
        "docker/docker-compose.yml"
        "docker/Dockerfile.prod"
        "config/environment.template"
        "scripts/validate-environment.sh"
        ".github/workflows/deploy.yml"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            success "$file exists"
        else
            error "$file is missing"
        fi
    done
}

# Show next steps
show_next_steps() {
    echo ""
    echo -e "${BLUE}🎉 Repository setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review and edit the .env file with your configuration"
    echo "2. Create a GitHub repository and push the code"
    echo "3. Review the DEPLOYMENT_CHECKLIST.md for deployment requirements"
    echo "4. Follow DEPLOYMENT_GUIDE.md for detailed deployment instructions"
    echo ""
    echo "Quick commands:"
    echo -e "  ${YELLOW}./scripts/validate-environment.sh${NC}  # Validate your environment"
    echo -e "  ${YELLOW}docker-compose --profile dev up -d${NC}   # Start development environment"
    echo -e "  ${YELLOW}docker-compose --profile prod up -d${NC}  # Start production environment"
    echo ""
    echo "For support: tech@authencore.org"
}

# Main setup process
main() {
    check_git
    init_git_repo
    setup_environment
    make_scripts_executable
    validate_structure
    create_initial_commit
    setup_github
    show_next_steps
}

# Help function
show_help() {
    cat << EOF
AuthenCore Backend Migration - Repository Setup Script

Usage: $0 [OPTIONS]

Options:
    -h, --help          Show this help message
    --skip-commit       Skip creating initial commit
    --skip-github       Skip GitHub setup instructions
    
Examples:
    $0                  # Full setup
    $0 --skip-commit    # Setup without committing
    
Description:
    This script sets up the AuthenCore Backend Migration repository for
    deployment. It initializes Git, creates necessary files, and provides
    instructions for GitHub setup.
EOF
}

# Parse command line arguments
SKIP_COMMIT=false
SKIP_GITHUB=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --skip-commit)
            SKIP_COMMIT=true
            ;;
        --skip-github)
            SKIP_GITHUB=true
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
    shift
done

# Run main setup
main