#!/bin/bash

# AuthenCore Analytics Deployment Script
# This script automates the deployment process for production environments

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"
BACKUP_DIR="$PROJECT_ROOT/backups"
LOG_FILE="$PROJECT_ROOT/logs/deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error() {
    log "${RED}ERROR: $1${NC}"
    exit 1
}

success() {
    log "${GREEN}SUCCESS: $1${NC}"
}

warning() {
    log "${YELLOW}WARNING: $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
    fi
}

# Validate environment
validate_environment() {
    log "Validating environment..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found: $ENV_FILE"
    fi
    
    # Source environment variables
    source "$ENV_FILE"
    
    # Check required variables
    required_vars=(
        "DATABASE_URL"
        "OPENAI_API_KEY" 
        "RESEND_API_KEY"
        "SUPABASE_URL"
        "SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            error "Required environment variable not set: $var"
        fi
    done
    
    success "Environment validation passed"
}

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    dependencies=("docker" "docker-compose" "psql" "curl")
    
    for dep in "${dependencies[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            error "Required dependency not found: $dep"
        fi
    done
    
    success "All dependencies are available"
}

# Database backup
backup_database() {
    log "Creating database backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    backup_file="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if pg_dump "$DATABASE_URL" > "$backup_file"; then
        success "Database backup created: $backup_file"
    else
        error "Failed to create database backup"
    fi
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    cd "$PROJECT_ROOT"
    
    # Pull latest images
    docker-compose --profile prod pull
    
    # Stop existing containers
    docker-compose --profile prod down
    
    # Start new containers
    docker-compose --profile prod up -d
    
    success "Application deployed successfully"
}

# Health checks
health_checks() {
    log "Running health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check application health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        success "Application health check passed"
    else
        error "Application health check failed"
    fi
    
    # Check database connectivity
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        success "Database connectivity check passed"
    else
        error "Database connectivity check failed"
    fi
}

# Cleanup old resources
cleanup() {
    log "Cleaning up old resources..."
    
    # Remove old Docker images
    docker image prune -f
    
    # Remove old backups (keep last 7 days)
    find "$BACKUP_DIR" -name "backup_*.sql" -mtime +7 -delete 2>/dev/null || true
    
    # Rotate logs
    if [[ -f "$LOG_FILE" ]] && [[ $(stat -c%s "$LOG_FILE") -gt 10485760 ]]; then
        mv "$LOG_FILE" "$LOG_FILE.old"
        touch "$LOG_FILE"
    fi
    
    success "Cleanup completed"
}

# Monitor deployment
monitor_deployment() {
    log "Monitoring deployment..."
    
    # Check container status
    if docker-compose --profile prod ps | grep -q "Up"; then
        success "Containers are running"
    else
        warning "Some containers may not be running properly"
        docker-compose --profile prod ps
    fi
    
    # Show logs for verification
    log "Recent application logs:"
    docker-compose --profile prod logs --tail=20 authencore-app
}

# Rollback function
rollback() {
    warning "Rolling back deployment..."
    
    # Stop current containers
    docker-compose --profile prod down
    
    # Restore from backup if needed
    latest_backup=$(ls -t "$BACKUP_DIR"/backup_*.sql 2>/dev/null | head -1)
    
    if [[ -n "$latest_backup" ]]; then
        warning "Latest backup available: $latest_backup"
        read -p "Do you want to restore the database? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            psql "$DATABASE_URL" < "$latest_backup"
            success "Database restored from backup"
        fi
    fi
    
    error "Rollback completed - manual intervention required"
}

# Signal handlers
trap rollback ERR
trap 'log "Deployment interrupted by user"; exit 1' INT TERM

# Main deployment process
main() {
    log "Starting AuthenCore Analytics deployment..."
    
    check_root
    validate_environment
    check_dependencies
    backup_database
    deploy_application
    health_checks
    cleanup
    monitor_deployment
    
    success "Deployment completed successfully!"
    log "Application is now running at: http://localhost"
    log "Logs can be viewed with: docker-compose --profile prod logs -f"
}

# Help function
show_help() {
    cat << EOF
AuthenCore Analytics Deployment Script

Usage: $0 [OPTIONS]

Options:
    -h, --help          Show this help message
    -b, --backup-only   Only perform database backup
    -r, --rollback      Rollback to previous version
    -c, --check         Only perform health checks
    
Examples:
    $0                  # Full deployment
    $0 --backup-only    # Backup database only
    $0 --check          # Health checks only
    
Environment:
    Ensure .env file is properly configured before running.
    
Logs:
    Deployment logs are stored in: $LOG_FILE
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -b|--backup-only)
            check_root
            validate_environment
            backup_database
            exit 0
            ;;
        -r|--rollback)
            rollback
            exit 0
            ;;
        -c|--check)
            health_checks
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
    shift
done

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

# Run main deployment
main