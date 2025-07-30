// Unified Report Generator
// Handles all report generation with consistent structure and formatting

import { UnifiedAssessmentResults, UnifiedReportConfig } from '@/types/unifiedAssessment.types';
import { toast } from 'sonner';

export class UnifiedReportGenerator {
  private static instance: UnifiedReportGenerator;
  
  static getInstance(): UnifiedReportGenerator {
    if (!UnifiedReportGenerator.instance) {
      UnifiedReportGenerator.instance = new UnifiedReportGenerator();
    }
    return UnifiedReportGenerator.instance;
  }

  async generateReport(config: UnifiedReportConfig): Promise<void> {
    try {
      const htmlContent = this.buildReportHTML(config);
      this.displayReport(htmlContent, config);
      toast.success(`${config.reportType} report generated successfully!`);
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
      throw error;
    }
  }

  private buildReportHTML(config: UnifiedReportConfig): string {
    const { results, reportType, assessmentType, template = 'standard' } = config;
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${this.getReportTitle(assessmentType, reportType)}</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${this.getReportStyles(template, config.branding)}</style>
</head>
<body>
  <div class="report-container">
    ${this.buildHeader(results, config)}
    ${this.buildCandidateInfo(results.candidateInfo)}
    ${this.buildExecutiveSummary(results, reportType)}
    ${this.buildOverallScore(results)}
    ${this.buildDimensionAnalysis(results, reportType)}
    ${config.includeCharts ? this.buildVisualizations(results) : ''}
    ${this.buildInsights(results, reportType)}
    ${this.buildValidityAssessment(results, reportType)}
    ${config.includeActionPlan ? this.buildActionPlan(results, reportType) : ''}
    ${config.includeRecommendations ? this.buildRecommendations(results, reportType) : ''}
    ${reportType === 'employer' ? this.buildEmployerSection(results) : ''}
    ${this.buildFooter(config)}
  </div>
</body>
</html>`;
  }

  private getReportTitle(assessmentType: string, reportType: string): string {
    const assessmentNames: Record<string, string> = {
      'career-launch': 'Career Launch Assessment',
      'communication': 'Communication Styles Assessment',
      'leadership': 'Leadership Assessment',
      'genz': 'Gen Z Workplace Assessment',
      'cultural': 'Cultural Intelligence Assessment',
      'emotional': 'Emotional Intelligence Assessment',
      'stress': 'Stress Resilience Assessment',
      'faith-values': 'Faith & Values Assessment',
      'digital': 'Digital Wellness Assessment'
    };

    const name = assessmentNames[assessmentType] || 'Professional Assessment';
    const type = reportType === 'employer' ? 'Employer Report' : 'Individual Report';
    return `${name} - ${type}`;
  }

  private getReportStyles(template: string, branding?: any): string {
    const primaryColor = branding?.colors?.primary || '#008080';
    const secondaryColor = branding?.colors?.secondary || '#20B2AA';
    
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        background: #fff;
      }
      .report-container { 
        max-width: 900px; 
        margin: 0 auto; 
        padding: 40px 30px; 
      }
      .header { 
        text-align: center; 
        border-bottom: 3px solid ${primaryColor}; 
        padding-bottom: 30px; 
        margin-bottom: 40px; 
      }
      .header h1 { 
        color: ${primaryColor}; 
        font-size: 2.5em; 
        margin-bottom: 10px; 
        font-weight: 300;
      }
      .header .subtitle { 
        color: #666; 
        font-size: 1.2em; 
        font-weight: 300;
      }
      .section { 
        margin-bottom: 40px; 
        page-break-inside: avoid; 
      }
      .section h2 { 
        color: ${primaryColor}; 
        font-size: 1.8em; 
        margin-bottom: 20px; 
        border-left: 4px solid ${primaryColor}; 
        padding-left: 15px;
        font-weight: 400;
      }
      .section h3 { 
        color: ${secondaryColor}; 
        font-size: 1.3em; 
        margin: 25px 0 15px 0; 
        font-weight: 500;
      }
      .candidate-info { 
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
        padding: 25px; 
        border-radius: 12px; 
        margin-bottom: 30px;
        border-left: 5px solid ${primaryColor};
      }
      .candidate-info h2 { 
        border: none; 
        padding: 0; 
        margin-bottom: 15px; 
      }
      .info-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 15px; 
      }
      .info-item { 
        display: flex; 
        flex-direction: column; 
      }
      .info-label { 
        font-weight: 600; 
        color: #495057; 
        font-size: 0.9em; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
      }
      .info-value { 
        font-size: 1.1em; 
        color: #212529; 
        margin-top: 2px;
      }
      .overall-score { 
        text-align: center; 
        background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); 
        color: white; 
        padding: 40px; 
        border-radius: 15px; 
        margin: 30px 0; 
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      }
      .score-circle { 
        width: 120px; 
        height: 120px; 
        border: 8px solid rgba(255,255,255,0.3); 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        margin: 0 auto 20px; 
        background: rgba(255,255,255,0.1);
      }
      .score-number { 
        font-size: 2.5em; 
        font-weight: 600; 
      }
      .score-label { 
        font-size: 1.3em; 
        opacity: 0.9; 
        font-weight: 300;
      }
      .dimension-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
        gap: 25px; 
        margin: 25px 0; 
      }
      .dimension-card { 
        background: #fff; 
        border: 1px solid #e9ecef; 
        border-radius: 12px; 
        padding: 25px; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
      }
      .dimension-card:hover { 
        transform: translateY(-2px); 
        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
      }
      .dimension-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 15px; 
      }
      .dimension-name { 
        font-size: 1.2em; 
        font-weight: 600; 
        color: #212529; 
      }
      .dimension-score { 
        font-size: 1.5em; 
        font-weight: 700; 
        color: ${primaryColor}; 
      }
      .score-bar { 
        width: 100%; 
        height: 12px; 
        background: #e9ecef; 
        border-radius: 6px; 
        overflow: hidden; 
        margin: 15px 0; 
      }
      .score-fill { 
        height: 100%; 
        background: linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%); 
        transition: width 0.3s ease;
      }
      .dimension-level { 
        display: inline-block; 
        padding: 4px 12px; 
        border-radius: 20px; 
        font-size: 0.85em; 
        font-weight: 600; 
        text-transform: uppercase; 
        letter-spacing: 0.5px;
      }
      .level-high { 
        background: #d4edda; 
        color: #155724; 
      }
      .level-medium { 
        background: #fff3cd; 
        color: #856404; 
      }
      .level-low { 
        background: #f8d7da; 
        color: #721c24; 
      }
      .dimension-description { 
        color: #6c757d; 
        margin: 15px 0; 
        line-height: 1.6;
      }
      .strength-list, .growth-list, .recommendation-list { 
        list-style: none; 
        margin: 10px 0; 
      }
      .strength-list li, .growth-list li, .recommendation-list li { 
        padding: 8px 0; 
        padding-left: 20px; 
        position: relative; 
        border-bottom: 1px solid #f1f3f4;
      }
      .strength-list li:before { 
        content: "✓"; 
        position: absolute; 
        left: 0; 
        color: #28a745; 
        font-weight: bold; 
      }
      .growth-list li:before { 
        content: "→"; 
        position: absolute; 
        left: 0; 
        color: #ffc107; 
        font-weight: bold; 
      }
      .recommendation-list li:before { 
        content: "●"; 
        position: absolute; 
        left: 0; 
        color: ${primaryColor}; 
        font-weight: bold; 
      }
      .validity-section { 
        background: #f8f9fa; 
        padding: 25px; 
        border-radius: 12px; 
        border-left: 5px solid #6c757d;
      }
      .validity-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
        gap: 20px; 
        margin-top: 20px; 
      }
      .validity-item { 
        text-align: center; 
      }
      .validity-value { 
        font-size: 1.8em; 
        font-weight: 600; 
        color: ${primaryColor}; 
      }
      .validity-label { 
        font-size: 0.9em; 
        color: #6c757d; 
        margin-top: 5px;
      }
      .action-plan { 
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); 
        padding: 30px; 
        border-radius: 12px; 
        margin: 30px 0;
      }
      .action-column { 
        margin: 20px 0; 
      }
      .action-timeline { 
        font-weight: 600; 
        color: #1976d2; 
        margin-bottom: 10px; 
        font-size: 1.1em;
      }
      .employer-section { 
        background: #fff3e0; 
        padding: 30px; 
        border-radius: 12px; 
        border-left: 5px solid #ff9800;
      }
      .interview-questions { 
        background: #fff; 
        padding: 20px; 
        border-radius: 8px; 
        margin: 20px 0; 
        border: 1px solid #e0e0e0;
      }
      .footer { 
        text-align: center; 
        margin-top: 60px; 
        padding-top: 30px; 
        border-top: 2px solid #e9ecef; 
        color: #6c757d; 
        font-size: 0.9em;
      }
      .executive-summary { 
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
        padding: 30px; 
        border-radius: 12px; 
        margin: 30px 0; 
        border-left: 5px solid ${primaryColor};
      }
      .insights-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
        gap: 25px; 
        margin: 25px 0; 
      }
      .insight-card { 
        background: #fff; 
        padding: 25px; 
        border-radius: 12px; 
        border: 1px solid #dee2e6; 
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      .insight-header { 
        font-weight: 600; 
        color: ${primaryColor}; 
        margin-bottom: 15px; 
        font-size: 1.1em;
      }
      @media print { 
        body { font-size: 12px; } 
        .report-container { padding: 20px; } 
        .section { margin-bottom: 25px; } 
        .dimension-card { break-inside: avoid; }
        .overall-score { background: ${primaryColor} !important; }
      }
      @media (max-width: 768px) { 
        .report-container { padding: 20px 15px; } 
        .header h1 { font-size: 2em; } 
        .dimension-grid { grid-template-columns: 1fr; } 
        .info-grid { grid-template-columns: 1fr; }
      }
    `;
  }

  private buildHeader(results: UnifiedAssessmentResults, config: UnifiedReportConfig): string {
    const title = this.getReportTitle(config.assessmentType, config.reportType);
    const company = config.branding?.company || 'AuthenCore Analytics';
    
    return `
      <div class="header">
        ${config.branding?.logo ? `<img src="${config.branding.logo}" alt="Logo" style="max-height: 60px; margin-bottom: 20px;">` : ''}
        <h1>${title}</h1>
        <div class="subtitle">Professional Assessment Report • ${company}</div>
      </div>
    `;
  }

  private buildCandidateInfo(candidateInfo: any): string {
    return `
      <div class="candidate-info section">
        <h2>Candidate Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${candidateInfo.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${candidateInfo.email}</div>
          </div>
          ${candidateInfo.position ? `
            <div class="info-item">
              <div class="info-label">Position</div>
              <div class="info-value">${candidateInfo.position}</div>
            </div>
          ` : ''}
          <div class="info-item">
            <div class="info-label">Assessment Date</div>
            <div class="info-value">${candidateInfo.completionDate || new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    `;
  }

  private buildExecutiveSummary(results: UnifiedAssessmentResults, reportType: string): string {
    return `
      <div class="executive-summary section">
        <h2>Executive Summary</h2>
        <p style="font-size: 1.1em; line-height: 1.8; color: #495057;">
          ${results.reportData.executiveSummary}
        </p>
        ${reportType === 'employer' ? `
          <div style="margin-top: 20px; padding: 15px; background: rgba(0,128,128,0.1); border-radius: 8px;">
            <strong>Key Hiring Insights:</strong> ${results.insights.strengths.length} major strengths identified, 
            ${results.insights.challenges.length} development areas noted, overall recommendation: 
            ${results.overallScore >= 70 ? 'Strong candidate' : results.overallScore >= 50 ? 'Consider with development plan' : 'Requires significant development'}
          </div>
        ` : ''}
      </div>
    `;
  }

  private buildOverallScore(results: UnifiedAssessmentResults): string {
    const level = results.overallScore >= 70 ? 'Excellent' : results.overallScore >= 50 ? 'Good' : 'Developing';
    
    return `
      <div class="overall-score section">
        <h2 style="color: white; border: none; padding: 0;">Overall Assessment Score</h2>
        <div class="score-circle">
          <div class="score-number">${results.overallScore}</div>
        </div>
        <div class="score-label">${level} Performance • ${results.overallPercentile}th Percentile</div>
      </div>
    `;
  }

  private buildDimensionAnalysis(results: UnifiedAssessmentResults, reportType: string): string {
    const dimensionsHTML = results.dimensions.map(dimension => `
      <div class="dimension-card">
        <div class="dimension-header">
          <div class="dimension-name">${dimension.name}</div>
          <div class="dimension-score">${dimension.score}</div>
        </div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${dimension.score}%"></div>
        </div>
        <span class="dimension-level level-${dimension.level}">${dimension.level.toUpperCase()}</span>
        <div class="dimension-description">${dimension.description}</div>
        
        ${dimension.strengths.length > 0 ? `
          <h4 style="color: #28a745; margin: 15px 0 10px 0;">Strengths</h4>
          <ul class="strength-list">
            ${dimension.strengths.map(strength => `<li>${strength}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${dimension.growthAreas.length > 0 ? `
          <h4 style="color: #ffc107; margin: 15px 0 10px 0;">Growth Areas</h4>
          <ul class="growth-list">
            ${dimension.growthAreas.map(area => `<li>${area}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${reportType !== 'candidate' && dimension.recommendations.length > 0 ? `
          <h4 style="color: #008080; margin: 15px 0 10px 0;">Recommendations</h4>
          <ul class="recommendation-list">
            ${dimension.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <h2>Dimension Analysis</h2>
        <div class="dimension-grid">
          ${dimensionsHTML}
        </div>
      </div>
    `;
  }

  private buildInsights(results: UnifiedAssessmentResults, reportType: string): string {
    return `
      <div class="section">
        <h2>Key Insights</h2>
        <div class="insights-grid">
          <div class="insight-card">
            <div class="insight-header">Strengths</div>
            <ul class="strength-list">
              ${results.insights.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
          </div>
          
          <div class="insight-card">
            <div class="insight-header">Development Opportunities</div>
            <ul class="growth-list">
              ${results.insights.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
            </ul>
          </div>
          
          <div class="insight-card">
            <div class="insight-header">Recommendations</div>
            <ul class="recommendation-list">
              ${results.insights.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  private buildValidityAssessment(results: UnifiedAssessmentResults, reportType: string): string {
    if (reportType === 'candidate') return '';
    
    return `
      <div class="validity-section section">
        <h2>Assessment Validity</h2>
        <p>This section provides information about the reliability and validity of the assessment results.</p>
        <div class="validity-grid">
          <div class="validity-item">
            <div class="validity-value">${results.validityAssessment.consistencyScore}%</div>
            <div class="validity-label">Response Consistency</div>
          </div>
          <div class="validity-item">
            <div class="validity-value">${results.validityAssessment.completionRate}%</div>
            <div class="validity-label">Completion Rate</div>
          </div>
          <div class="validity-item">
            <div class="validity-value">${results.validityAssessment.engagementLevel.toUpperCase()}</div>
            <div class="validity-label">Engagement Level</div>
          </div>
          <div class="validity-item">
            <div class="validity-value">${results.validityAssessment.fakeGoodIndicator}</div>
            <div class="validity-label">Social Desirability</div>
          </div>
        </div>
        ${results.validityAssessment.flags.length > 0 ? `
          <div style="margin-top: 20px;">
            <h3>Validity Notes</h3>
            <ul>
              ${results.validityAssessment.flags.map(flag => `<li>${flag}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  private buildActionPlan(results: UnifiedAssessmentResults, reportType: string): string {
    if (reportType === 'employer') return '';
    
    return `
      <div class="action-plan section">
        <h2>Personal Development Action Plan</h2>
        <div class="action-column">
          <div class="action-timeline">Immediate Actions (Next 30 Days)</div>
          <ul class="recommendation-list">
            ${results.actionPlan.immediate.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
        
        <div class="action-column">
          <div class="action-timeline">Short-term Goals (3-6 Months)</div>
          <ul class="recommendation-list">
            ${results.actionPlan.shortTerm.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
        
        <div class="action-column">
          <div class="action-timeline">Long-term Development (6+ Months)</div>
          <ul class="recommendation-list">
            ${results.actionPlan.longTerm.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  private buildRecommendations(results: UnifiedAssessmentResults, reportType: string): string {
    return `
      <div class="section">
        <h2>${reportType === 'employer' ? 'Hiring & Management Recommendations' : 'Development Recommendations'}</h2>
        <ul class="recommendation-list" style="font-size: 1.1em;">
          ${results.insights.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  private buildEmployerSection(results: UnifiedAssessmentResults): string {
    return `
      <div class="employer-section section">
        <h2>Employer-Specific Insights</h2>
        
        <div class="interview-questions">
          <h3>Suggested Interview Questions</h3>
          <ol>
            ${results.reportData.interviewQuestions?.map(question => `<li>${question}</li>`).join('') || '<li>No specific questions generated</li>'}
          </ol>
        </div>
        
        <div style="margin-top: 25px;">
          <h3>Hiring Recommendations</h3>
          <ul class="recommendation-list">
            ${results.reportData.hiringRecommendations?.map(rec => `<li>${rec}</li>`).join('') || '<li>Standard hiring process recommended</li>'}
          </ul>
        </div>
        
        <div style="margin-top: 25px;">
          <h3>Onboarding Plan</h3>
          <ul class="recommendation-list">
            ${results.reportData.onboardingPlan?.map(plan => `<li>${plan}</li>`).join('') || '<li>Standard onboarding process recommended</li>'}
          </ul>
        </div>
      </div>
    `;
  }

  private buildVisualizations(results: UnifiedAssessmentResults): string {
    // Simplified visualization - in production would include actual charts
    return `
      <div class="section">
        <h2>Performance Visualization</h2>
        <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px;">
          <p style="color: #6c757d; font-style: italic;">
            Charts and visualizations would be rendered here in the full implementation.
          </p>
        </div>
      </div>
    `;
  }

  private buildFooter(config: UnifiedReportConfig): string {
    return `
      <div class="footer">
        <p>This report was generated on ${new Date().toLocaleDateString()} by ${config.branding?.company || 'AuthenCore Analytics'}</p>
        <p style="margin-top: 10px; font-size: 0.8em; color: #adb5bd;">
          This assessment is for professional development purposes. Results should be interpreted by qualified professionals.
        </p>
      </div>
    `;
  }

  private displayReport(htmlContent: string, config: UnifiedReportConfig): void {
    const reportWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      
      // Add print functionality
      reportWindow.onload = () => {
        const printButton = reportWindow.document.createElement('button');
        printButton.innerHTML = 'Print Report';
        printButton.style.cssText = `
          position: fixed; top: 20px; right: 20px; z-index: 1000;
          background: #008080; color: white; border: none; padding: 10px 20px;
          border-radius: 5px; cursor: pointer; font-size: 14px;
        `;
        printButton.onclick = () => reportWindow.print();
        reportWindow.document.body.appendChild(printButton);
      };
    } else {
      throw new Error('Unable to open report window');
    }
  }
}

export const unifiedReportGenerator = UnifiedReportGenerator.getInstance();