# Environment Setup Guide

## Required Environment Variables

### Core Database Configuration
```bash
# PostgreSQL Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/authencore_analytics"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="authencore_analytics"
DB_USER="authencore_user"
DB_PASSWORD="your-secure-password"

# Database Pool Settings
DB_POOL_MIN=2
DB_POOL_MAX=20
DB_TIMEOUT=30000
```

### Supabase Configuration (if using Supabase features)
```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_DB_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"
```

### AI Service API Keys
```bash
# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_ORG_ID="org-your-organization-id"
OPENAI_MODEL="gpt-4o-mini"

# Anthropic Configuration (Required for chatbot)
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"
```

### Email Service Configuration
```bash
# Resend Configuration (Required for email notifications)
RESEND_API_KEY="re_your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
RESEND_FROM_NAME="AuthenCore Analytics"
```

### File Storage Configuration
```bash
# S3-Compatible Storage
STORAGE_ENDPOINT="https://your-storage-endpoint.com"
STORAGE_ACCESS_KEY="your-access-key"
STORAGE_SECRET_KEY="your-secret-key"
STORAGE_BUCKET="authencore-files"
STORAGE_REGION="us-east-1"

# Storage Limits (in bytes)
STORAGE_LIMIT_REPORTS=5368709120    # 5GB
STORAGE_LIMIT_MARKETING=2147483648  # 2GB
STORAGE_LIMIT_LOGOS=524288000       # 500MB
```

### Application Configuration
```bash
# Application Settings
APP_ENV="production"
APP_URL="https://yourdomain.com"
APP_PORT="3000"
APP_NAME="AuthenCore Analytics"

# Security Settings
JWT_SECRET="your-jwt-secret-key"
ENCRYPTION_KEY="your-32-character-encryption-key"
SESSION_SECRET="your-session-secret"
CORS_ORIGIN="https://yourdomain.com"

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes in ms
RATE_LIMIT_MAX=100        # Max requests per window
RATE_LIMIT_SKIP_FAILING_REQUESTS=true
```

### Third-Party Integrations
```bash
# Payment Processing (if using Stripe)
STRIPE_PUBLIC_KEY="pk_live_your-stripe-public-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
MIXPANEL_TOKEN="your-mixpanel-token"

# Error Monitoring (Optional)
SENTRY_DSN="https://your-sentry-dsn"
SENTRY_ENVIRONMENT="production"
```

### Logging Configuration
```bash
# Logging Settings
LOG_LEVEL="info"
LOG_FORMAT="json"
LOG_FILE="/var/log/authencore/app.log"
LOG_MAX_SIZE="100m"
LOG_MAX_FILES=10
```

### Security Configuration
```bash
# Security Headers
SECURITY_HSTS_MAX_AGE=31536000
SECURITY_CONTENT_TYPE_NOSNIFF=true
SECURITY_FRAME_OPTIONS="SAMEORIGIN"
SECURITY_XSS_PROTECTION="1; mode=block"

# CSRF Protection
CSRF_SECRET="your-csrf-secret"
CSRF_COOKIE_NAME="csrf-token"

# Session Configuration
SESSION_NAME="authencore-session"
SESSION_MAX_AGE=86400000  # 24 hours in ms
SESSION_SECURE=true
SESSION_HTTP_ONLY=true
```

## Environment Setup by Deployment Method

### Docker Deployment
Create a `.env` file in your Docker directory:
```bash
cp config/environment.template docker/.env
# Edit docker/.env with your values
```

### Native Deployment
Set environment variables in your shell or service manager:
```bash
# For systemd service
sudo nano /etc/systemd/system/authencore.service

# Add Environment variables:
Environment="DATABASE_URL=postgresql://..."
Environment="OPENAI_API_KEY=sk-..."
```

### Docker Compose Environment
```yaml
# docker-compose.yml
services:
  authencore:
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - RESEND_API_KEY=${RESEND_API_KEY}
```

## Security Best Practices

### Environment Variable Security
1. **Never commit `.env` files to version control**
2. **Use strong, unique passwords and keys**
3. **Rotate API keys regularly**
4. **Limit API key permissions to minimum required**
5. **Use environment-specific configurations**

### API Key Management
```bash
# Generate secure random keys
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 16  # For ENCRYPTION_KEY
```

### Database Security
```sql
-- Create dedicated database user
CREATE USER authencore_user WITH PASSWORD 'secure-password';
GRANT CONNECT ON DATABASE authencore_analytics TO authencore_user;
GRANT USAGE ON SCHEMA public TO authencore_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authencore_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authencore_user;
```

## Validation & Testing

### Environment Validation Script
```bash
#!/bin/bash
# validate-env.sh

required_vars=(
  "DATABASE_URL"
  "OPENAI_API_KEY"
  "ANTHROPIC_API_KEY"
  "RESEND_API_KEY"
)

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "ERROR: $var is not set"
    exit 1
  fi
done

echo "All required environment variables are set"
```

### Connection Testing
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Test OpenAI API
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test Anthropic API
curl -H "x-api-key: $ANTHROPIC_API_KEY" \
  https://api.anthropic.com/v1/messages

# Test Resend API
curl -H "Authorization: Bearer $RESEND_API_KEY" \
  https://api.resend.com/domains
```

## Environment-Specific Configurations

### Development Environment
```bash
APP_ENV="development"
LOG_LEVEL="debug"
CORS_ORIGIN="http://localhost:3000"
SESSION_SECURE=false
```

### Staging Environment
```bash
APP_ENV="staging"
LOG_LEVEL="info"
CORS_ORIGIN="https://staging.yourdomain.com"
SESSION_SECURE=true
```

### Production Environment
```bash
APP_ENV="production"
LOG_LEVEL="warn"
CORS_ORIGIN="https://yourdomain.com"
SESSION_SECURE=true
```

## Backup & Recovery

### Environment Backup
```bash
# Backup environment configuration
cp .env .env.backup.$(date +%Y%m%d)

# Secure storage of API keys
gpg --symmetric --cipher-algo AES256 .env.backup.$(date +%Y%m%d)
```

### Recovery Procedures
1. **API Key Rotation**: Update all services when rotating keys
2. **Database Migration**: Update connection strings during migrations
3. **Service Recovery**: Restart services after environment changes

---

**Important**: Always test environment configuration in a staging environment before deploying to production.