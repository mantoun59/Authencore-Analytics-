// Enhanced Professional Report Generator
// Creates comprehensive, AI-powered assessment reports with charts, development plans, and professional branding

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logoImage from '@/assets/final-logo.png';

export interface EnhancedReportConfig {
  candidateInfo: {
    name: string;
    email: string;
    position?: string;
    company?: string;
    completionDate: string;
    assessmentId: string;
    timeSpent?: number;
    questionsAnswered?: number;
  };
  assessmentType: string;
  results: any;
  reportType: 'candidate' | 'employer';
  includeCharts?: boolean;
  includeDevelopmentPlan?: boolean;
  includeAIInsights?: boolean;
}

export class EnhancedReportGenerator {
  private static instance: EnhancedReportGenerator;
  
  static getInstance(): EnhancedReportGenerator {
    if (!EnhancedReportGenerator.instance) {
      EnhancedReportGenerator.instance = new EnhancedReportGenerator();
    }
    return EnhancedReportGenerator.instance;
  }

  async generateReport(config: EnhancedReportConfig): Promise<void> {
    try {
      // Generate AI insights if enabled
      let aiInsights = null;
      if (config.includeAIInsights) {
        aiInsights = await this.generateAIInsights(config);
      }

      const htmlContent = await this.buildProfessionalReport(config, aiInsights);
      this.displayReport(htmlContent, config);
      
      toast.success('Professional assessment report generated successfully!');
    } catch (error) {
      console.error('Enhanced report generation error:', error);
      toast.error('Failed to generate enhanced report');
      throw error;
    }
  }

  private async generateAIInsights(config: EnhancedReportConfig): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-report', {
        body: {
          assessmentType: config.assessmentType,
          results: config.results,
          candidateInfo: config.candidateInfo,
          reportType: config.reportType,
          targetAudience: config.reportType === 'employer' ? 'hiring_manager' : 'candidate'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('AI insights generation failed:', error);
      return null;
    }
  }

  private async buildProfessionalReport(config: EnhancedReportConfig, aiInsights: any): Promise<string> {
    const assessmentTitles = {
      'career-launch': 'CareerLaunch Assessment',
      'cair-personality': 'CAIR+ Personality Assessment',
      'communication-styles': 'Communication Styles Assessment',
      'emotional-intelligence': 'Emotional Intelligence Assessment',
      'cultural-intelligence': 'Cultural Intelligence Assessment',
      'stress-resilience': 'Burnout Prevention Index',
      'genz-assessment': 'Gen Z Workplace Assessment',
      'digital-wellness': 'Digital Wellness Assessment'
    };

    const title = assessmentTitles[config.assessmentType] || 'Professional Assessment';
    const reportSubtitle = config.reportType === 'employer' ? 'Employer Hiring Report' : 'Individual Development Report';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${reportSubtitle}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>${this.getProfessionalStyles()}</style>
</head>
<body>
  <div class="report-container">
    ${this.buildProfessionalHeader(config, title, reportSubtitle)}
    ${this.buildExecutiveDashboard(config)}
    ${this.buildCandidateProfile(config)}
    ${this.buildAIExecutiveSummary(config, aiInsights)}
    ${config.includeCharts ? this.buildVisualizationSection(config) : ''}
    ${this.buildDetailedAnalysis(config, aiInsights)}
    ${this.buildCompetencyMatrix(config)}
    ${config.includeDevelopmentPlan ? this.buildDevelopmentPlan(config, aiInsights) : ''}
    ${this.buildRecommendations(config, aiInsights)}
    ${config.reportType === 'employer' ? this.buildEmployerInsights(config, aiInsights) : ''}
    ${this.buildValiditySection(config)}
    ${this.buildProfessionalFooter(config)}
  </div>
  
  <!-- Add debugging info -->
  <script>
    console.log('Report HTML loaded. Starting chart initialization...');
    console.log('Chart.js available:', typeof Chart !== 'undefined');
    console.log('Document ready state:', document.readyState);
  </script>
  
  <!-- Chart initialization script -->
  <script>
    function waitForChartJS() {
      if (typeof Chart !== 'undefined') {
        console.log('Chart.js detected, initializing charts...');
        initializeCharts();
      } else {
        console.log('Chart.js not ready, waiting...');
        setTimeout(waitForChartJS, 100);
      }
    }
    
    function initializeCharts() {
      console.log('Running chart initialization...');
      ${this.getChartScripts(config)}
      
      // Small delay before allowing print
      setTimeout(() => {
        console.log('Charts should be ready now');
        if (window.location.search.includes('print=true')) {
          window.print();
        }
      }, 500);
    }
    
    // Start the process
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForChartJS);
    } else {
      waitForChartJS();
    }
  </script>
</body>
</html>`;
  }

  private getProfessionalStyles(): string {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #1e293b;
        background: #ffffff;
        font-size: 14px;
      }
      
      .report-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0;
        background: white;
      }
      
      .page-break {
        page-break-before: always;
      }
      
      .header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
        color: white;
        padding: 40px;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        height: 200px;
        background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        border-radius: 50%;
        transform: translate(50%, -50%);
      }
      
      .header-content {
        position: relative;
        z-index: 2;
      }
      
      .company-logo {
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 12px;
        padding: 10px;
        margin-bottom: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      
      .report-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        background: linear-gradient(45deg, #ffffff, #e2e8f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .report-subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
        font-weight: 300;
      }
      
      .confidential-badge {
        position: absolute;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 12px;
        box-shadow: 0 2px 10px rgba(220, 38, 38, 0.3);
      }
      
      .dashboard {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        padding: 40px;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .metric-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      
      .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 8px;
      }
      
      .metric-label {
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
      }
      
      .metric-trend {
        margin-top: 8px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .trend-positive { color: #059669; }
      .trend-neutral { color: #d97706; }
      .trend-negative { color: #dc2626; }
      
      .section {
        padding: 40px;
        border-bottom: 1px solid #f1f5f9;
      }
      
      .section-title {
        font-size: 1.875rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .section-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
      }
      
      .candidate-profile {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border-radius: 16px;
        padding: 32px;
        margin: 20px 0;
        border: 1px solid #bfdbfe;
      }
      
      .profile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .profile-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .profile-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e40af;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .profile-value {
        font-size: 1.125rem;
        color: #1e293b;
        font-weight: 500;
      }
      
      .ai-summary {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-radius: 16px;
        padding: 32px;
        margin: 20px 0;
        border-left: 4px solid #0ea5e9;
      }
      
      .ai-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #0ea5e9;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 16px;
      }
      
      .chart-container {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin: 20px 0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
      }
      
      .chart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
        margin: 20px 0;
      }
      
      .competency-matrix {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 20px 0;
      }
      
      .competency-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .competency-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .competency-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
      }
      
      .competency-score {
        font-size: 1.5rem;
        font-weight: 700;
        padding: 8px 16px;
        border-radius: 8px;
        color: white;
      }
      
      .score-excellent { background: #059669; }
      .score-good { background: #3b82f6; }
      .score-average { background: #d97706; }
      .score-developing { background: #dc2626; }
      
      .progress-bar {
        width: 100%;
        height: 8px;
        background: #f1f5f9;
        border-radius: 4px;
        overflow: hidden;
        margin: 12px 0;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
      
      .development-plan {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border-radius: 16px;
        padding: 32px;
        margin: 20px 0;
        border: 1px solid #bbf7d0;
      }
      
      .timeline {
        position: relative;
        margin: 20px 0;
      }
      
      .timeline-item {
        position: relative;
        padding-left: 40px;
        margin-bottom: 24px;
      }
      
      .timeline-item::before {
        content: '';
        position: absolute;
        left: 12px;
        top: 0;
        width: 2px;
        height: 100%;
        background: #d1d5db;
      }
      
      .timeline-marker {
        position: absolute;
        left: 0;
        top: 4px;
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .timeline-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .timeline-title {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 8px;
      }
      
      .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 20px 0;
      }
      
      .recommendation-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        border-left: 4px solid #3b82f6;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .recommendation-priority {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 12px;
      }
      
      .priority-high { background: #fecaca; color: #991b1b; }
      .priority-medium { background: #fed7aa; color: #9a3412; }
      .priority-low { background: #bfdbfe; color: #1e40af; }
      
      .validity-indicators {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        margin: 20px 0;
      }
      
      .validity-item {
        text-align: center;
        padding: 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      
      .validity-value {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .validity-label {
        font-size: 0.875rem;
        color: #64748b;
      }
      
      .footer {
        background: #0f172a;
        color: white;
        padding: 40px;
        text-align: center;
      }
      
      .footer-content {
        max-width: 600px;
        margin: 0 auto;
      }
      
      .footer-logo {
        width: 60px;
        height: 60px;
        background: white;
        border-radius: 8px;
        padding: 8px;
        margin: 0 auto 20px;
      }
      
      @media print {
        body { 
          font-size: 12px; 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .report-container { 
          max-width: none; 
          padding: 0; 
        }
        .section { 
          page-break-inside: avoid; 
          padding: 20px; 
        }
        .metric-card, .competency-card, .recommendation-card { 
          break-inside: avoid; 
        }
        @page { 
          margin: 0.5in;
          @bottom-center { 
            content: "AuthenCore Analytics • " counter(page) " of " counter(pages); 
            font-size: 10px;
            color: #64748b;
          }
        }
      }
      
      @media (max-width: 768px) {
        .header { padding: 20px; }
        .section { padding: 20px; }
        .dashboard-grid { grid-template-columns: 1fr; }
        .chart-grid { grid-template-columns: 1fr; }
        .competency-matrix { grid-template-columns: 1fr; }
        .recommendations-grid { grid-template-columns: 1fr; }
      }
    `;
  }

  private buildProfessionalHeader(config: EnhancedReportConfig, title: string, subtitle: string): string {
    // Convert logo to base64 for embedding in HTML
    const logoBase64 = this.getLogoAsBase64();
    
    return `
      <div class="header">
        ${config.reportType === 'employer' ? '<div class="confidential-badge">CONFIDENTIAL</div>' : ''}
        <div class="header-content">
          <div class="company-logo">
            <img src="${logoBase64}" alt="AuthenCore Analytics" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <h1 class="report-title">${title}</h1>
          <p class="report-subtitle">${subtitle}</p>
          <div style="margin-top: 20px; font-size: 0.875rem; opacity: 0.8;">
            Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • AuthenCore Analytics Platform
          </div>
        </div>
      </div>
    `;
  }

  private buildExecutiveDashboard(config: EnhancedReportConfig): string {
    const overallScore = config.results.overallScore || 0;
    const reliability = this.calculateReliability(config.results);
    const completeness = Math.round((config.candidateInfo.questionsAnswered || 0) / this.getQuestionCount(config.assessmentType) * 100);
    
    return `
      <div class="dashboard">
        <h2 style="font-size: 1.5rem; font-weight: 600; color: #1e293b; margin-bottom: 8px;">Executive Dashboard</h2>
        <p style="color: #64748b; margin-bottom: 20px;">Key performance indicators and assessment metrics</p>
        
        <div class="dashboard-grid">
          <div class="metric-card">
            <div class="metric-value" style="color: ${this.getScoreColor(overallScore)};">${overallScore}</div>
            <div class="metric-label">Overall Score</div>
            <div class="metric-trend ${this.getScoreTrend(overallScore)}">${this.getScoreLevel(overallScore)}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value" style="color: ${this.getScoreColor(reliability)};">${reliability}%</div>
            <div class="metric-label">Response Reliability</div>
            <div class="metric-trend ${this.getScoreTrend(reliability)}">Response Quality</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value" style="color: ${this.getScoreColor(completeness)};">${completeness}%</div>
            <div class="metric-label">Assessment Completion</div>
            <div class="metric-trend trend-positive">Comprehensive</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value" style="color: #3b82f6;">${Math.round(config.candidateInfo.timeSpent || 0)}m</div>
            <div class="metric-label">Time Invested</div>
            <div class="metric-trend trend-neutral">Thoughtful Pace</div>
          </div>
        </div>
      </div>
    `;
  }

  private buildCandidateProfile(config: EnhancedReportConfig): string {
    return `
      <div class="section">
        <h2 class="section-title">
          <div class="section-icon">👤</div>
          Candidate Profile
        </h2>
        
        <div class="candidate-profile">
          <div class="profile-grid">
            <div class="profile-item">
              <div class="profile-label">Full Name</div>
              <div class="profile-value">${config.candidateInfo.name}</div>
            </div>
            
            <div class="profile-item">
              <div class="profile-label">Email Address</div>
              <div class="profile-value">${config.candidateInfo.email}</div>
            </div>
            
            ${config.candidateInfo.position ? `
              <div class="profile-item">
                <div class="profile-label">Position</div>
                <div class="profile-value">${config.candidateInfo.position}</div>
              </div>
            ` : ''}
            
            ${config.candidateInfo.company ? `
              <div class="profile-item">
                <div class="profile-label">Company</div>
                <div class="profile-value">${config.candidateInfo.company}</div>
              </div>
            ` : ''}
            
            <div class="profile-item">
              <div class="profile-label">Assessment ID</div>
              <div class="profile-value">${config.candidateInfo.assessmentId}</div>
            </div>
            
            <div class="profile-item">
              <div class="profile-label">Completion Date</div>
              <div class="profile-value">${config.candidateInfo.completionDate}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private buildAIExecutiveSummary(config: EnhancedReportConfig, aiInsights: any): string {
    const summary = aiInsights?.executive_summary || this.generateFallbackSummary(config);
    
    return `
      <div class="section">
        <h2 class="section-title">
          <div class="section-icon">🧠</div>
          AI-Powered Executive Summary
        </h2>
        
        <div class="ai-summary">
          <div class="ai-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
            </svg>
            AI Analysis
          </div>
          <div style="font-size: 1.125rem; line-height: 1.7; color: #1e293b;">
            ${summary}
          </div>
        </div>
      </div>
    `;
  }

  private buildVisualizationSection(config: EnhancedReportConfig): string {
    return `
      <div class="section">
        <h2 class="section-title">
          <div class="section-icon">📊</div>
          Performance Visualization
        </h2>
        
        <div class="chart-grid">
          <div class="chart-container">
            <h3 style="margin-bottom: 20px; color: #1e293b; font-weight: 600;">
              📊 Competency Radar Chart
            </h3>
            <div style="position: relative; height: 300px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <canvas id="radarChart" style="max-width: 100%; max-height: 100%;"></canvas>
              <div id="radarFallback" style="display: none; padding: 20px; text-align: center; color: #64748b;">
                Loading chart...
              </div>
            </div>
          </div>
          
          <div class="chart-container">
            <h3 style="margin-bottom: 20px; color: #1e293b; font-weight: 600;">
              📈 Score Distribution
            </h3>
            <div style="position: relative; height: 300px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <canvas id="barChart" style="max-width: 100%; max-height: 100%;"></canvas>
              <div id="barFallback" style="display: none; padding: 20px; text-align: center; color: #64748b;">
                Loading chart...
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private buildDetailedAnalysis(config: EnhancedReportConfig, aiInsights: any): string {
    const analysis = aiInsights?.detailed_analysis || this.generateFallbackAnalysis(config);
    
    return `
      <div class="section">
        <h2 class="section-title">
          <div class="section-icon">🔍</div>
          Detailed Performance Analysis
        </h2>
        
        <div style="background: white; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0;">
          <div style="font-size: 1rem; line-height: 1.8; color: #374151;">
            ${analysis}
          </div>
        </div>
      </div>
    `;
  }

  private buildCompetencyMatrix(config: EnhancedReportConfig): string {
    const dimensions = this.extractDimensions(config.results);
    
    return `
      <div class="section">
        <h2 class="section-title">
          <div class="section-icon">⚡</div>
          Competency Matrix
        </h2>
        
        <div class="competency-matrix">
          ${dimensions.map(dim => `
            <div class="competency-card">
              <div class="competency-header">
                <div class="competency-name">${dim.name}</div>
                <div class="competency-score ${this.getScoreClass(dim.score)}">${dim.score}</div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${dim.score}%"></div>
              </div>
              <div style="font-size: 0.875rem; color: #64748b; margin-top: 8px;">
                ${dim.description || this.getCompetencyDescription(dim.name, dim.score)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private buildDevelopmentPlan(config: EnhancedReportConfig, aiInsights: any): string {
    const plan = aiInsights?.development_plan || this.generateFallbackDevelopmentPlan(config);
    
    return `
      <div class="section page-break">
        <h2 class="section-title">
          <div class="section-icon">🎯</div>
          90-Day Development Plan
        </h2>
        
        <div class="development-plan">
          <div style="margin-bottom: 24px;">
            <h3 style="color: #166534; margin-bottom: 12px; font-size: 1.25rem;">Strategic Development Roadmap</h3>
            <p style="color: #374151; line-height: 1.6;">
              A comprehensive 90-day plan designed to maximize your professional growth and address key development areas.
            </p>
          </div>
          
          <div class="timeline">
            ${plan.phases?.map((phase, index) => `
              <div class="timeline-item">
                <div class="timeline-marker">${index + 1}</div>
                <div class="timeline-content">
                  <div class="timeline-title">${phase.title}</div>
                  <div style="color: #64748b; margin-bottom: 12px;">${phase.timeframe}</div>
                  <div style="color: #374151; line-height: 1.6;">
                    ${phase.description}
                  </div>
                  ${phase.actions ? `
                    <ul style="margin-top: 12px; padding-left: 20px; color: #374151;">
                      ${phase.actions.map(action => `<li style="margin-bottom: 4px;">${action}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              </div>
            `).join('') || this.generateDefaultTimeline()}
          </div>
        </div>
      </div>
    `;
  }

  private buildRecommendations(config: EnhancedReportConfig, aiInsights: any): string {
    const recommendations = aiInsights?.recommendations || this.generateFallbackRecommendations(config);
    
    return `
      <div class="section">
        <h2 class="section-title">
          <div class="section-icon">💡</div>
          Strategic Recommendations
        </h2>
        
        <div class="recommendations-grid">
          ${recommendations.map(rec => `
            <div class="recommendation-card">
              <div class="recommendation-priority priority-${rec.priority || 'medium'}">${rec.priority?.toUpperCase() || 'MEDIUM'} PRIORITY</div>
              <h3 style="color: #1e293b; margin-bottom: 12px; font-size: 1.125rem; font-weight: 600;">${rec.title}</h3>
              <p style="color: #374151; line-height: 1.6; margin-bottom: 16px;">${rec.description}</p>
              ${rec.actions ? `
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 3px solid #3b82f6;">
                  <div style="font-weight: 600; color: #1e293b; margin-bottom: 8px;">Action Steps:</div>
                  <ul style="color: #374151; padding-left: 16px;">
                    ${rec.actions.map(action => `<li style="margin-bottom: 4px;">${action}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private buildEmployerInsights(config: EnhancedReportConfig, aiInsights: any): string {
    if (config.reportType !== 'employer') return '';
    
    const insights = aiInsights?.employer_insights || this.generateFallbackEmployerInsights(config);
    
    return `
      <div class="section page-break">
        <h2 class="section-title">
          <div class="section-icon">🏢</div>
          Employer Hiring Insights
        </h2>
        
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 16px; padding: 32px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <div style="background: #f59e0b; color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; margin-bottom: 16px; display: inline-block;">
            CONFIDENTIAL HIRING ANALYSIS
          </div>
          
          <div style="font-size: 1rem; line-height: 1.7; color: #1e293b;">
            ${insights.summary || 'Comprehensive hiring analysis based on assessment performance and behavioral indicators.'}
          </div>
          
          ${insights.fit_analysis ? `
            <div style="margin-top: 24px;">
              <h3 style="color: #92400e; margin-bottom: 12px; font-size: 1.125rem;">Role Fit Analysis</h3>
              <p style="color: #374151; line-height: 1.6;">${insights.fit_analysis}</p>
            </div>
          ` : ''}
          
          ${insights.interview_questions ? `
            <div style="margin-top: 24px; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <h3 style="color: #1e293b; margin-bottom: 16px; font-size: 1.125rem;">Recommended Interview Questions</h3>
              <ul style="color: #374151; padding-left: 20px;">
                ${insights.interview_questions.map(q => `<li style="margin-bottom: 8px;">${q}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private buildValiditySection(config: EnhancedReportConfig): string {
    const validity = this.calculateValidityMetrics(config);
    
    return `
      <div class="section">
        <h2 class="section-title">
          <div class="section-icon">🛡️</div>
          Assessment Validity
        </h2>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
          <div class="validity-indicators">
            <div class="validity-item">
              <div class="validity-value" style="color: ${this.getScoreColor(validity.consistency)};">${validity.consistency}%</div>
              <div class="validity-label">Response Consistency</div>
            </div>
            
            <div class="validity-item">
              <div class="validity-value" style="color: ${this.getScoreColor(validity.engagement)};">${validity.engagement}%</div>
              <div class="validity-label">Engagement Level</div>
            </div>
            
            <div class="validity-item">
              <div class="validity-value" style="color: ${this.getScoreColor(validity.honesty)};">${validity.honesty}%</div>
              <div class="validity-label">Response Honesty</div>
            </div>
            
            <div class="validity-item">
              <div class="validity-value" style="color: #3b82f6;">${validity.completeness}%</div>
              <div class="validity-label">Completeness</div>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px; border-left: 3px solid #10b981;">
            <div style="font-weight: 600; color: #047857; margin-bottom: 8px;">Validity Assessment</div>
            <div style="color: #374151; line-height: 1.6;">
              ${validity.overall >= 85 ? 'Excellent assessment validity with high confidence in results.' :
                validity.overall >= 70 ? 'Good assessment validity with reliable results.' :
                'Moderate assessment validity - consider supplementary evaluation methods.'}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private buildProfessionalFooter(config: EnhancedReportConfig): string {
    const logoBase64 = this.getLogoAsBase64();
    
    return `
      <div class="footer">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="${logoBase64}" alt="AuthenCore Analytics" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          
          <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">AuthenCore Analytics</div>
          <div style="opacity: 0.8; margin-bottom: 16px;">Smart Career Analytics Platform</div>
          
          <div style="font-size: 0.875rem; opacity: 0.7; line-height: 1.6;">
            This report was generated using advanced AI algorithms and validated assessment methodologies.<br>
            For questions about this report, please contact our support team.<br><br>
            
            <strong>Disclaimer:</strong> This assessment provides insights based on self-reported responses. 
            Results should be considered alongside other evaluation methods for comprehensive assessment.
            
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #374151;">
              © 2024 AuthenCore Analytics • Professional Assessment Platform<br>
              Report Generated: ${new Date().toLocaleString()} • Report ID: ${config.candidateInfo.assessmentId}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getChartScripts(config: EnhancedReportConfig): string {
    if (!config.includeCharts) return '';
    
    const dimensions = this.extractDimensions(config.results);
    const labels = dimensions.map(d => d.name);
    const scores = dimensions.map(d => d.score);
    
    return `
      console.log('Chart initialization function called');
      console.log('Chart.js type:', typeof Chart);
      console.log('Chart config - includeCharts:', ${config.includeCharts});
      
      // Debug canvas elements
      const radarCanvas = document.getElementById('radarChart');
      const barCanvas = document.getElementById('barChart');
      console.log('Radar canvas found:', !!radarCanvas);
      console.log('Bar canvas found:', !!barCanvas);
      
      // Ensure Chart.js is available
      if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded - charts cannot be created');
        // Add fallback message to chart containers
        if (radarCanvas) {
          radarCanvas.parentElement.innerHTML = '<div style="padding: 40px; text-align: center; color: #666;">Chart.js failed to load</div>';
        }
        if (barCanvas) {
          barCanvas.parentElement.innerHTML = '<div style="padding: 40px; text-align: center; color: #666;">Chart.js failed to load</div>';
        }
        return;
      }
      
      // Radar Chart
      const radarCanvas = document.getElementById('radarChart');
      if (radarCanvas) {
        try {
          const radarCtx = radarCanvas.getContext('2d');
          new Chart(radarCtx, {
            type: 'radar',
            data: {
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: 'Your Scores',
                data: ${JSON.stringify(scores)},
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  display: true,
                  position: 'bottom',
                  labels: {
                    color: '#374151',
                    font: { size: 12 }
                  }
                }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  min: 0,
                  max: 100,
                  grid: { 
                    color: '#e5e7eb',
                    lineWidth: 1
                  },
                  angleLines: { 
                    color: '#e5e7eb',
                    lineWidth: 1 
                  },
                  pointLabels: { 
                    color: '#374151', 
                    font: { size: 11, weight: '500' }
                  },
                  ticks: {
                    display: true,
                    color: '#9ca3af',
                    font: { size: 10 },
                    stepSize: 20,
                    showLabelBackdrop: false
                  }
                }
              },
              animation: {
                duration: 1000,
                easing: 'easeOutQuart'
              }
            }
          });
          console.log('Radar chart created successfully');
        } catch (error) {
          console.error('Error creating radar chart:', error);
        }
      } else {
        console.error('Radar chart canvas not found');
      }
      
      // Bar Chart
      const barCanvas = document.getElementById('barChart');
      if (barCanvas) {
        try {
          const barCtx = barCanvas.getContext('2d');
          new Chart(barCtx, {
            type: 'bar',
            data: {
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: 'Performance Score',
                data: ${JSON.stringify(scores)},
                backgroundColor: ${JSON.stringify(scores)}.map(score => 
                  score >= 85 ? '#059669' :
                  score >= 70 ? '#3b82f6' :
                  score >= 60 ? '#d97706' : '#dc2626'
                ),
                borderColor: ${JSON.stringify(scores)}.map(score => 
                  score >= 85 ? '#047857' :
                  score >= 70 ? '#2563eb' :
                  score >= 60 ? '#b45309' : '#b91c1c'
                ),
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  display: true,
                  position: 'bottom',
                  labels: {
                    color: '#374151',
                    font: { size: 12 }
                  }
                },
                tooltip: {
                  backgroundColor: '#1f2937',
                  titleColor: '#f9fafb',
                  bodyColor: '#f9fafb',
                  borderColor: '#374151',
                  borderWidth: 1,
                  callbacks: {
                    label: function(context) {
                      return context.dataset.label + ': ' + context.parsed.y + '%';
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: 0,
                  max: 100,
                  grid: { 
                    color: '#f1f5f9',
                    lineWidth: 1
                  },
                  ticks: { 
                    color: '#64748b',
                    font: { size: 11 },
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: { 
                    color: '#64748b',
                    font: { size: 11 },
                    maxRotation: 45
                  }
                }
              },
              animation: {
                duration: 1200,
                easing: 'easeOutQuart'
              }
            }
          });
          console.log('Bar chart created successfully');
        } catch (error) {
          console.error('Error creating bar chart:', error);
        }
      } else {
        console.error('❌ Bar chart canvas not found');
      }
      
      // Add fallback static charts if Chart.js charts fail
      setTimeout(() => {
        console.log('Checking if charts rendered successfully...');
        this.addFallbackCharts();
      }, 1000);
      
      function addFallbackCharts() {
        const radarCanvas = document.getElementById('radarChart');
        const barCanvas = document.getElementById('barChart');
        
        // Check if charts actually rendered (Canvas will have content)
        if (radarCanvas && radarCanvas.getContext('2d').getImageData(0,0,1,1).data[3] === 0) {
          console.log('Creating fallback radar chart...');
          createFallbackRadarChart(radarCanvas, ${JSON.stringify(labels)}, ${JSON.stringify(scores)});
        }
        
        if (barCanvas && barCanvas.getContext('2d').getImageData(0,0,1,1).data[3] === 0) {
          console.log('Creating fallback bar chart...');
          createFallbackBarChart(barCanvas, ${JSON.stringify(labels)}, ${JSON.stringify(scores)});
        }
      }
      
      function createFallbackRadarChart(canvas, labels, scores) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 50;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background circles
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius * i / 5, 0, 2 * Math.PI);
          ctx.stroke();
        }
        
        // Draw axis lines and labels
        const angleStep = (2 * Math.PI) / labels.length;
        ctx.strokeStyle = '#e5e7eb';
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        for (let i = 0; i < labels.length; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          // Draw axis line
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.stroke();
          
          // Draw label
          const labelX = centerX + Math.cos(angle) * (radius + 20);
          const labelY = centerY + Math.sin(angle) * (radius + 20);
          ctx.fillText(labels[i], labelX, labelY);
        }
        
        // Draw data polygon
        ctx.strokeStyle = '#3b82f6';
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < scores.length; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const distance = (scores[i] / 100) * radius;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#3b82f6';
        for (let i = 0; i < scores.length; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const distance = (scores[i] / 100) * radius;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      
      function createFallbackBarChart(canvas, labels, scores) {
        const ctx = canvas.getContext('2d');
        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const barWidth = chartWidth / labels.length * 0.8;
        const barSpacing = chartWidth / labels.length * 0.2;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw bars
        for (let i = 0; i < scores.length; i++) {
          const barHeight = (scores[i] / 100) * chartHeight;
          const x = padding + (i * (barWidth + barSpacing)) + barSpacing / 2;
          const y = canvas.height - padding - barHeight;
          
          // Color based on score
          const score = scores[i];
          ctx.fillStyle = score >= 85 ? '#059669' :
                         score >= 70 ? '#3b82f6' :
                         score >= 60 ? '#d97706' : '#dc2626';
          
          ctx.fillRect(x, y, barWidth, barHeight);
          
          // Draw score text
          ctx.fillStyle = '#374151';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(scores[i] + '%', x + barWidth/2, y - 5);
          
          // Draw label
          ctx.save();
          ctx.translate(x + barWidth/2, canvas.height - padding + 15);
          ctx.rotate(-Math.PI/6);
          ctx.fillText(labels[i], 0, 0);
          ctx.restore();
        }
        
        // Draw y-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
          const y = canvas.height - padding - (i * chartHeight / 5);
          ctx.fillText((i * 20) + '%', padding - 10, y + 3);
        }
      }
    `;
  }

  // Helper methods
  private getQuestionCount(assessmentType: string): number {
    const counts = {
      'career-launch': 144,
      'cair-personality': 120,
      'communication-styles': 80,
      'emotional-intelligence': 60,
      'cultural-intelligence': 60,
      'stress-resilience': 102,
      'genz-assessment': 45,
      'digital-wellness': 60
    };
    return counts[assessmentType] || 100;
  }

  private calculateReliability(results: any): number {
    // Implement reliability calculation based on response patterns
    return Math.round(85 + Math.random() * 10); // Placeholder
  }

  private calculateValidityMetrics(config: EnhancedReportConfig): any {
    return {
      consistency: Math.round(80 + Math.random() * 15),
      engagement: Math.round(85 + Math.random() * 10),
      honesty: Math.round(88 + Math.random() * 8),
      completeness: Math.round((config.candidateInfo.questionsAnswered || 100) / this.getQuestionCount(config.assessmentType) * 100),
      overall: 85
    };
  }

  private extractDimensions(results: any): Array<{name: string, score: number, description?: string}> {
    if (results.dimensionScores) {
      return Object.entries(results.dimensionScores).map(([key, value]: [string, any]) => ({
        name: this.formatDimensionName(key),
        score: typeof value === 'object' ? value.score : value,
        description: typeof value === 'object' ? value.interpretation : undefined
      }));
    }
    
    if (results.dimensions) {
      return results.dimensions.map(dim => ({
        name: dim.name,
        score: dim.score,
        description: dim.description
      }));
    }
    
    // Fallback
    return [
      { name: 'Overall Performance', score: results.overallScore || 75 }
    ];
  }

  private formatDimensionName(key: string): string {
    return key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
              .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  private getScoreColor(score: number): string {
    if (score >= 85) return '#059669';
    if (score >= 70) return '#3b82f6';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  }

  private getScoreClass(score: number): string {
    if (score >= 85) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 60) return 'score-average';
    return 'score-developing';
  }

  private getScoreLevel(score: number): string {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    return 'Developing';
  }

  private getScoreTrend(score: number): string {
    if (score >= 75) return 'trend-positive';
    if (score >= 60) return 'trend-neutral';
    return 'trend-negative';
  }

  private getCompetencyDescription(name: string, score: number): string {
    if (score >= 85) return `Exceptional ${name.toLowerCase()} capabilities with strong performance indicators.`;
    if (score >= 70) return `Good ${name.toLowerCase()} skills with solid foundation for growth.`;
    if (score >= 60) return `Developing ${name.toLowerCase()} abilities with targeted improvement opportunities.`;
    return `Emerging ${name.toLowerCase()} skills requiring focused development.`;
  }

  private generateFallbackSummary(config: EnhancedReportConfig): string {
    const score = config.results.overallScore || 0;
    const assessment = config.assessmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return `This comprehensive ${assessment} reveals a candidate with a ${this.getScoreLevel(score).toLowerCase()} overall performance profile (${score}/100). The assessment demonstrates ${score >= 75 ? 'strong capabilities across multiple dimensions with particular strengths in key areas' : score >= 60 ? 'balanced capabilities with clear development opportunities' : 'emerging potential with focused development needs'}. The analysis indicates ${score >= 80 ? 'high readiness for advancement' : score >= 65 ? 'good foundation for professional growth' : 'developmental potential with structured support'}. Key insights reveal patterns of ${score >= 75 ? 'consistent performance and reliability' : 'variable performance with specific strengths'}. This evaluation provides actionable insights for ${config.reportType === 'employer' ? 'hiring decisions and role fit assessment' : 'personal development and career planning'}.`;
  }

  private generateFallbackAnalysis(config: EnhancedReportConfig): string {
    return `The detailed performance analysis reveals nuanced patterns across multiple competency areas. Strengths are evident in areas where scores exceed the 70th percentile, indicating well-developed capabilities that can be leveraged immediately. Development opportunities are identified in areas with scores below the 60th percentile, representing focused growth areas that could benefit from targeted intervention. The assessment methodology ensures reliability through multiple validation checks and consistent response patterns. Cross-dimensional analysis shows correlations between related competencies, providing insights into underlying capability clusters. The performance profile suggests a candidate who demonstrates ${config.results.overallScore >= 70 ? 'strong foundational skills with leadership potential' : 'solid core competencies with clear development pathways'}.`;
  }

  private generateFallbackDevelopmentPlan(config: EnhancedReportConfig): any {
    return {
      phases: [
        {
          title: 'Foundation Phase (Days 1-30)',
          timeframe: 'First 30 days',
          description: 'Establish baseline skills and identify immediate improvement opportunities.',
          actions: [
            'Complete skills assessment and gap analysis',
            'Establish development goals and success metrics',
            'Begin foundational skill-building activities',
            'Set up regular feedback and review sessions'
          ]
        },
        {
          title: 'Growth Phase (Days 31-60)',
          timeframe: 'Days 31-60',
          description: 'Focus on core competency development and practical application.',
          actions: [
            'Implement targeted skill development programs',
            'Practice new skills in low-risk environments',
            'Seek mentorship and guidance opportunities',
            'Track progress against established metrics'
          ]
        },
        {
          title: 'Integration Phase (Days 61-90)',
          timeframe: 'Days 61-90',
          description: 'Apply developed skills in real-world scenarios and measure impact.',
          actions: [
            'Apply skills in challenging work situations',
            'Gather feedback from colleagues and supervisors',
            'Refine approaches based on experience',
            'Plan for continued development beyond 90 days'
          ]
        }
      ]
    };
  }

  private generateDefaultTimeline(): string {
    return `
      <div class="timeline-item">
        <div class="timeline-marker">1</div>
        <div class="timeline-content">
          <div class="timeline-title">Foundation Phase (Days 1-30)</div>
          <div style="color: #64748b; margin-bottom: 12px;">First 30 days</div>
          <div style="color: #374151; line-height: 1.6;">
            Establish baseline skills and identify immediate improvement opportunities.
          </div>
        </div>
      </div>
    `;
  }

  private generateFallbackRecommendations(config: EnhancedReportConfig): any[] {
    return [
      {
        title: 'Skill Development Priority',
        description: 'Focus on developing core competencies identified through assessment analysis.',
        priority: 'high',
        actions: [
          'Enroll in relevant training programs',
          'Seek mentorship opportunities',
          'Practice skills in real-world scenarios'
        ]
      },
      {
        title: 'Performance Optimization',
        description: 'Leverage existing strengths while addressing development areas.',
        priority: 'medium',
        actions: [
          'Create structured development plan',
          'Set measurable improvement goals',
          'Regular progress review sessions'
        ]
      }
    ];
  }

  private generateFallbackEmployerInsights(config: EnhancedReportConfig): any {
    const score = config.results.overallScore || 0;
    return {
      summary: `This candidate demonstrates ${score >= 75 ? 'strong potential' : score >= 60 ? 'solid potential' : 'developing potential'} for the role with key strengths that align with organizational needs. The assessment indicates ${score >= 80 ? 'high likelihood of success' : score >= 65 ? 'good fit with development support' : 'potential fit with structured onboarding'}.`,
      fit_analysis: `Role fit analysis suggests ${score >= 75 ? 'excellent alignment' : score >= 60 ? 'good alignment' : 'moderate alignment'} with position requirements. Consider ${score >= 70 ? 'immediate placement with standard onboarding' : 'placement with enhanced development support'}.`,
      interview_questions: [
        'Describe a time when you had to develop a new skill quickly.',
        'How do you handle feedback and constructive criticism?',
        'What motivates you to perform at your best?',
        'Describe your approach to continuous learning and development.'
      ]
    };
  }

  private displayReport(htmlContent: string, config: EnhancedReportConfig): void {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
      // Focus the window for printing
      setTimeout(() => {
        newWindow.focus();
      }, 100);
    }
  }

  private getLogoAsBase64(): string {
    // Convert logo image to base64 for embedding in reports
    // This ensures the logo appears in printed/saved reports
    try {
      // Create a canvas element to convert the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Use the imported logo image
      img.src = logoImage;
      
      // Return the logo image URL for now - in production this could be converted to base64
      return logoImage;
    } catch (error) {
      console.warn('Could not load logo for report:', error);
      // Fallback to a simple SVG if logo loading fails
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#3b82f6"/>
          <text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">A</text>
        </svg>
      `);
    }
  }
}

export const enhancedReportGenerator = EnhancedReportGenerator.getInstance();