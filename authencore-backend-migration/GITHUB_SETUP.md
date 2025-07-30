# GitHub Repository Setup Guide

This guide walks you through setting up the AuthenCore Backend Migration repository on GitHub.

## 🚀 Quick Setup

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `authencore-backend-migration`
   - **Description**: `Complete deployment package for AuthenCore Analytics platform`
   - **Visibility**: Private (recommended for production deployment)
   - **Initialize**: Leave unchecked (we already have files)

### 2. Clone This Directory

```bash
# Navigate to where you want the repository
cd /path/to/your/projects

# Clone or copy the authencore-backend-migration directory
# If you're working from the original project:
cp -r authencore-backend-migration /path/to/new/location/
cd /path/to/new/location/authencore-backend-migration
```

### 3. Initialize Git and Push

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
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

# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/authencore-backend-migration.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔧 Advanced Setup

### Setting Up GitHub Actions Secrets

For CI/CD pipeline to work, you need to set up the following secrets:

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Secrets and variables" > "Actions"
4. Click "New repository secret" for each of the following:

#### Required Secrets
- `OPENAI_API_KEY` - Your OpenAI API key
- `RESEND_API_KEY` - Your Resend email API key
- `DATABASE_URL` - Your production database connection string
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

#### Optional Secrets (for enhanced features)
- `ANTHROPIC_API_KEY` - For enhanced AI capabilities
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_WEBHOOK_SECRET` - For payment webhooks
- `SENTRY_DSN` - For error monitoring

### Setting Up Branch Protection

1. Go to "Settings" > "Branches"
2. Click "Add rule"
3. Configure protection for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require up-to-date branches before merging
   - ✅ Include administrators

### Setting Up Deployments

1. Go to "Settings" > "Environments"
2. Create environments:
   - `staging` - For staging deployments
   - `production` - For production deployments
3. Configure environment protection rules
4. Add environment-specific secrets

## 📦 Repository Structure

Your GitHub repository will contain:

```
authencore-backend-migration/
├── 📋 Documentation
│   ├── README.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── ENVIRONMENT_SETUP.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── GITHUB_SETUP.md (this file)
│
├── 🐳 Docker Configuration
│   ├── docker/
│   │   ├── Dockerfile.dev
│   │   ├── Dockerfile.prod
│   │   ├── docker-compose.yml
│   │   └── nginx.prod.conf
│
├── 🗄️ Database & Backend
│   ├── database/           # PostgreSQL migrations
│   ├── supabase/          # Edge Functions
│   └── config/            # Configuration templates
│
├── 🔧 Deployment Tools
│   ├── scripts/           # Deployment scripts
│   └── .github/workflows/ # CI/CD pipelines
│
└── 📚 Additional Documentation
    └── docs/              # API docs, troubleshooting, etc.
```

## 🔄 Development Workflow

### Recommended Git Workflow

1. **Main Branch**: Production-ready code only
2. **Develop Branch**: Integration branch for features
3. **Feature Branches**: Individual features (`feature/assessment-api`)
4. **Hotfix Branches**: Critical production fixes (`hotfix/security-patch`)

```bash
# Create and switch to develop branch
git checkout -b develop

# Create feature branch
git checkout -b feature/new-assessment-type

# Work on feature, commit changes
git add .
git commit -m "Add new assessment type processing"

# Push feature branch
git push origin feature/new-assessment-type

# Create pull request on GitHub
# After review and approval, merge to develop
# When ready for production, merge develop to main
```

### CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **On Pull Request**:
   - Runs tests and security scans
   - Validates environment configuration
   - Builds Docker images

2. **On Push to `main`**:
   - Builds and pushes production images
   - Deploys to staging environment
   - Runs integration tests

3. **On Push to `production` branch**:
   - Deploys to production environment
   - Runs smoke tests
   - Sends deployment notifications

## 🔒 Security Considerations

### Repository Security

1. **Never commit secrets** - Use GitHub Secrets for sensitive data
2. **Use `.gitignore`** - Exclude sensitive files (.env, ssl/, etc.)
3. **Enable security alerts** - Turn on Dependabot alerts
4. **Regular updates** - Keep dependencies updated

### Access Control

1. **Team access** - Give appropriate permissions to team members
2. **Deploy keys** - Use read-only deploy keys for server access
3. **Token permissions** - Use minimal permissions for GitHub tokens

## 📞 Support

### Getting Help

1. **Documentation**: Check the docs/ directory for detailed guides
2. **Issues**: Create GitHub issues for bugs or feature requests
3. **Discussions**: Use GitHub Discussions for questions
4. **Support**: Contact tech@authencore.org for urgent issues

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## ✅ Setup Checklist

- [ ] GitHub repository created
- [ ] Local repository initialized and pushed
- [ ] GitHub Actions secrets configured
- [ ] Branch protection rules enabled
- [ ] Environment configuration reviewed
- [ ] Team access permissions set
- [ ] Documentation reviewed
- [ ] Ready for deployment!

**Once setup is complete, you can share the repository URL with your hosting company for deployment.**