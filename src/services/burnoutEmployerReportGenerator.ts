import { formatPDFLegalFooter } from '@/utils/legalNotices';

export interface BurnoutEmployerReportConfig {
  candidateInfo: {
    name: string;
    email: string;
    position?: string;
    department?: string;
    assessmentDate: string;
  };
  results: {
    overallScore: number;
    percentileScore: number;
    burnoutRiskProfile: string;
    categoryScores: Array<{
      dimension: string;
      category: string;
      score: number;
      maxScore: number;
      percentage: number;
      level: string;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
    dimensionScores: Array<{
      dimension: string;
      category: string;
      score: number;
      maxScore: number;
      percentage: number;
      level: string;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    burnoutRisk: 'low' | 'medium' | 'high';
    wellnessLevel: 'excellent' | 'good' | 'fair' | 'poor';
    distortionMetrics: {
      responseAuthenticity: number;
      socialDesirabilityBias: number;
      impressionManagement: number;
      responseConsistency: number;
      straightLining: boolean;
      speedWarning: boolean;
      overallValidity: 'high' | 'medium' | 'low';
    };
    priorityAreas: string[];
  };
}

export const generateBurnoutEmployerReport = (config: BurnoutEmployerReportConfig): string => {
  const { candidateInfo, results } = config;
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getValidityColor = (validity: string) => {
    switch (validity) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Burnout Prevention Assessment - Employer Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }
        
        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 300;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 2rem;
        }
        
        .section {
            margin-bottom: 3rem;
            padding: 1.5rem;
            border-radius: 8px;
            background: #f8fafc;
            border-left: 4px solid #667eea;
        }
        
        .section h2 {
            color: #2d3748;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.5rem;
        }
        
        .candidate-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .info-card {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        
        .info-label {
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 0.25rem;
        }
        
        .info-value {
            color: #2d3748;
            font-size: 1.1rem;
        }
        
        .score-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .score-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .score-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .score-label {
            color: #6b7280;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .risk-indicator {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .risk-low { background: #dcfce7; color: #166534; }
        .risk-medium { background: #fef3c7; color: #92400e; }
        .risk-high { background: #fee2e2; color: #991b1b; }
        
        .category-scores {
            display: grid;
            gap: 1rem;
        }
        
        .category-item {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .category-name {
            font-weight: 600;
            color: #2d3748;
        }
        
        .category-score {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .score-bar {
            width: 200px;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .score-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .recommendations {
            background: #fffbeb;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .recommendations h3 {
            color: #92400e;
            margin-bottom: 1rem;
        }
        
        .recommendations ul {
            list-style: none;
        }
        
        .recommendations li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #fde68a;
            position: relative;
            padding-left: 1.5rem;
        }
        
        .recommendations li:before {
            content: "▶";
            position: absolute;
            left: 0;
            color: #f59e0b;
        }
        
        .validity-section {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .validity-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .validity-metric {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            border: 1px solid #e0f2fe;
            text-align: center;
        }
        
        .validity-score {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        
        .validity-label {
            font-size: 0.8rem;
            color: #0369a1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .priority-areas {
            background: #fef2f2;
            border: 1px solid #fca5a5;
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .priority-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .priority-item {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            border-left: 4px solid #ef4444;
        }
        
        .footer {
            background: #2d3748;
            color: white;
            padding: 2rem;
            text-align: center;
            font-size: 0.9rem;
        }
        
        @media print {
            body { background: white; }
            .report-container { box-shadow: none; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <h1>Burnout Prevention Assessment</h1>
            <div class="subtitle">Employer Comprehensive Report</div>
        </div>

        <div class="content">
            <!-- Candidate Information -->
            <div class="section">
                <h2>📋 Candidate Information</h2>
                <div class="candidate-info">
                    <div class="info-card">
                        <div class="info-label">Name</div>
                        <div class="info-value">${candidateInfo.name}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-label">Email</div>
                        <div class="info-value">${candidateInfo.email}</div>
                    </div>
                    ${candidateInfo.position ? `
                    <div class="info-card">
                        <div class="info-label">Position</div>
                        <div class="info-value">${candidateInfo.position}</div>
                    </div>
                    ` : ''}
                    ${candidateInfo.department ? `
                    <div class="info-card">
                        <div class="info-label">Department</div>
                        <div class="info-value">${candidateInfo.department}</div>
                    </div>
                    ` : ''}
                    <div class="info-card">
                        <div class="info-label">Assessment Date</div>
                        <div class="info-value">${candidateInfo.assessmentDate}</div>
                    </div>
                </div>
            </div>

            <!-- Executive Summary -->
            <div class="section">
                <h2>📊 Executive Summary</h2>
                <div class="score-overview">
                    <div class="score-card">
                        <div class="score-value" style="color: ${getRiskColor(results.burnoutRisk)}">${Math.round(results.overallScore)}</div>
                        <div class="score-label">Overall Resilience Score</div>
                    </div>
                    <div class="score-card">
                        <div class="score-value" style="color: #6366f1">${Math.round(results.percentileScore)}th</div>
                        <div class="score-label">Percentile Ranking</div>
                    </div>
                    <div class="score-card">
                        <div class="score-value">${results.burnoutRiskProfile}</div>
                        <div class="score-label">Risk Profile</div>
                    </div>
                    <div class="score-card">
                        <span class="risk-indicator risk-${results.burnoutRisk}">${results.burnoutRisk} Risk</span>
                        <div class="score-label">Burnout Risk Level</div>
                    </div>
                </div>
            </div>

            <!-- Category Analysis -->
            <div class="section">
                <h2>📈 Category Analysis</h2>
                <div class="category-scores">
                    ${results.categoryScores.map(category => `
                        <div class="category-item">
                            <div>
                                <div class="category-name">${category.dimension}</div>
                                <div style="font-size: 0.9rem; color: #6b7280;">${category.level} - ${category.percentage.toFixed(1)}%</div>
                            </div>
                            <div class="category-score">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${category.percentage}%; background: ${getRiskColor(category.riskLevel)};"></div>
                                </div>
                                <span class="risk-indicator risk-${category.riskLevel}">${category.riskLevel}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Response Validity Analysis -->
            <div class="section">
                <h2>🔍 Response Validity Analysis</h2>
                <div class="validity-section">
                    <div class="validity-metrics">
                        <div class="validity-metric">
                            <div class="validity-score" style="color: ${getValidityColor(results.distortionMetrics.overallValidity)}">${results.distortionMetrics.responseAuthenticity}%</div>
                            <div class="validity-label">Response Authenticity</div>
                        </div>
                        <div class="validity-metric">
                            <div class="validity-score" style="color: ${results.distortionMetrics.socialDesirabilityBias > 70 ? '#ef4444' : '#10b981'}">${results.distortionMetrics.socialDesirabilityBias}%</div>
                            <div class="validity-label">Social Desirability</div>
                        </div>
                        <div class="validity-metric">
                            <div class="validity-score" style="color: ${results.distortionMetrics.responseConsistency < 60 ? '#ef4444' : '#10b981'}">${results.distortionMetrics.responseConsistency}%</div>
                            <div class="validity-label">Response Consistency</div>
                        </div>
                        <div class="validity-metric">
                            <div class="validity-score" style="color: ${getValidityColor(results.distortionMetrics.overallValidity)}">${results.distortionMetrics.overallValidity.toUpperCase()}</div>
                            <div class="validity-label">Overall Validity</div>
                        </div>
                    </div>
                    
                    ${results.distortionMetrics.straightLining || results.distortionMetrics.speedWarning ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: #fee2e2; border: 1px solid #fecaca; border-radius: 6px;">
                        <h4 style="color: #991b1b; margin-bottom: 0.5rem;">⚠️ Validity Concerns</h4>
                        ${results.distortionMetrics.straightLining ? '<p style="color: #991b1b;">• Response pattern suggests possible straight-lining behavior</p>' : ''}
                        ${results.distortionMetrics.speedWarning ? '<p style="color: #991b1b;">• Responses completed unusually quickly - may affect accuracy</p>' : ''}
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Priority Areas for Intervention -->
            ${results.priorityAreas.length > 0 ? `
            <div class="section">
                <h2>🚨 Priority Areas for Intervention</h2>
                <div class="priority-areas">
                    <div class="priority-grid">
                        ${results.priorityAreas.map(area => `
                            <div class="priority-item">
                                <h4 style="color: #991b1b; margin-bottom: 0.5rem;">${area}</h4>
                                <p style="color: #6b7280; font-size: 0.9rem;">Requires immediate attention and support</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Managerial Recommendations -->
            <div class="section">
                <h2>💡 Managerial Recommendations</h2>
                <div class="recommendations">
                    <h3>Action Items for Managers</h3>
                    <ul>
                        ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        <li>Schedule regular check-ins to monitor progress and well-being</li>
                        <li>Consider workload redistribution if high stress indicators are present</li>
                        <li>Provide access to employee assistance programs and wellness resources</li>
                        ${results.burnoutRisk === 'high' ? '<li><strong>URGENT:</strong> Immediate intervention recommended - consider temporary workload reduction</li>' : ''}
                    </ul>
                </div>
            </div>

            <!-- Strengths and Development Areas -->
            <div class="section">
                <h2>⭐ Strengths and Development Areas</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div>
                        <h3 style="color: #059669; margin-bottom: 1rem;">Identified Strengths</h3>
                        <ul style="list-style: none;">
                            ${results.strengths.map(strength => `<li style="padding: 0.5rem 0; color: #065f46;">✓ ${strength}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h3 style="color: #dc2626; margin-bottom: 1rem;">Development Areas</h3>
                        <ul style="list-style: none;">
                            ${results.challenges.map(challenge => `<li style="padding: 0.5rem 0; color: #991b1b;">• ${challenge}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            ${formatPDFLegalFooter()}
            <p style="margin-top: 1rem; opacity: 0.8;">
                Generated on ${new Date().toLocaleDateString()} | Confidential HR Document
            </p>
        </div>
    </div>
</body>
</html>`;
};