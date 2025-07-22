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

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd authencore-assessment-platform
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Environment Setup
The project uses Supabase configuration. Ensure your Supabase project is properly configured:

- **Project ID**: `jlbftyjewxgetxcihban`
- **Anon Key**: Already configured in the codebase

### 4. Supabase Configuration

#### Database Setup
The database schema includes tables for:
- `solo_candidates` - Individual assessment participants
- `employer_candidates` - Employer-sponsored assessments
- `employer_accounts` - Employer organization accounts
- `assessment_results` - Assessment completion data
- `payments` - Payment processing records
- `analytics_events` - Platform usage analytics
- `admin_users` - Administrative access control
- `partners` - Partner organization management
- `partner_candidates` - Partner-sponsored assessments

#### Authentication Setup
Configure authentication providers in Supabase:
1. Enable email/password authentication
2. Configure email templates
3. Set up OAuth providers (optional)

#### Row Level Security (RLS)
All tables have appropriate RLS policies configured for:
- User data isolation
- Partner access control
- Admin privilege management
- Employer candidate management

### 5. Run the Development Server
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

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
