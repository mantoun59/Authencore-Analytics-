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

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+** or **Bun** - JavaScript runtime
- **Git** - Version control system
- **Supabase Account** - Backend services provider
- **Code Editor** - VS Code recommended

### Step 1: Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd authencore-assessment-platform
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using Bun (recommended for faster installation):
```bash
bun install
```

### Step 3: Environment Variables

This project uses Supabase's integrated configuration, but you'll need to be aware of the following configuration values:

#### Client Configuration (Automatically configured)
```javascript
// src/integrations/supabase/client.ts
const SUPABASE_URL = "https://jlbftyjewxgetxcihban.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Supabase Secrets (Required for Edge Functions)
The following secrets must be configured in your Supabase dashboard:

1. **OPENAI_API_KEY** - For AI-powered report generation
   - Get from: https://platform.openai.com/api-keys
   - Used by: `ai-chatbot`, `enhanced-ai-analysis`, `generate-ai-report` functions

2. **SUPABASE_URL** - Your Supabase project URL
   - Auto-configured: `https://jlbftyjewxgetxcihban.supabase.co`

3. **SUPABASE_ANON_KEY** - Public anon key for client-side operations
   - Auto-configured from your Supabase project

4. **SUPABASE_SERVICE_ROLE_KEY** - Service role key for server-side operations
   - Found in: Supabase Dashboard > Settings > API
   - Used by: Edge functions for database operations

5. **SUPABASE_DB_URL** - Direct database connection string
   - Format: `postgresql://postgres:[password]@[host]:6543/postgres`
   - Found in: Supabase Dashboard > Settings > Database

#### Setting Supabase Secrets
Navigate to your Supabase project:
1. Go to **Settings** > **Edge Functions**
2. Click **Add Secret**
3. Enter the secret name and value
4. Secrets are automatically available in Edge Functions

### Step 4: Supabase Project Setup

#### 4.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing project ID: `jlbftyjewxgetxcihban`
3. Wait for project initialization to complete

#### 4.2 Authentication Configuration
1. Navigate to **Authentication** > **Settings**
2. **Enable email confirmations** (recommended)
3. Configure **Site URL**: `http://localhost:5173` (development)
4. Set **Redirect URLs** for production deployment
5. **Email Templates**: Customize confirmation and recovery emails
6. **Auth Providers**: Enable additional providers as needed (Google, GitHub, etc.)

#### 4.3 Database Schema
The database includes the following main tables:

**Core Tables:**
- `profiles` - User profile information
- `user_roles` - Role-based access control
- `user_sessions` - Session management
- `user_mfa` - Multi-factor authentication

**Assessment Tables:**
- `assessment_results` - Assessment completion data
- `generated_reports` - AI-generated assessment reports
- `genz_assessment_results` - Gen Z workplace assessment data
- `genz_assessment_responses` - Individual response tracking
- `genz_assessment_scenarios` - Assessment scenarios

**Business Tables:**
- `solo_candidates` - Individual assessment participants
- `employer_accounts` - Employer organization accounts
- `employer_candidates` - Employer-sponsored assessments
- `partner_accounts` - Partner organization management
- `partner_access_permissions` - Partner access control
- `partner_access_logs` - Partner activity logging

**System Tables:**
- `analytics_events` - Platform usage analytics
- `security_events` - Security monitoring and audit trails
- `api_rate_limits` - API rate limiting
- `payments` - Payment processing records

### Step 5: Database Migrations

The project includes comprehensive database migrations that set up the entire schema with proper security policies.

#### Running Migrations
Migrations are automatically handled through the Lovable platform when connected to Supabase. However, if you need to manually run migrations:

1. **Access Supabase SQL Editor**:
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Run Migration Files** (in order):
   ```sql
   -- Core setup and profiles
   \i supabase/migrations/20250716053331-7c27f452-1163-41b9-ad81-2591ead9e66a.sql
   
   -- Security fixes
   \i supabase/migrations/20250716055923-75af7589-9ec4-4cbf-b1d5-c4c2ed7304d7.sql
   
   -- Role-based access control
   \i supabase/migrations/20250716163529-174aba09-a438-4ae7-9186-a22f19d52d6f.sql
   \i supabase/migrations/20250716163559-dda489ea-8dd4-4867-bf4d-748f5f7b4fff.sql
   \i supabase/migrations/20250716165013-1bcfd18b-98c0-4da2-b636-efb2d5ca554a.sql
   
   -- Additional features
   \i supabase/migrations/20250716134955-0ac27dc7-d6cc-49a1-b1b5-470a3dad7701.sql
   \i supabase/migrations/20250716154257-0270df65-64e9-4cf9-86e4-c058983057f4.sql
   \i supabase/migrations/20250717051748-a9b31ce6-d470-4e6e-a4dc-d77d4ee1e9b8.sql
   \i supabase/migrations/20250719050543-07508d9e-7ef5-46d7-8550-5dbe12cf4c0a.sql
   \i supabase/migrations/20250719141423-6b10ce80-580e-404c-81f4-c3b5871a9cac.sql
   \i supabase/migrations/20250720124225-6bc1606c-959d-4732-9b9a-8eb37897bdbf.sql
   \i supabase/migrations/20250720125445-f5719918-c38a-4a9d-a962-2a718518bdd2.sql
   \i supabase/migrations/20250720125730-f145b3e5-5778-4a75-bfc8-d2854f79d57d.sql
   \i supabase/migrations/20250721084127-302550e6-52da-44ad-b018-4e8654f30dd7.sql
   \i supabase/migrations/20250721095042-58a3148c-61d5-486f-9f58-45dedd2b3f2f.sql
   \i supabase/migrations/20250721095424-54738fdc-803f-493d-aa8a-ecbd822f4b6f.sql
   \i supabase/migrations/20250721100012-bdaf4fff-9187-47ce-b8c6-715b23a669af.sql
   ```

#### Key Migration Features

**Security & Authentication:**
- Row Level Security (RLS) enabled on all tables
- Secure database functions with proper search_path
- User profile management with automatic creation
- Multi-factor authentication support
- Session management and security monitoring

**Business Logic:**
- Partner account management with access controls
- Employer dashboard functionality
- Assessment result storage and retrieval
- Payment processing integration
- Analytics and reporting infrastructure

**Admin Setup:**
The migrations include an admin setup function. To assign admin role to a user:
```sql
-- Replace with your admin email
SELECT public.assign_admin_role('your-email@authencore.org');
```

### Step 6: Edge Functions Deployment

Edge Functions are automatically deployed when connected to Supabase. Key functions include:

- **ai-chatbot**: AI assistant for user guidance
- **enhanced-ai-analysis**: Advanced assessment analysis
- **generate-ai-report**: AI-powered report generation  
- **generate-pdf-report**: PDF report creation
- **security-middleware**: Security validation and monitoring
- **send-partner-credentials**: Partner onboarding emails

### Step 7: Run the Development Server

Start the development server:
```bash
npm run dev
# or
bun dev
```

The application will be available at:
- **Local**: http://localhost:5173
- **Network**: http://[your-ip]:5173

### Step 8: Initial Setup Verification

1. **Database Connection**: Check that all tables are created successfully
2. **Authentication**: Test user registration and login
3. **Admin Access**: Verify admin user can access admin dashboard
4. **Assessment Flow**: Complete a sample assessment end-to-end
5. **Edge Functions**: Test AI report generation functionality

### Common Setup Issues

**Database Connection Errors:**
- Verify Supabase project is active and accessible
- Check that all migrations have been applied successfully
- Ensure RLS policies are properly configured

**Authentication Issues:**
- Confirm email confirmation is properly configured
- Check Site URL and Redirect URL settings
- Verify auth providers are enabled if using OAuth

**Edge Function Errors:**
- Ensure all required secrets are configured in Supabase
- Check Edge Function logs in Supabase dashboard
- Verify OpenAI API key has sufficient credits and permissions

**Build Issues:**
- Run `npm install` or `bun install` to ensure all dependencies are installed
- Check Node.js version compatibility (18+)
- Clear cache with `npm run clean` if available

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

### Career Launch Assessment
- **Questions**: 45 comprehensive career-focused questions
- **Scoring**: Multi-dimensional analysis including interests, values, skills
- **Report**: Detailed career recommendations with action steps

### Communication Styles
- **Questions**: 30 scenario-based questions
- **Scoring**: Four primary communication styles with percentages
- **Report**: Style breakdown with team dynamics insights

### Cultural Intelligence (CAIR)
- **Questions**: 20 cultural scenario questions
- **Scoring**: Cultural adaptability and awareness metrics
- **Report**: Cultural competency development recommendations

### Other Assessments
Each assessment includes:
- Validated psychometric questions
- Algorithm-based scoring
- AI-enhanced report generation
- Actionable insights and recommendations

## 🏢 User Roles & Permissions

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
