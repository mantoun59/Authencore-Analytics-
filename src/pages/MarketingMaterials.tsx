import React from 'react';
import { Download, FileText, Image, Users, BarChart3, Briefcase, Sparkles, Target, TrendingUp, Award, Building, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

// Import marketing materials
import marketingBrochure from '@/assets/marketing-brochure-cover.jpg';
import productSheet from '@/assets/product-sheet.jpg';
import servicesOverview from '@/assets/services-overview.jpg';
import caseStudyTemplate from '@/assets/case-study-template.jpg';
import finalLogo from '@/assets/final-logo.png';

interface MarketingMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  size: string;
  image: string;
  icon: React.ComponentType<any>;
}

const marketingMaterials: MarketingMaterial[] = [
  {
    id: 'company-brochure',
    title: 'High-Impact Marketing Brochure',
    description: 'Comprehensive 4-page executive brochure featuring AI-driven scoring, dual reports, validity detection, strategic use cases, user profiles, and competitive advantages. Designed for maximum impact.',
    category: 'Company Overview',
    format: 'PDF',
    size: '4.2 MB',
    image: marketingBrochure,
    icon: Building
  },
  {
    id: 'complete-assessment-portfolio',
    title: 'Complete Assessment Portfolio',
    description: 'Comprehensive guide to all 12 professional assessments including Career Launch, Emotional Intelligence, Leadership, Communication Styles, Cultural Intelligence, Faith & Values, Digital Wellness, Stress Resilience, Gen Z Workplace, and Burnout Prevention.',
    category: 'Product Information',
    format: 'PDF',
    size: '6.8 MB',
    image: productSheet,
    icon: BarChart3
  },
  {
    id: 'enterprise-solutions',
    title: 'Enterprise Solutions Guide',
    description: 'Advanced enterprise features: bulk assessments, custom branding, API integrations, white-label solutions, dedicated support, and analytics dashboards for Fortune 500 companies.',
    category: 'Enterprise',
    format: 'PDF',
    size: '3.4 MB',
    image: servicesOverview,
    icon: Globe
  },
  {
    id: 'roi-case-studies',
    title: 'ROI & Success Case Studies',
    description: 'Proven results: 35% reduction in turnover, 40% better hiring accuracy, $50,000+ annual savings. Real case studies from TechCorp, HealthSystem Inc, and Global Manufacturing Co.',
    category: 'Case Studies',
    format: 'PDF',
    size: '5.1 MB',
    image: caseStudyTemplate,
    icon: TrendingUp
  },
  {
    id: 'assessment-technical-specs',
    title: 'Technical Specifications Sheet',
    description: 'Detailed psychometric properties, validation studies, reliability coefficients (α > 0.85), test-retest reliability, and compliance certifications (ISO 27001, GDPR).',
    category: 'Technical',
    format: 'PDF',
    size: '2.9 MB',
    image: productSheet,
    icon: Award
  },
  {
    id: 'industry-applications',
    title: 'Industry Applications Guide',
    description: 'Sector-specific implementation guides for Healthcare, Finance, Technology, Education, Manufacturing, Government, and Non-Profit organizations with customized workflows.',
    category: 'Industry Solutions',
    format: 'PDF',
    size: '4.6 MB',
    image: servicesOverview,
    icon: Target
  },
  {
    id: 'pricing-packages',
    title: 'Pricing & Packages Overview',
    description: 'Transparent pricing for Individual ($29), Professional ($99), Team ($199), and Enterprise (Custom) packages. Volume discounts up to 40% for bulk purchases.',
    category: 'Pricing',
    format: 'PDF',
    size: '1.8 MB',
    image: marketingBrochure,
    icon: Sparkles
  },
  {
    id: 'api-integration-guide',
    title: 'API Integration Guide',
    description: 'Complete developer documentation for REST API integration, webhooks, SSO setup, and HRIS system connections. Includes code samples and implementation timelines.',
    category: 'Technical',
    format: 'PDF',
    size: '3.7 MB',
    image: productSheet,
    icon: Globe
  }
];

const MarketingMaterials: React.FC = () => {
  const { toast } = useToast();

  const loadLogoAsBase64 = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Unable to get canvas context'));
          return;
        }
        
        // Maintain aspect ratio while setting larger fixed width for PDFs
        const targetWidth = 180; // Increased from 120 to 180 for better PDF visibility
        const aspectRatio = img.height / img.width;
        const targetHeight = targetWidth * aspectRatio;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        try {
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load logo image'));
      img.src = finalLogo;
    });
  };

  const generateCompanyBrochure = async () => {
    try {
      const pdf = new jsPDF();
      const logoBase64 = await loadLogoAsBase64();
      
      // Cover page with gradient effect
      pdf.setFillColor(15, 23, 42); // Dark blue background
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Header accent
      pdf.setFillColor(59, 130, 246); // Blue accent
      pdf.rect(0, 0, 210, 80, 'F');
      
      // Logo
      if (logoBase64) {
        pdf.addImage(logoBase64, 'PNG', 20, 20, 60, 30);
      }
      
      // Decorative elements
      pdf.setFillColor(94, 234, 212); // Teal accent circles
      pdf.circle(180, 25, 8, 'F');
      pdf.circle(165, 45, 5, 'F');
      pdf.circle(190, 55, 3, 'F');
      
      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(38);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize('AuthenCore Analytics', 170);
      pdf.text(titleLines, 20, 110);
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'normal');
      const subtitleLines = pdf.splitTextToSize('Advanced Psychological Assessment Platform', 170);
      pdf.text(subtitleLines, 20, 130);
      
      // Key differentiators box
      pdf.setFillColor(30, 41, 59); // Darker blue
      pdf.rect(20, 150, 170, 80, 'F');
      
      pdf.setTextColor(94, 234, 212); // Teal accent
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Why Choose AuthenCore?', 30, 170);
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const differentiators = [
        '✓ AI-Driven Scoring Engine with Advanced Analytics',
        '✓ Distortion Scale & Response Validation Technology',
        '✓ Dual Report System (Applicant & Employer Views)',
        '✓ Multilingual, Co-Branded Output Options',
        '✓ GDPR-Ready Privacy & Data Governance',
        '✓ Certificate of Completion Per Assessment'
      ];
      
      differentiators.forEach((item, index) => {
        const wrappedText = pdf.splitTextToSize(item, 160);
        pdf.text(wrappedText, 30, 185 + (index * 10));
      });
      
      // Stats box
      pdf.setFillColor(22, 163, 74);
      pdf.rect(20, 245, 170, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('50,000+ Assessments Completed', 25, 252);
      pdf.text('85% Accuracy Rate', 80, 252);
      pdf.text('95% Client Satisfaction', 135, 252);
      pdf.text('30+ Industries Served', 25, 260);
      pdf.text('ISO 27001 Certified', 80, 260);
      pdf.text('GDPR Compliant', 135, 260);
      
      // Footer tagline
      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'italic');
      const taglineLines = pdf.splitTextToSize('Transforming talent decisions through science', 170);
      pdf.text(taglineLines, 20, 280);
      
      // Page 2 - Assessment Suite
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');
      
      // Header with icon
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, 210, 45, 'F');
      
      // Add brain icon illustration
      pdf.setFillColor(255, 255, 255);
      pdf.circle(25, 25, 8, 'F');
      pdf.setFillColor(59, 130, 246);
      pdf.circle(25, 25, 6, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Comprehensive Assessment Suite', 45, 30);
      
      // Assessment cards with icons
      pdf.setTextColor(0, 0, 0);
      const assessmentData = [
        {
          title: 'CareerLaunch Assessment',
          purpose: 'Career discovery & planning with RIASEC profiling',
          target: 'Students, career changers, HR professionals',
          outcome: 'Personalized career paths with 90% accuracy match',
          price: '$9.99',
          icon: '🚀'
        },
        {
          title: 'CAIR+ Personality',
          purpose: 'Advanced personality assessment with validity detection',
          target: 'Employers, recruiters, team leaders',
          outcome: 'Predicts job performance with 85% reliability',
          price: '$29.99',
          icon: '🧠'
        },
        {
          title: 'Burnout Prevention Index',
          purpose: 'Proactive stress & resilience evaluation',
          target: 'Managers, wellness coordinators, coaches',
          outcome: 'Reduces burnout risk by 60% through early intervention',
          price: '$39.99',
          icon: '🛡️'
        },
        {
          title: 'Cultural Intelligence',
          purpose: 'Global competency & cross-cultural effectiveness',
          target: 'International teams, global organizations',
          outcome: 'Improves cross-cultural team performance by 40%',
          price: '$19.99',
          icon: '🌍'
        }
      ];
      
      let yPos = 65;
      assessmentData.forEach((assessment, index) => {
        // Assessment card background with rounded corners effect
        pdf.setFillColor(248, 250, 252);
        pdf.rect(20, yPos - 5, 170, 48, 'F');
        
        // Icon
        pdf.setFontSize(16);
        pdf.text(assessment.icon, 25, yPos + 5);
        
        // Title
        pdf.setTextColor(37, 99, 235);
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        const titleLines = pdf.splitTextToSize(assessment.title, 120);
        pdf.text(titleLines, 35, yPos + 5);
        
        // Price tag
        pdf.setTextColor(22, 163, 74);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(assessment.price, 155, yPos + 5);
        
        // Purpose
        pdf.setTextColor(75, 85, 99);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const purposeLines = pdf.splitTextToSize(`Purpose: ${assessment.purpose}`, 145);
        pdf.text(purposeLines, 25, yPos + 16);
        
        // Target users
        const targetLines = pdf.splitTextToSize(`Target: ${assessment.target}`, 145);
        pdf.text(targetLines, 25, yPos + 25);
        
        // Outcome
        pdf.setTextColor(16, 185, 129);
        pdf.setFont('helvetica', 'bold');
        const outcomeLines = pdf.splitTextToSize(`Outcome: ${assessment.outcome}`, 145);
        pdf.text(outcomeLines, 25, yPos + 34);
        
        yPos += 53;
      });
      
      // Page 3 - User Profiles & Use Cases
      pdf.addPage();
      
      // Header with people icon
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, 210, 45, 'F');
      
      // Add people icon illustration
      pdf.setFillColor(255, 255, 255);
      pdf.circle(20, 25, 6, 'F');
      pdf.circle(30, 25, 6, 'F');
      pdf.circle(40, 25, 6, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Strategic Applications', 55, 30);
      
      // User profiles section with icons
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('👥 User Profiles', 20, 65);
      
      const userProfiles = [
        {
          type: 'Employers & HR Teams',
          use: 'Streamline hiring with predictive personality insights, reduce turnover by 45%',
          features: 'Bulk assessments, custom branding, compliance reporting',
          icon: '🏢'
        },
        {
          type: 'Career Coaches & Consultants',
          use: 'Deliver evidence-based coaching with comprehensive client insights',
          features: 'White-label reports, client management, progress tracking',
          icon: '👩‍💼'
        },
        {
          type: 'Solo Candidates & Professionals',
          use: 'Gain deep self-awareness for career advancement and personal growth',
          features: 'Instant results, action plans, development resources',
          icon: '🎯'
        }
      ];
      
      let profileYPos = 80;
      userProfiles.forEach((profile) => {
        pdf.setFillColor(241, 245, 249);
        pdf.rect(20, profileYPos - 5, 170, 40, 'F');
        
        // Icon
        pdf.setFontSize(14);
        pdf.text(profile.icon, 25, profileYPos + 5);
        
        pdf.setTextColor(37, 99, 235);
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        const typeLines = pdf.splitTextToSize(profile.type, 140);
        pdf.text(typeLines, 35, profileYPos + 5);
        
        pdf.setTextColor(75, 85, 99);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const useLines = pdf.splitTextToSize(profile.use, 150);
        pdf.text(useLines, 25, profileYPos + 16);
        
        pdf.setTextColor(16, 185, 129);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        const featureLines = pdf.splitTextToSize(`Features: ${profile.features}`, 150);
        pdf.text(featureLines, 25, profileYPos + 28);
        
        profileYPos += 45;
      });
      
      // Strategic use cases with chart illustration
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📊 Strategic Use Cases', 20, 225);
      
      const useCases = [
        '• Pre-hiring: Screen candidates with 85% accuracy, reduce bad hires by 50%',
        '• Onboarding: Match new hires to teams and roles for optimal integration',
        '• Team Building: Analyze team dynamics and improve collaboration by 35%',
        '• Leadership Development: Identify high-potential talent and development needs',
        '• Career Coaching: Provide data-driven guidance for career transitions',
        '• Organizational Health: Monitor burnout risk and implement preventive measures'
      ];
      
      pdf.setTextColor(75, 85, 99);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      useCases.forEach((useCase, index) => {
        const caseLines = pdf.splitTextToSize(useCase, 165);
        pdf.text(caseLines, 25, 240 + (index * 9));
      });
      
      // Page 4 - Technical Excellence & Contact
      pdf.addPage();
      
      // Header with tech icon
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, 210, 45, 'F');
      
      // Add tech icon illustration
      pdf.setFillColor(255, 255, 255);
      pdf.rect(20, 18, 12, 8, 'F');
      pdf.setFillColor(94, 234, 212);
      pdf.rect(22, 20, 8, 4, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Technical Excellence', 45, 30);
      
      // Technical specs with icons
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🔧 Platform Capabilities', 20, 65);
      
      const techSpecs = [
        '🔬 Advanced Psychometric Validation: Test-retest reliability >0.85',
        '🤖 AI-Powered Analysis: Machine learning algorithms for pattern recognition',
        '🛡️ Security & Compliance: GDPR/CCPA compliant, bank-level encryption',
        '🌐 Multi-language Support: 15+ languages with cultural adaptation',
        '📊 Real-time Analytics: Instant scoring with percentile benchmarking',
        '🎯 Predictive Insights: Performance correlation with 78% accuracy',
        '📱 Responsive Design: Optimized for mobile, tablet, and desktop',
        '🔗 API Integration: Seamless integration with HR systems'
      ];
      
      pdf.setTextColor(75, 85, 99);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      techSpecs.forEach((spec, index) => {
        const specLines = pdf.splitTextToSize(spec, 160);
        pdf.text(specLines, 25, 80 + (index * 11));
      });
      
      // Competitive advantage with trophy icon
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🏆 Competitive Advantage', 20, 195);
      
      pdf.setFillColor(22, 163, 74);
      pdf.rect(20, 205, 170, 55, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text('vs. Traditional Assessments:', 30, 220);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const advantages = [
        '• 3x faster completion time with higher engagement',
        '• 50% higher accuracy in performance predictions',
        '• Real-time validity detection prevents response gaming',
        '• Advanced AI insights not available in traditional tools'
      ];
      
      advantages.forEach((advantage, index) => {
        const advLines = pdf.splitTextToSize(advantage, 160);
        pdf.text(advLines, 30, 235 + (index * 8));
      });
      
      // Contact info with design elements
      pdf.setFillColor(15, 23, 42);
      pdf.rect(20, 270, 170, 25, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📞 Ready to Transform Your Talent Strategy?', 25, 280);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(94, 234, 212);
      const contactLines = pdf.splitTextToSize('Visit: authencore-analytics.com | Email: info@authencore.com', 160);
      pdf.text(contactLines, 25, 290);
      
      return pdf;
    } catch (error) {
      console.error('Error generating comprehensive brochure:', error);
      throw error;
    }
  };

  const generateProductSheet = async () => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 45, 25);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    
    // Header text
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('Assessment Products & Services', 75, 25);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Career Launch Assessment', 20, 50);
    doc.setFontSize(11);
    doc.text('Comprehensive career readiness evaluation measuring key workplace', 20, 60);
    doc.text('competencies, personality traits, and professional development areas.', 20, 68);
    doc.text('• Duration: 45-60 minutes', 25, 78);
    doc.text('• Detailed PDF reports with recommendations', 25, 86);
    doc.text('• Suitable for: Job seekers, recent graduates, career changers', 25, 94);
    
    // Product 2
    doc.setFontSize(16);
    doc.text('Emotional Intelligence Assessment', 20, 110);
    doc.setFontSize(11);
    doc.text('Measures emotional awareness, regulation, and interpersonal skills', 20, 120);
    doc.text('essential for workplace success and personal development.', 20, 128);
    doc.text('• Duration: 30-40 minutes', 25, 138);
    doc.text('• EQ scores across 4 key domains', 25, 146);
    doc.text('• Development recommendations included', 25, 154);
    
    // Product 3
    doc.setFontSize(16);
    doc.text('Leadership Style Assessment', 20, 170);
    doc.setFontSize(11);
    doc.text('Identifies leadership strengths, communication preferences, and', 20, 180);
    doc.text('management style to enhance team effectiveness.', 20, 188);
    doc.text('• Duration: 35-45 minutes', 25, 198);
    doc.text('• 360-degree feedback integration available', 25, 206);
    doc.text('• Team dynamics analysis', 25, 214);
    
    // Enterprise Solutions
    doc.setFontSize(16);
    doc.setTextColor(41, 128, 185);
    doc.text('Enterprise Solutions', 20, 235);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('• Bulk assessment packages with volume discounts', 25, 245);
    doc.text('• Custom branding and white-label options', 25, 253);
    doc.text('• API integration for HRIS systems', 25, 261);
    doc.text('• Dedicated account management', 25, 269);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Contact us for pricing and custom solutions: info@authencore-analytics.org', 20, 290);
    
    return doc;
  };

  const generateCaseStudy = async () => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 45, 25);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    // Header text  
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('Success Story: TechCorp Implementation', 75, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Client Challenge', 20, 50);
    doc.setFontSize(11);
    doc.text('TechCorp, a growing software company with 200+ employees, faced', 20, 60);
    doc.text('challenges in hiring the right talent and reducing turnover rates.', 20, 68);
    doc.text('Their existing interview process lacked objective assessment tools.', 20, 76);
    
    doc.setFontSize(14);
    doc.text('AuthenCore Solution', 20, 95);
    doc.setFontSize(11);
    doc.text('Implemented comprehensive assessment suite including:', 20, 105);
    doc.text('• Career Launch Assessments for all new hires', 25, 115);
    doc.text('• Leadership evaluations for management candidates', 25, 123);
    doc.text('• Team compatibility analysis', 25, 131);
    doc.text('• Custom reporting dashboard for HR team', 25, 139);
    
    doc.setFontSize(14);
    doc.text('Results Achieved', 20, 158);
    doc.setFontSize(11);
    doc.text('Within 6 months of implementation:', 20, 168);
    doc.text('✓ 35% reduction in employee turnover', 25, 178);
    doc.text('✓ 40% improvement in hiring accuracy', 25, 186);
    doc.text('✓ 25% faster onboarding process', 25, 194);
    doc.text('✓ 90% employee satisfaction with role fit', 25, 202);
    doc.text('✓ $50,000 annual savings in recruitment costs', 25, 210);
    
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('"AuthenCore Analytics transformed our hiring process. We now', 20, 230);
    doc.text('make data-driven decisions and see much better outcomes."', 20, 240);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('- Sarah Johnson, HR Director, TechCorp', 20, 250);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Ready to transform your organization? Contact us today.', 20, 280);
    doc.text('Email: sales@authencore-analytics.org | Phone: (555) 123-4567', 20, 290);
    
    return doc;
  };

  const generateAPIIntegrationGuide = async () => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 45, 25);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    
    // Header text
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('API Integration Guide', 75, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Getting Started with AuthenCore APIs', 20, 50);
    doc.setFontSize(11);
    doc.text('This guide provides comprehensive documentation for integrating', 20, 60);
    doc.text('AuthenCore Analytics APIs into your existing systems.', 20, 68);
    
    // Authentication Section
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('Authentication', 20, 85);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('All API requests require authentication using API keys.', 20, 95);
    doc.text('Include your API key in the Authorization header:', 20, 103);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Authorization: Bearer YOUR_API_KEY', 25, 113);
    
    // REST API Endpoints
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('Core API Endpoints', 20, 130);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Assessment Management:', 20, 140);
    doc.setFontSize(9);
    doc.text('• POST /api/v1/assessments - Create new assessment', 25, 150);
    doc.text('• GET /api/v1/assessments/{id} - Retrieve assessment', 25, 158);
    doc.text('• GET /api/v1/assessments/{id}/results - Get results', 25, 166);
    
    doc.setFontSize(11);
    doc.text('User Management:', 20, 180);
    doc.setFontSize(9);
    doc.text('• POST /api/v1/users - Create user account', 25, 190);
    doc.text('• GET /api/v1/users/{id} - Retrieve user profile', 25, 198);
    doc.text('• PUT /api/v1/users/{id} - Update user information', 25, 206);
    
    // Webhooks Section
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('Webhooks & Real-time Updates', 20, 223);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Configure webhooks to receive real-time notifications:', 20, 233);
    doc.setFontSize(9);
    doc.text('• assessment.completed - When assessment is finished', 25, 243);
    doc.text('• user.created - When new user is registered', 25, 251);
    doc.text('• report.generated - When PDF report is ready', 25, 259);
    
    // Implementation Timeline
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('Implementation Timeline', 20, 275);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Support: api-support@authencore-analytics.org | Docs: docs.authencore.com', 20, 290);
    
    return doc;
  };

  const generateServicesOverview = async () => {
    const doc = new jsPDF('landscape');
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 45, 25);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    
    // Header text
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('AuthenCore Analytics - Complete Service Portfolio', 75, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Individual Assessments', 20, 45);
    doc.setFontSize(10);
    doc.text('• Career Launch Assessment', 25, 55);
    doc.text('• Emotional Intelligence', 25, 62);
    doc.text('• Communication Styles', 25, 69);
    doc.text('• Digital Wellness', 25, 76);
    doc.text('• Stress & Resilience', 25, 83);
    doc.text('• Burnout Prevention', 25, 90);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Professional Features', 20, 110);
    doc.setFontSize(10);
    doc.text('• Instant PDF reports', 25, 120);
    doc.text('• Scientific validation', 25, 127);
    doc.text('• Multiple languages', 25, 134);
    doc.text('• Mobile-friendly interface', 25, 141);
    doc.text('• Data security compliance', 25, 148);
    
    // Column 2
    doc.setFontSize(14);
    doc.text('Enterprise Solutions', 150, 45);
    doc.setFontSize(10);
    doc.text('• Bulk assessment packages', 155, 55);
    doc.text('• Custom branding options', 155, 62);
    doc.text('• API integrations', 155, 69);
    doc.text('• White-label solutions', 155, 76);
    doc.text('• Dedicated support', 155, 83);
    doc.text('• Training programs', 155, 90);
    
    doc.setFontSize(14);
    doc.text('Analytics & Reporting', 150, 110);
    doc.setFontSize(10);
    doc.text('• Comprehensive dashboards', 155, 120);
    doc.text('• Trend analysis', 155, 127);
    doc.text('• Benchmark comparisons', 155, 134);
    doc.text('• Export capabilities', 155, 141);
    doc.text('• Real-time insights', 155, 148);
    
    // Bottom section
    doc.setFontSize(16);
    doc.setTextColor(41, 128, 185);
    doc.text('Industry Applications', 20, 175);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Healthcare | Education | Technology | Finance | Manufacturing | Consulting | Government | Non-Profit', 25, 185);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Contact: info@authencore-analytics.org | Visit: www.authencore-analytics.org | Call: (555) 123-4567', 20, 200);
    
    return doc;
  };

  const handleDownload = async (material: MarketingMaterial) => {
    try {
      // First try professional PDF generation edge function
      try {
        const response = await fetch('https://jlbftyjewxgetxcihban.supabase.co/functions/v1/generate-marketing-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg'}`,
          },
          body: JSON.stringify({
            materialId: material.id,
            title: material.title,
            description: material.description,
            category: material.category,
          }),
        });

        if (response.ok) {
          const htmlContent = await response.text();
          
          // Open HTML content in new window for PDF printing
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.close();
            
            toast({
              title: "Professional PDF Ready",
              description: `${material.title} is ready for download. Use the "Save as PDF" button in the new window.`,
            });
          } else {
            throw new Error('Popup blocked');
          }
          return;
        }
      } catch (serverError) {
        console.warn('Professional PDF generation failed, using fallback:', serverError);
      }

      // Fallback to client-side generation
      let doc;
      let filename;
      
      switch (material.id) {
        case 'company-brochure':
          doc = await generateCompanyBrochure();
          filename = 'AuthenCore-High-Impact-Marketing-Brochure.pdf';
          break;
        case 'complete-assessment-portfolio':
          doc = await generateProductSheet();
          filename = 'AuthenCore-Complete-Assessment-Portfolio.pdf';
          break;
        case 'enterprise-solutions':
          doc = await generateServicesOverview();
          filename = 'AuthenCore-Enterprise-Solutions-Guide.pdf';
          break;
        case 'roi-case-studies':
          doc = await generateCaseStudy();
          filename = 'AuthenCore-ROI-Case-Studies.pdf';
          break;
        case 'assessment-technical-specs':
          doc = await generateProductSheet();
          filename = 'AuthenCore-Technical-Specifications.pdf';
          break;
        case 'industry-applications':
          doc = await generateServicesOverview();
          filename = 'AuthenCore-Industry-Applications-Guide.pdf';
          break;
        case 'pricing-packages':
          doc = await generateCompanyBrochure();
          filename = 'AuthenCore-Pricing-Packages.pdf';
          break;
        case 'api-integration-guide':
          doc = await generateAPIIntegrationGuide();
          filename = 'AuthenCore-API-Integration-Guide.pdf';
          break;
        default:
          // Fallback to image download
          const response = await fetch(material.image);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `AuthenCore-${material.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "Download Started",
            description: `${material.title} is being downloaded.`,
          });
          return;
      }
      
      if (doc) {
        doc.save(filename);
        toast({
          title: "Download Started",
          description: `${material.title} PDF is being downloaded.`,
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const categories = Array.from(new Set(marketingMaterials.map(m => m.category)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80" 
            alt="Professional workspace" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Briefcase className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Professional Marketing Materials
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Showcase AuthenCore Analytics with our comprehensive collection of professional marketing materials. 
              High-quality resources designed to communicate our value proposition effectively.
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Professional Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Ready to Use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Materials</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive collection of marketing materials, each professionally designed 
              to communicate our expertise and value proposition.
            </p>
          </div>

          {/* Category Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
              <Building className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Company Overview</h3>
              <p className="text-sm text-muted-foreground">Comprehensive business profiles</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Product Information</h3>
              <p className="text-sm text-muted-foreground">Detailed service specifications</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Case Studies</h3>
              <p className="text-sm text-muted-foreground">Real-world success stories</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg">
              <Globe className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Services</h3>
              <p className="text-sm text-muted-foreground">Complete service portfolio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {marketingMaterials.map((material) => {
              const IconComponent = material.icon;
              return (
                <Card key={material.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <div className="aspect-video relative bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
                    <img
                      src={material.image}
                      alt={material.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/90 backdrop-blur border-white/20 shadow-sm">
                        {material.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-white">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{material.format}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      {material.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {material.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant="secondary">{material.format}</Badge>
                        <Badge variant="outline">{material.size}</Badge>
                      </div>
                      
                      <Button
                        onClick={() => handleDownload(material)}
                        variant="success"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Usage Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <Card>
                <CardContent className="p-6">
                  <Image className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Brand Consistency</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain AuthenCore Analytics branding standards when using these materials
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Client Presentations</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect for client meetings, proposals, and stakeholder presentations
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <FileText className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Professional Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    High-resolution materials designed for both digital and print use
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketingMaterials;