# AuthenCore Analytics Backend Deployment Guide

## Overview
This package contains the complete backend infrastructure for AuthenCore Analytics, a professional psychometric assessment platform. The backend includes Edge Functions, PostgreSQL database schema, and all necessary configuration files.

## Package Contents
```
authencore-backend-deployment/
├── DEPLOYMENT_GUIDE.md          # This file
├── ENVIRONMENT_SETUP.md         # Environment variables guide
├── supabase/                    # Edge Functions and config
├── database/                    # SQL schema and functions
├── docker/                      # Docker deployment files
└── config/                      # Configuration templates
```

## Server Requirements

### Minimum Hardware
- **CPU**: 4 cores
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 100GB SSD
- **Network**: 1Gbps connection

### Software Requirements
- **Operating System**: Ubuntu 20.04+ or equivalent
- **Database**: PostgreSQL 14+ with extensions
- **Runtime**: Node.js 18+ or Deno 1.37+
- **Web Server**: Nginx (recommended)
- **SSL**: Valid SSL certificate
- **File Storage**: S3-compatible storage

### Required PostgreSQL Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_net";
```

## Deployment Steps

### Phase 1: Database Setup

1. **Create PostgreSQL Database**
   ```bash
   createdb authencore_analytics
   ```

2. **Run SQL Files in Order**
   ```bash
   psql -d authencore_analytics -f database/001_initial_schema.sql
   psql -d authencore_analytics -f database/002_database_functions.sql
   psql -d authencore_analytics -f database/003_rls_policies.sql
   psql -d authencore_analytics -f database/004_additional_tables.sql
   psql -d authencore_analytics -f database/005_advanced_functions.sql
   psql -d authencore_analytics -f config/storage-buckets.sql
   ```

3. **Verify Database Setup**
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';
   ```

### Phase 2: Environment Configuration

1. **Copy Environment Template**
   ```bash
   cp config/environment.template .env
   ```

2. **Configure Environment Variables** (see ENVIRONMENT_SETUP.md)

3. **Set Database Connection**
   ```bash
   export DATABASE_URL="postgresql://username:password@localhost:5432/authencore_analytics"
   ```

### Phase 3: Edge Functions Deployment

Choose one deployment method:

#### Option A: Docker Deployment (Recommended)
```bash
# Build and run with Docker Compose
docker-compose -f docker/docker-compose.yml up -d

# Verify deployment
docker-compose ps
```

#### Option B: Native Deployment
```bash
# Install Deno
curl -fsSL https://deno.land/x/install/install.sh | sh

# Deploy each function
for func in supabase/functions/*/; do
  deno run --allow-all "${func}index.ts" &
done
```

### Phase 4: Web Server Configuration

1. **Configure Nginx**
   ```bash
   cp docker/nginx.prod.conf /etc/nginx/sites-available/authencore
   ln -s /etc/nginx/sites-available/authencore /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   ```

2. **Setup SSL Certificate**
   ```bash
   certbot --nginx -d yourdomain.com
   ```

### Phase 5: File Storage Setup

1. **Create Storage Buckets**
   - `reports` - Assessment reports (5GB limit)
   - `marketing-materials` - Marketing assets (2GB limit)
   - `assessment-logos` - Logo files (500MB limit)

2. **Configure Storage Policies** (run storage-buckets.sql)

### Phase 6: Verification & Testing

1. **Health Check Endpoints**
   ```bash
   curl https://yourdomain.com/health
   curl https://yourdomain.com/functions/v1/ai-chatbot
   ```

2. **Database Connection Test**
   ```sql
   SELECT public.get_security_status();
   ```

3. **Function Tests**
   ```bash
   # Test assessment processing
   curl -X POST https://yourdomain.com/functions/v1/process-assessment \
     -H "Content-Type: application/json" \
     -d '{"assessmentType":"test","responses":[]}'
   ```

## Security Checklist

- [ ] SSL certificate installed and configured
- [ ] Database user has minimal required permissions
- [ ] Environment variables are secured
- [ ] Rate limiting is configured
- [ ] Backup strategy is implemented
- [ ] Monitoring is set up
- [ ] Security headers are configured
- [ ] API keys are properly secured

## Monitoring & Maintenance

### Log Locations
- Application logs: `/var/log/authencore/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`

### Backup Strategy
1. **Database Backups** (Daily)
   ```bash
   pg_dump authencore_analytics > backup_$(date +%Y%m%d).sql
   ```

2. **File Storage Backups** (Weekly)
3. **Configuration Backups** (After changes)

### Performance Monitoring
- Database performance monitoring
- Function execution times
- Storage usage tracking
- Error rate monitoring

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check PostgreSQL service status
   - Verify connection string
   - Check firewall settings

2. **Function Deployment Issues**
   - Verify Deno installation
   - Check environment variables
   - Review function logs

3. **Storage Issues**
   - Check bucket permissions
   - Verify storage quotas
   - Review access policies

### Support Contacts
- **Technical Issues**: Your hosting provider support
- **Application Issues**: AuthenCore Analytics team
- **Database Issues**: PostgreSQL community/support

## Migration Notes

### From Supabase to Self-Hosted
If migrating from Supabase:
1. Export existing data using provided migration scripts
2. Update environment variables
3. Test all functions thoroughly
4. Update DNS records
5. Monitor for 48 hours post-migration

### Scaling Considerations
- Database read replicas for high traffic
- Load balancer for Edge Functions
- CDN for static assets
- Horizontal scaling for compute

## Compliance & Legal

### Data Protection
- GDPR compliance measures implemented
- Data encryption at rest and in transit
- Audit logging enabled
- User consent management

### Professional Standards
- Psychometric assessment standards
- Bias monitoring and reporting
- Professional ethics compliance
- Industry certification requirements

---

**Deployment Support**: If you encounter issues during deployment, please contact your hosting provider with this documentation and the specific error messages.