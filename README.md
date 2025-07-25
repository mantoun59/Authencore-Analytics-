# AuthenCore Assessment Platform

A comprehensive psychometric assessment platform built with React, TypeScript, and Supabase. Designed for professional use by employers, partners, and individuals seeking career guidance and personality insights.

## 🚀 Features

### Core Assessments
- **Career Launch Assessment** - Career guidance and path recommendations
- **Communication Styles** - Professional communication assessment
- **Cultural Intelligence (CAIR)** - Cross-cultural competency evaluation
- **Emotional Intelligence** - EQ assessment and development
- **Leadership Assessment** - Leadership style and capability evaluation
- **Digital Wellness** - Technology usage and digital health assessment
- **Faith & Values** - Personal values alignment assessment
- **Stress Resilience** - Stress management and resilience evaluation
- **Gen Z Workplace** - Generational workplace preferences
- **Burnout Prevention** - Early warning system for workplace burnout

### Platform Features
- **Multi-language Support** - English, Spanish, French
- **AI-Powered Reports** - Comprehensive assessment reports with AI insights
- **Partner Management** - White-label partner dashboard and access control
- **Employer Dashboard** - Candidate management and bulk testing
- **Admin Analytics** - Comprehensive analytics and reporting
- **Security Features** - MFA, session management, audit trails
- **PDF Report Generation** - Professional downloadable reports
- **Real-time Chat** - AI assistant for guidance

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: React Context, React Query
- **Charts**: Recharts, Chart.js
- **Internationalization**: i18next
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js 18+ or Bun
- Supabase account and project
- Domain (for email functionality)
- Resend API key (for email notifications)

## 🚀 Getting Started

### Quick Start
1. Clone the repository
2. Install dependencies: `npm install` or `bun install`
3. Configure Supabase project and secrets
4. Run development server: `npm run dev`
5. Access at `http://localhost:5173`

### Prerequisites

Before you begin, ensure you have the following:
- **Node.js 18+** or **Bun** - JavaScript runtime
- **Git** - Version control system
- **Supabase Account** - Backend services provider
- **Code Editor** - VS Code recommended with TypeScript extensions

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd authencore-assessment-platform

# Install dependencies (choose one)
npm install
# OR for faster installation
bun install
```

### Step 2: Environment Configuration

> **Important:** This project does NOT use `.env` files. All configuration is handled through Supabase integration and secrets.

#### Client Configuration (Auto-configured)
The client configuration is automatically set in `src/integrations/supabase/client.ts`:
```typescript
// These values are hardcoded in the client
const SUPABASE_URL = "https://jlbftyjewxgetxcihban.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Required Supabase Secrets

Configure these secrets in your Supabase dashboard at **Settings** > **Edge Functions** > **Secrets**:

| Secret Name | Required | Description | Where to Get |
|-------------|----------|-------------|--------------|
| `OPENAI_API_KEY` | ✅ | AI report generation | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `SUPABASE_URL` | ✅ | Project URL | Auto-configured |
| `SUPABASE_ANON_KEY` | ✅ | Public client key | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server operations | Supabase Dashboard > Settings > API |
| `SUPABASE_DB_URL` | ✅ | Database connection | Supabase Dashboard > Settings > Database |

#### Setting Up Secrets
1. Navigate to your Supabase project dashboard
2. Go to **Settings** > **Edge Functions** > **Secrets**
3. Click **Add Secret** for each required secret
4. Secrets are automatically available to Edge Functions

### Step 3: Supabase Project Setup

#### 3.1 Authentication Configuration
Navigate to **Authentication** > **Settings** in your Supabase dashboard:

1. **Site URL**: Set to `http://localhost:5173` (development)
2. **Redirect URLs**: Add production URLs when deploying
3. **Email Confirmations**: Enable for security (recommended)
4. **Email Templates**: Customize as needed
5. **Auth Providers**: Enable additional providers (Google, GitHub, etc.)

#### 3.2 Database Schema Overview

The platform uses a comprehensive database schema with proper Row Level Security:

**Core Authentication & Users:**
```sql
-- User management
profiles              -- Extended user information
user_roles           -- Role-based access control (admin, user)
user_sessions        -- Session management with expiration
user_mfa            -- Multi-factor authentication settings
security_events      -- Security audit trail
```

**Assessment System:**
```sql
-- Assessment data
assessment_results           -- Core assessment completion data
generated_reports           -- AI-generated assessment reports
genz_assessment_results     -- Gen Z workplace assessment
genz_assessment_responses   -- Individual response tracking
genz_assessment_scenarios   -- Assessment scenario data
genz_collaboration_responses -- Collaboration scenarios
genz_values_responses       -- Values ranking responses
```

**Business Management:**
```sql
-- Individual users
solo_candidates      -- Self-assessment participants

-- Employer system
employer_accounts    -- Employer organization accounts
employer_candidates  -- Employer-sponsored assessments

-- Partner system
partner_accounts           -- Partner organization management
partner_access_permissions -- Granular access control
partner_access_logs       -- Activity logging and auditing
```

**System & Analytics:**
```sql
analytics_events     -- Platform usage tracking
api_rate_limits     -- Rate limiting enforcement
payments           -- Payment processing records
```

### Step 4: Database Migrations

The project includes 17 carefully ordered database migrations that create the complete schema with security policies.

#### Automatic Migration (Recommended)
When using Lovable with Supabase integration, migrations are automatically applied. No manual intervention required.

#### Manual Migration (If Needed)
If you need to run migrations manually, execute them in the Supabase SQL Editor in this exact order:

```sql
-- 1. Core setup and user profiles
supabase/migrations/20250716053331-7c27f452-1163-41b9-ad81-2591ead9e66a.sql

-- 2. Security fixes and RLS improvements
supabase/migrations/20250716055923-75af7589-9ec4-4cbf-b1d5-c4c2ed7304d7.sql

-- 3. Assessment system foundation
supabase/migrations/20250716134955-0ac27dc7-d6cc-49a1-b1b5-470a3dad7701.sql
supabase/migrations/20250716154257-0270df65-64e9-4cf9-86e4-c058983057f4.sql

-- 4. Role-based access control system
supabase/migrations/20250716163529-174aba09-a438-4ae7-9186-a22f19d52d6f.sql
supabase/migrations/20250716163559-dda489ea-8dd4-4867-bf4d-748f5f7b4fff.sql
supabase/migrations/20250716165013-1bcfd18b-98c0-4da2-b636-efb2d5ca554a.sql

-- 5. Business features and Gen Z assessment
supabase/migrations/20250717051748-a9b31ce6-d470-4e6e-a4dc-d77d4ee1e9b8.sql
supabase/migrations/20250719050543-07508d9e-7ef5-46d7-8550-5dbe12cf4c0a.sql
supabase/migrations/20250719141423-6b10ce80-580e-404c-81f4-c3b5871a9cac.sql

-- 6. Advanced features and security
supabase/migrations/20250720124225-6bc1606c-959d-4732-9b9a-8eb37897bdbf.sql
supabase/migrations/20250720125445-f5719918-c38a-4a9d-a962-2a718518bdd2.sql
supabase/migrations/20250720125730-f145b3e5-5778-4a75-bfc8-d2854f79d57d.sql

-- 7. Final security and system optimizations
supabase/migrations/20250721084127-302550e6-52da-44ad-b018-4e8654f30dd7.sql
supabase/migrations/20250721095042-58a3148c-61d5-486f-9f58-45dedd2b3f2f.sql
supabase/migrations/20250721095424-54738fdc-803f-493d-aa8a-ecbd822f4b6f.sql
supabase/migrations/20250721100012-bdaf4fff-9187-47ce-b8c6-715b23a669af.sql
```

#### Migration Features

**Security Implementation:**
- ✅ Row Level Security (RLS) on all tables
- ✅ Secure database functions with `SECURITY DEFINER`
- ✅ Proper `search_path` configuration
- ✅ Automatic user profile creation triggers
- ✅ Session management with timeout
- ✅ Audit trail for security events

**Business Logic:**
- ✅ Multi-tenant partner system with access controls
- ✅ Employer dashboard with candidate management
- ✅ Assessment result storage and AI report generation
- ✅ Payment processing integration
- ✅ Comprehensive analytics system

**Database Functions:**
The migrations create several key functions:
```sql
-- Authentication
authenticate_employer(email, password)
authenticate_partner(username, password)

-- Security
log_security_event(user_id, event_type, details)
detect_suspicious_activity(user_id, ip, user_agent, action)
check_rate_limit(identifier, endpoint, limit, window)

-- Access Control
check_partner_assessment_access(partner_id, assessment_type)
assign_admin_role(email)
is_admin(user_id)
has_role(user_id, role)

-- Logging
log_analytics_event(event_type, entity_type, entity_id, metadata)
log_partner_activity(partner_id, action, assessment_type)
```

### Step 5: Edge Functions

The platform includes 6 powerful Edge Functions that are automatically deployed:

| Function | Purpose | Secrets Required |
|----------|---------|------------------|
| `ai-chatbot` | AI assistant for user guidance | `OPENAI_API_KEY` |
| `enhanced-ai-analysis` | Advanced assessment analysis | `OPENAI_API_KEY` |
| `generate-ai-report` | AI-powered report generation | `OPENAI_API_KEY` |
| `generate-pdf-report` | PDF report creation | `SUPABASE_SERVICE_ROLE_KEY` |
| `security-middleware` | Security validation & monitoring | `SUPABASE_SERVICE_ROLE_KEY` |
| `send-partner-credentials` | Partner onboarding emails | `SUPABASE_SERVICE_ROLE_KEY` |

### Step 6: Initial Admin Setup

After migrations are complete, set up your first admin user:

```sql
-- Replace with your admin email address
SELECT public.assign_admin_role('your-email@authencore.org');
```

This grants full platform access including:
- User management
- Partner management  
- Analytics dashboard
- System configuration
- Security monitoring

### Step 7: Development Server

Start the development environment:

```bash
# Start development server
npm run dev
# OR
bun dev

# Available scripts
npm run build          # Production build
npm run preview         # Preview production build
npm run lint           # ESLint checking
npm run lint:fix       # Auto-fix linting issues
npm run test           # Unit tests (Vitest)
npm run test:coverage  # Test coverage report
npm run cypress:open   # Interactive E2E tests
npm run cypress:run    # Headless E2E tests
```

**Access Points:**
- 🌐 **Local**: http://localhost:5173
- 📱 **Network**: http://[your-ip]:5173 (mobile testing)
- 🔧 **Vite Dev Tools**: Available in browser console

### Step 8: Verification Checklist

Complete these verification steps to ensure proper setup:

#### ✅ Database Verification
- [ ] All 17 migrations applied successfully
- [ ] Tables created with proper RLS policies
- [ ] Database functions working correctly
- [ ] Admin user role assigned

#### ✅ Authentication Testing
- [ ] User registration working
- [ ] Email confirmation (if enabled)
- [ ] Login/logout functionality
- [ ] Session management
- [ ] Admin dashboard accessible

#### ✅ Assessment Flow
- [ ] Complete a sample assessment end-to-end
- [ ] AI report generation working
- [ ] PDF export functionality
- [ ] Result storage in database

#### ✅ Edge Functions
- [ ] Check Edge Function logs in Supabase dashboard
- [ ] Test AI chatbot functionality
- [ ] Verify report generation
- [ ] Confirm email sending (if configured)

### Troubleshooting Common Issues

#### 🔴 Database Connection Errors
```bash
# Check Supabase project status
# Verify project ID: jlbftyjewxgetxcihban
# Ensure all migrations completed successfully
# Check RLS policies are active
```

#### 🔴 Authentication Problems
```bash
# Verify Site URL configuration
# Check email confirmation settings
# Confirm auth providers are enabled
# Review redirect URL configuration
```

#### 🔴 Edge Function Failures
```bash
# Verify all required secrets are set
# Check Edge Function logs in Supabase dashboard
# Confirm OpenAI API key has sufficient credits
# Review function deployment status
```

#### 🔴 Build/Development Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+

# Clear browser cache and storage
# Check for TypeScript errors
npm run build
```

#### 🔴 Performance Issues
```bash
# Enable production optimizations
npm run build
npm run preview

# Check network requests in browser dev tools
# Monitor Supabase dashboard for slow queries
# Review Edge Function execution times
```

## 🔧 Configuration

### Admin Access
To set up admin access:
1. Create a user account through the normal signup process
2. Add the user's email to the `admin_users` table in Supabase
3. The user will have admin privileges on next login

### Partner Configuration
Partners can be configured through the admin dashboard:
1. Login as admin
2. Navigate to Partner Management
3. Create partner accounts with custom branding
4. Configure access permissions and candidate limits

### Email Configuration
For email functionality:
1. Configure your domain settings
2. Add Resend API key to Supabase Edge Function secrets
3. Update email templates in edge functions

## 📊 Assessment Types & Scoring

### 🚀 Career Launch Assessment
- **Questions**: 45 comprehensive career-focused questions
- **Duration**: 15-20 minutes
- **Dimensions**: Career interests, work values, personality traits, skills assessment
- **Scoring Algorithm**: Multi-dimensional career matching with RIASEC model integration
- **Report Features**: 
  - Personalized career path recommendations
  - Industry fit analysis
  - Skill development roadmap
  - Educational pathway suggestions
  - Action steps for career advancement

### 💬 Communication Styles Assessment
- **Questions**: 30 scenario-based workplace communication questions
- **Duration**: 10-15 minutes
- **Dimensions**: Direct/Indirect, Formal/Informal, Expressive/Reserved, Task/Relationship focused
- **Scoring Algorithm**: Four-quadrant communication matrix with percentage breakdown
- **Report Features**:
  - Primary and secondary communication styles
  - Team dynamics insights
  - Conflict resolution strategies
  - Leadership communication recommendations
  - Cross-cultural communication tips

### 🌍 Cultural Intelligence (CAIR) Assessment
- **Questions**: 40 cultural scenario and behavioral questions
- **Duration**: 15-20 minutes
- **Dimensions**: Cultural Drive, Cultural Knowledge, Cultural Strategy, Cultural Action
- **Scoring Algorithm**: Four-factor CQ model with cultural adaptability metrics
- **Report Features**:
  - CQ competency breakdown by dimension
  - Cultural bridge-building strategies
  - Global leadership potential assessment
  - Diversity and inclusion recommendations
  - Cultural sensitivity development plan

### 🧠 Emotional Intelligence Assessment
- **Questions**: 35 emotional scenario questions
- **Duration**: 12-18 minutes
- **Dimensions**: Self-awareness, Self-regulation, Motivation, Empathy, Social skills
- **Scoring Algorithm**: Five-factor EQ model with emotional competency mapping
- **Report Features**:
  - EQ strength and development areas
  - Emotional leadership capacity
  - Relationship management insights
  - Stress management strategies
  - Team emotional climate impact

### 👑 Leadership Assessment
- **Questions**: 40 leadership scenario questions
- **Duration**: 15-20 minutes
- **Dimensions**: Visionary, Coaching, Affiliative, Democratic, Pacesetting, Commanding
- **Scoring Algorithm**: Six leadership styles assessment with situational effectiveness
- **Report Features**:
  - Leadership style profile
  - Situational leadership recommendations
  - Team management strategies
  - Executive presence development
  - Leadership growth pathway

### 💻 Digital Wellness Assessment
- **Questions**: 25 technology usage and habit questions
- **Duration**: 8-12 minutes
- **Dimensions**: Usage patterns, Digital boundaries, Tech-life balance, Productivity impact
- **Scoring Algorithm**: Digital wellness score with usage pattern analysis
- **Report Features**:
  - Digital wellness score and interpretation
  - Technology usage patterns
  - Digital detox recommendations
  - Productivity optimization tips
  - Healthy tech habit formation

### 🙏 Faith & Values Assessment
- **Questions**: 90 values-based ranking and scenario questions
- **Duration**: 20-25 minutes
- **Dimensions**: Spiritual values, Personal ethics, Work-life integration, Community involvement
- **Scoring Algorithm**: Values hierarchy with faith-work alignment analysis
- **Report Features**:
  - Personal values ranking
  - Faith-work integration assessment
  - Ethical decision-making framework
  - Purpose-driven career recommendations
  - Community engagement suggestions

### 💪 Stress Resilience Assessment
- **Questions**: 30 stress response and coping questions
- **Duration**: 10-15 minutes
- **Dimensions**: Stress tolerance, Coping strategies, Recovery patterns, Support systems
- **Scoring Algorithm**: Resilience quotient with stress vulnerability analysis
- **Report Features**:
  - Stress resilience profile
  - Vulnerability and strength areas
  - Coping strategy effectiveness
  - Stress management toolkit
  - Wellness and recovery plan

### 🎯 Gen Z Workplace Assessment
- **Questions**: 35 workplace preference and scenario questions
- **Duration**: 12-18 minutes
- **Dimensions**: Work preferences, Communication styles, Career expectations, Technology integration
- **Scoring Algorithm**: Generational workplace fit with preference mapping
- **Report Features**:
  - Workplace preference profile
  - Generational communication insights
  - Career expectation alignment
  - Technology integration preferences
  - Multi-generational team strategies

### 🔥 Burnout Prevention Assessment
- **Questions**: 28 burnout risk and prevention questions
- **Duration**: 10-12 minutes
- **Dimensions**: Emotional exhaustion, Depersonalization, Personal accomplishment, Work engagement
- **Scoring Algorithm**: Burnout risk assessment with early warning indicators
- **Report Features**:
  - Burnout risk level assessment
  - Early warning signs identification
  - Prevention strategy recommendations
  - Work-life balance optimization
  - Recovery and renewal planning

## 👑 Administrator Guidance & Management

### 🔐 Main Platform Administrator

**Role**: Super Admin with full system access and control
**Access**: All platform features, analytics, user management, system configuration

#### Step-by-Step Setup Guide

**Initial Admin Setup:**
1. **Create Admin Account**
   ```sql
   -- After creating your user account normally, assign admin role
   SELECT public.assign_admin_role('your-email@authencore.org');
   ```

2. **Access Admin Dashboard**
   - Navigate to `/admin` after login
   - Verify access to all admin sections
   - Review system status and health metrics

3. **Configure System Settings**
   - Set up organizational details
   - Configure email templates and notifications
   - Establish security policies and MFA requirements
   - Review and adjust assessment pricing

#### Daily Administrative Tasks

**User Management:**
- Monitor new user registrations
- Handle account verification issues
- Process account deactivation requests
- Review security events and suspicious activity

**System Monitoring:**
- Check Edge Function performance and logs
- Monitor database performance metrics
- Review error reports and system alerts
- Validate backup integrity and security

**Analytics Review:**
- Analyze platform usage trends
- Review assessment completion rates
- Monitor revenue and payment processing
- Generate executive summary reports

#### Advanced Administration Functions

**Security Management:**
```sql
-- Monitor security events
SELECT * FROM public.security_events 
WHERE created_at > now() - interval '24 hours'
ORDER BY created_at DESC;

-- Check suspicious activity
SELECT user_id, COUNT(*) as event_count, 
       MAX(created_at) as last_event
FROM public.security_events 
WHERE created_at > now() - interval '1 hour'
GROUP BY user_id 
HAVING COUNT(*) > 10;
```

**System Health Checks:**
- Database connection integrity
- Edge Function execution status
- Storage bucket access verification
- Email service connectivity

### 🏢 Employer Account Administration

**Role**: Business account managers with candidate oversight
**Access**: Candidate management, assessment results, team analytics

#### Employer Onboarding Process

**Step 1: Account Creation**
1. **Admin Creates Employer Account**
   - Access Admin Dashboard → Employer Management
   - Click "Add New Employer"
   - Complete organization details:
     - Company name and industry
     - Contact information
     - Billing preferences
     - Assessment package selection

2. **Configure Employer Settings**
   ```sql
   -- Create employer account with proper settings
   INSERT INTO public.employer_accounts (
     name, email, contact_person, industry, 
     candidate_limit, active_until, is_active
   ) VALUES (
     'Company Name', 'contact@company.com', 'John Doe',
     'Technology', 50, now() + interval '1 year', true
   );
   ```

3. **Provide Employer Credentials**
   - Generate secure temporary password
   - Send welcome email with login instructions
   - Schedule onboarding call if needed

#### Employer Dashboard Functions

**Candidate Management:**
- Add individual candidates or bulk upload
- Send assessment invitations with custom messages
- Track assessment completion status
- Download individual and group reports

**Assessment Tools:**
- Configure which assessments are available
- Set assessment expiration dates
- Create custom assessment packages
- Monitor candidate progress in real-time

**Reporting & Analytics:**
- Team composition analysis
- Hiring decision support metrics
- Assessment result comparisons
- Export capabilities for HR systems

#### Employer Support & Maintenance

**Regular Maintenance:**
- Review candidate limits and usage
- Update organization information
- Process billing and subscription changes
- Provide technical support for assessment issues

**Troubleshooting Common Issues:**
- Candidate invitation email delivery
- Assessment link expiration problems
- Report generation delays
- User access and permission issues

### 🤝 Partner Account Administration

**Role**: White-label platform resellers with customization rights
**Access**: Branded interface, candidate management, revenue sharing

#### Partner Onboarding Workflow

**Step 1: Partner Account Setup**
1. **Create Partner Profile**
   - Navigate to Admin → Partner Management
   - Complete partner application review
   - Set up organization details and branding
   - Configure revenue sharing percentages

2. **Technical Configuration**
   ```sql
   -- Create partner account with access permissions
   INSERT INTO public.partner_accounts (
     username, organization_name, contact_email,
     candidate_limit, access_expires_at, is_active
   ) VALUES (
     'partner_org', 'Partner Organization', 'admin@partner.com',
     200, now() + interval '2 years', true
   );
   
   -- Configure assessment access permissions
   INSERT INTO public.partner_access_permissions (
     partner_id, assessment_type, can_access, candidate_limit
   ) VALUES 
     ((SELECT id FROM partner_accounts WHERE username = 'partner_org'), 
      'career-launch', true, 50),
     ((SELECT id FROM partner_accounts WHERE username = 'partner_org'), 
      'communication-styles', true, 30);
   ```

3. **Branding Customization**
   - Upload partner logo and brand assets
   - Configure color scheme and styling
   - Set up custom domain (if applicable)
   - Create branded email templates

#### Partner Management Functions

**Access Control:**
- Define which assessments partners can offer
- Set candidate limits per assessment type
- Configure pricing and revenue sharing
- Monitor partner activity and usage

**Performance Monitoring:**
```sql
-- Track partner activity and usage
SELECT p.organization_name, 
       COUNT(pal.id) as total_activities,
       COUNT(DISTINCT pal.assessment_type) as unique_assessments
FROM public.partner_accounts p
LEFT JOIN public.partner_access_logs pal ON p.id = pal.partner_id
WHERE pal.created_at > now() - interval '30 days'
GROUP BY p.id, p.organization_name;
```

**Revenue & Analytics:**
- Commission tracking and payments
- Partner performance metrics
- Candidate conversion rates
- Usage pattern analysis

#### Partner Support Services

**Technical Support:**
- API integration assistance
- Custom integration development
- Branding implementation support
- Assessment customization guidance

**Business Support:**
- Sales training and materials
- Marketing collateral development
- Pricing strategy consultation
- Performance optimization recommendations

### 🔧 Special Administrative Tools

#### Marketing Materials Management
**Access**: `/marketing-materials`
- Upload and organize promotional PDFs
- Version control for marketing collateral
- Download tracking and analytics
- Brand compliance verification

#### Bulk Operations Tools

**User Management Scripts:**
```sql
-- Bulk user role assignment
-- (Use with extreme caution - requires admin privileges)

-- Assign multiple admin roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email IN ('admin1@company.com', 'admin2@company.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Bulk deactivate accounts
UPDATE public.employer_accounts 
SET is_active = false 
WHERE last_login < now() - interval '6 months';
```

**Assessment Data Migration:**
```sql
-- Export assessment results for backup
SELECT ar.*, gr.report_content, gr.created_at as report_date
FROM public.assessment_results ar
LEFT JOIN public.generated_reports gr ON ar.id = gr.assessment_id
WHERE ar.created_at > '2024-01-01';
```

#### Security Audit Tools

**Regular Security Checks:**
- Review RLS policy effectiveness
- Monitor failed authentication attempts
- Audit administrative access logs
- Validate data encryption compliance

**Compliance Reporting:**
- GDPR data processing reports
- Security incident documentation
- User consent and data retention audits
- Third-party integration security reviews

### 🚨 Emergency Procedures

#### System Outage Response
1. **Immediate Assessment**
   - Check Supabase service status
   - Verify Edge Function availability
   - Test database connectivity
   - Confirm authentication services

2. **Communication Protocol**
   - Notify key stakeholders
   - Update system status page
   - Communicate with active users
   - Document incident timeline

3. **Recovery Procedures**
   - Activate backup systems if needed
   - Coordinate with Supabase support
   - Monitor recovery progress
   - Validate full service restoration

#### Data Breach Response
1. **Immediate Actions**
   - Isolate affected systems
   - Preserve evidence and logs
   - Assess scope of breach
   - Notify security team

2. **Investigation Process**
   - Review security event logs
   - Identify breach vector
   - Assess data exposure
   - Document findings

3. **Recovery & Communication**
   - Implement security fixes
   - Reset affected credentials
   - Notify users and authorities
   - Update security procedures

## 🏢 User Roles & Permissions Summary

### Individual Users
- Take assessments independently
- Access personal results and reports  
- Download PDF reports
- Track assessment history

### Employers
- Create employer accounts
- Invite candidates for assessments
- Bulk candidate management
- Access aggregated results
- Export candidate data

### Partners
- White-label platform access
- Custom branding options
- Candidate management within limits
- Revenue sharing configuration

### Administrators
- Full platform access
- User and partner management
- Analytics and reporting
- System configuration
- Security monitoring

## 🔒 Security Features

### Authentication & Authorization
- Supabase Auth integration
- Multi-factor authentication (MFA)
- Session management with timeout
- Role-based access control (RBAC)

### Data Protection
- Row Level Security (RLS) on all tables
- Encrypted data storage
- Audit trail logging
- GDPR compliance features

### Security Monitoring
- Login attempt tracking
- Suspicious activity detection
- Admin security dashboard
- Real-time security alerts

## 📈 Analytics & Reporting

### Admin Analytics
- User engagement metrics
- Assessment completion rates
- Revenue tracking
- Geographic distribution
- Performance indicators

### Employer Insights
- Candidate assessment results
- Team composition analysis
- Hiring decision support
- Progress tracking

### Partner Metrics
- Usage statistics
- Candidate volumes
- Revenue reports
- Performance benchmarks

## 🚀 Deployment

### Supabase Edge Functions
Edge functions are automatically deployed. Key functions include:
- `ai-chatbot` - AI assistant functionality
- `enhanced-ai-analysis` - Advanced assessment analysis
- `generate-ai-report` - AI-powered report generation
- `generate-pdf-report` - PDF report creation
- `security-middleware` - Security validation
- `send-partner-credentials` - Partner onboarding emails

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to your preferred hosting platform
3. Configure environment variables
4. Set up custom domain

### Lovable Deployment
Simply open [Lovable](https://lovable.dev/projects/592e4172-50dc-4929-9b00-9a8d4da81698) and click on Share → Publish.

### Domain Configuration
1. Configure DNS settings for your domain
2. Set up SSL certificates
3. Update Supabase project settings
4. Configure email service endpoints

## 🧪 Testing

### Test Candidate Management
The platform includes a testing dashboard for:
- Creating test candidates
- Generating assessment links
- Managing test scenarios
- Collecting feedback

### Quality Assurance
- Comprehensive assessment validation
- Cross-browser compatibility testing
- Mobile responsiveness verification
- Performance optimization

## 🛠️ Development

### Code Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components and routes
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── data/               # Assessment questions and static data
├── services/           # API services and utilities
├── utils/              # Utility functions
├── integrations/       # Third-party integrations
└── i18n/              # Internationalization files
```

### Design System
The platform uses a comprehensive design system:
- Semantic color tokens in `index.css`
- Tailwind configuration in `tailwind.config.ts`
- Consistent component variants
- Responsive design patterns
- Dark/light mode support

### Adding New Assessments
1. Create question data file in `src/data/`
2. Implement scoring hook in `src/hooks/`
3. Create assessment page component
4. Add routing configuration
5. Update navigation and featured assessments

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain design system consistency
- Write comprehensive tests
- Document new features

### Code Standards
- ESLint configuration enforced
- Prettier formatting required
- Component composition over inheritance
- Functional programming patterns
- Accessibility compliance (WCAG 2.1)

## 📞 Support

### Documentation
- Comprehensive inline documentation
- Component storybook (if applicable)
- API documentation
- User guides and tutorials

### Troubleshooting
Common issues and solutions:
- Authentication problems
- Database connection issues
- Assessment scoring discrepancies
- Report generation failures
- Performance optimization

## 📄 License

This project is proprietary software. All rights reserved.

## 🔄 Version History

### Current Version
- Multi-assessment platform
- Partner management system
- Advanced analytics dashboard
- AI-powered reporting
- Comprehensive security features

### Upcoming Features
- Mobile app development
- Advanced AI insights
- Enhanced partner customization
- Expanded assessment library
- Real-time collaboration tools

---

For technical support or questions, please contact the development team or refer to the inline documentation throughout the codebase.
