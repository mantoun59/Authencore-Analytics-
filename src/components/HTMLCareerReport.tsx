import React from 'react';
import { Badge } from '@/components/ui/badge';
import finalLogo from '../assets/final-logo.png';

interface HTMLReportData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
    assessmentDate?: string;
    questionsAnswered?: number;
    timeSpent?: string;
    reliabilityScore?: number;
    reportId?: string;
  };
  overallScore?: number;
  dimensions?: Array<{ name: string; score: number; description?: string; level?: string }> | Record<string, number>;
  strengths?: string[];
  developmentAreas?: string[];
  recommendations?: string[];
  careerMatches?: Array<{ title: string; match: number; description?: string; majors?: string[] }>;
  riasecResults?: Record<string, number>;
  collegeMajors?: Array<{ name: string; match: number; careers: string[]; description?: string }>;
}

interface HTMLCareerReportProps {
  data: HTMLReportData;
}

export const HTMLCareerReport: React.FC<HTMLCareerReportProps> = ({ data }) => {
  // Process dimensions data
  const processDimensions = (dimensions: any): Array<{ name: string; score: number }> => {
    if (!dimensions) return [];
    
    if (Array.isArray(dimensions)) {
      return dimensions.map(dim => ({
        name: dim.name || 'Unknown',
        score: Number(dim.score) || 0
      }));
    }
    
    if (typeof dimensions === 'object') {
      return Object.entries(dimensions).map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
        score: Number(value) || 0
      }));
    }
    
    return [];
  };

  const processedDimensions = processDimensions(data.dimensions || data.riasecResults);
  const careerMatches = data.careerMatches || [];
  const recommendations = data.recommendations || [];
  const collegeMajors = data.collegeMajors || generateCollegeMajors(processedDimensions, careerMatches);

  // Generate college majors based on career matches and RIASEC scores
  function generateCollegeMajors(dimensions: Array<{ name: string; score: number }>, careers: any[]): Array<{ name: string; match: number; careers: string[]; description: string }> {
    const majorMappings = [
      { name: 'Computer Science', riasec: ['Investigative', 'Conventional'], careers: ['Software Engineer', 'Data Scientist', 'Systems Analyst'], description: 'Programming, algorithms, and computational thinking' },
      { name: 'Business Administration', riasec: ['Enterprising', 'Conventional'], careers: ['Business Manager', 'Marketing Manager', 'Operations Manager'], description: 'Leadership, strategy, and organizational management' },
      { name: 'Psychology', riasec: ['Social', 'Investigative'], careers: ['Psychologist', 'Counselor', 'Human Resources'], description: 'Human behavior, mental processes, and social dynamics' },
      { name: 'Engineering', riasec: ['Realistic', 'Investigative'], careers: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer'], description: 'Problem-solving, design, and technical innovation' },
      { name: 'Graphic Design', riasec: ['Artistic', 'Conventional'], careers: ['Graphic Designer', 'Art Director', 'UX Designer'], description: 'Visual communication, creativity, and design principles' },
      { name: 'Education', riasec: ['Social', 'Conventional'], careers: ['Teacher', 'Principal', 'Curriculum Developer'], description: 'Learning theory, pedagogy, and human development' },
      { name: 'Marketing', riasec: ['Enterprising', 'Artistic'], careers: ['Marketing Specialist', 'Brand Manager', 'Digital Marketer'], description: 'Consumer behavior, branding, and communication strategies' },
      { name: 'Environmental Science', riasec: ['Investigative', 'Realistic'], careers: ['Environmental Scientist', 'Conservation Biologist', 'Sustainability Consultant'], description: 'Ecology, research, and environmental protection' },
      { name: 'Finance', riasec: ['Conventional', 'Enterprising'], careers: ['Financial Analyst', 'Investment Banker', 'Financial Planner'], description: 'Economics, financial markets, and quantitative analysis' },
      { name: 'Communications', riasec: ['Social', 'Artistic'], careers: ['Public Relations Specialist', 'Journalist', 'Content Creator'], description: 'Media, storytelling, and interpersonal communication' }
    ];

    return majorMappings.map(major => {
      const matchScore = major.riasec.reduce((score, riasecType) => {
        const dimension = dimensions.find(d => d.name.toLowerCase().includes(riasecType.toLowerCase()));
        return score + (dimension ? dimension.score : 0);
      }, 0) / major.riasec.length;

      return {
        name: major.name,
        match: Math.round(matchScore),
        careers: major.careers,
        description: major.description
      };
    }).sort((a, b) => b.match - a.match);
  }

  // RIASEC types with colors and descriptions
  const riasecTypes = [
    { name: 'Realistic', color: '#008080', description: 'Hands-on, practical, mechanical', icon: '🔧' },
    { name: 'Investigative', color: '#228B22', description: 'Research, analysis, problem-solving', icon: '🔬' },
    { name: 'Artistic', color: '#FF8C00', description: 'Creative, expressive, innovative', icon: '🎨' },
    { name: 'Social', color: '#32CD32', description: 'People-focused, helping, teaching', icon: '👥' },
    { name: 'Enterprising', color: '#FFD700', description: 'Leadership, business, persuasion', icon: '📈' },
    { name: 'Conventional', color: '#4169E1', description: 'Organized, detail-oriented, systematic', icon: '📊' }
  ];

  const getScoreLevel = (score: number): { level: string; color: string } => {
    if (score >= 85) return { level: 'Excellent', color: '#22C55E' };
    if (score >= 70) return { level: 'Good', color: '#3B82F6' };
    if (score >= 55) return { level: 'Average', color: '#EAB308' };
    return { level: 'Developing', color: '#EF4444' };
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="html-report">
      <style>{`
        @media print {
          .html-report {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            background: white;
          }
          
          .report-page {
            page-break-after: always;
            padding: 20px;
            min-height: 100vh;
          }
          
          .report-page:last-child {
            page-break-after: avoid;
          }
          
          .report-header {
            background: linear-gradient(135deg, #008080, #006666);
            color: white;
            padding: 20px;
            margin: -20px -20px 30px -20px;
            border-radius: 0;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 8px;
            padding: 5px;
          }
          
          .company-info h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          
          .company-info p {
            margin: 5px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
          }
          
          .confidential-badge {
            background: #dc2626;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            position: absolute;
            top: 20px;
            right: 20px;
          }
          
          .profile-card {
            background: #f8fafc;
            border: 2px solid #008080;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .profile-header {
            background: #008080;
            color: white;
            padding: 10px 15px;
            margin: -20px -20px 15px -20px;
            border-radius: 6px 6px 0 0;
            font-weight: bold;
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          
          .metric-card {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          
          .metric-card.primary {
            border-color: #008080;
            background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
          }
          
          .metric-card.success {
            border-color: #22c55e;
            background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          }
          
          .metric-value {
            font-size: 36px;
            font-weight: bold;
            color: #008080;
            margin: 10px 0;
          }
          
          .metric-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 5px;
          }
          
          .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin: 30px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid #008080;
          }
          
          .dimension-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
          }
          
          .dimension-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .dimension-name {
            font-weight: bold;
            font-size: 16px;
          }
          
          .dimension-score {
            font-size: 18px;
            font-weight: bold;
          }
          
          .progress-bar {
            background: #e2e8f0;
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
            margin: 10px 0;
          }
          
          .progress-fill {
            height: 100%;
            border-radius: 6px;
            transition: width 0.3s ease;
          }
          
          .college-major-card {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
          }
          
          .major-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .major-name {
            font-size: 18px;
            font-weight: bold;
            color: #92400e;
          }
          
          .major-match {
            font-size: 16px;
            font-weight: bold;
            color: #f59e0b;
          }
          
          .related-careers {
            background: white;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            font-size: 12px;
            color: #374151;
          }
          
          .career-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .career-rank {
            background: #fbbf24;
            color: #92400e;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            float: left;
            margin-right: 15px;
          }
          
          .career-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 5px;
          }
          
          .career-match {
            font-size: 16px;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 10px;
          }
          
          .recommendation-item {
            background: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 15px;
            margin: 10px 0;
            border-radius: 0 8px 8px 0;
          }
          
          .recommendation-number {
            background: #22c55e;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
          }
          
          .footer {
            background: #f8fafc;
            padding: 20px;
            margin: 30px -20px -20px -20px;
            border-top: 2px solid #008080;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
        }
        
        @media screen {
          .html-report {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
          }
        }
      `}</style>

      {/* Page 1: Overview and Profile */}
      <div className="report-page">
        <div className="report-header">
          <div className="confidential-badge">CONFIDENTIAL</div>
          <div className="logo-section">
            <img 
              src={finalLogo} 
              alt="AuthenCore Analytics - Professional Career Assessment Platform" 
              className="logo"
              loading="eager"
              decoding="sync"
            />
            <div className="company-info">
              <h1>AuthenCore Analytics</h1>
              <p>Career Launch Assessment Report</p>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            👤 Candidate Profile
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <div><strong>Name:</strong> {data.userInfo.name}</div>
            <div><strong>Email:</strong> {data.userInfo.email}</div>
            <div><strong>Assessment Date:</strong> {formatDate(data.userInfo.assessmentDate)}</div>
            <div><strong>Report ID:</strong> {data.userInfo.reportId || `CLR-${Date.now()}`}</div>
            {data.userInfo.questionsAnswered && (
              <div><strong>Questions Answered:</strong> {data.userInfo.questionsAnswered}</div>
            )}
            {data.userInfo.timeSpent && (
              <div><strong>Time Spent:</strong> {data.userInfo.timeSpent}</div>
            )}
          </div>
        </div>

        <div className="metrics-grid">
          {data.overallScore !== undefined && (
            <div className="metric-card primary">
              <div className="metric-label">🏆 Overall Score</div>
              <div className="metric-value">{data.overallScore}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>out of 100</div>
            </div>
          )}
          {data.userInfo.reliabilityScore && (
            <div className="metric-card success">
              <div className="metric-label">🛡️ Reliability Score</div>
              <div className="metric-value">{data.userInfo.reliabilityScore}%</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>response quality</div>
            </div>
          )}
        </div>

        <div style={{ background: '#e0f2fe', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0277bd' }}>📋 Executive Summary</h3>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            This comprehensive career assessment analyzes your interests, aptitudes, and personality traits 
            to provide personalized career recommendations based on scientifically validated methodologies. 
            The report uses the Holland RIASEC model and integrates with the O*NET career database for 
            accurate career matching.
          </p>
        </div>
      </div>

      {/* Page 2: RIASEC Analysis */}
      <div className="report-page">
        <h2 className="section-title">🔬 RIASEC Interest Profile Analysis</h2>
        <p style={{ marginBottom: '20px', color: '#64748b' }}>
          Your interest profile based on Holland's RIASEC model - six personality types that help predict career satisfaction:
        </p>

        {processedDimensions.slice(0, 6).map((dim, index) => {
          const riasecType = riasecTypes[index] || riasecTypes[0];
          const scoreInfo = getScoreLevel(dim.score);
          
          return (
            <div key={index} className="dimension-item">
              <div className="dimension-header">
                <div>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>{riasecType.icon}</span>
                  <span className="dimension-name" style={{ color: riasecType.color }}>
                    {dim.name}
                  </span>
                  <div style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                    {riasecType.description}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="dimension-score" style={{ color: riasecType.color }}>
                    {dim.score}
                  </div>
                  <div style={{ fontSize: '12px', color: scoreInfo.color, fontWeight: 'bold' }}>
                    {scoreInfo.level}
                  </div>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${dim.score}%`, 
                    backgroundColor: riasecType.color 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

        {/* Page 3: College Majors */}
        <div className="report-page">
          <h2 className="section-title">🎓 Recommended College Majors</h2>
          <p style={{ marginBottom: '20px', color: '#64748b' }}>
            Academic programs that align with your interests and career goals, ranked by compatibility:
          </p>

          {collegeMajors.slice(0, 6).map((major, index) => {
            const matchColor = major.match >= 80 ? '#22c55e' : major.match >= 60 ? '#f59e0b' : '#6b7280';
            
            return (
              <div key={index} className="college-major-card">
                <div className="major-header">
                  <div className="major-name">🎓 {major.name}</div>
                  <div className="major-match" style={{ color: matchColor }}>
                    {major.match}% Match
                  </div>
                </div>
                <div className="progress-bar" style={{ width: '100%', marginBottom: '10px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${major.match}%`, 
                      backgroundColor: matchColor 
                    }}
                  />
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                  {major.description}
                </div>
                <div className="related-careers">
                  <strong>Related Careers:</strong> {major.careers.join(', ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Page 4: Career Recommendations */}
      <div className="report-page">
        <h2 className="section-title">🚀 Top Career Recommendations</h2>
        <p style={{ marginBottom: '20px', color: '#64748b' }}>
          Based on your assessment results, here are your top career matches ranked by compatibility:
        </p>

        {careerMatches.slice(0, 8).map((match, index) => {
          const matchScore = Number(match.match) || 0;
          const matchColor = matchScore >= 80 ? '#22c55e' : matchScore >= 60 ? '#f59e0b' : '#6b7280';
          
          return (
            <div key={index} className="career-card">
              <div className="career-rank">{index + 1}</div>
              <div>
                <div className="career-title">{match.title}</div>
                <div className="career-match" style={{ color: matchColor }}>
                  {matchScore}% Match
                </div>
                <div className="progress-bar" style={{ width: '200px' }}>
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${matchScore}%`, 
                      backgroundColor: matchColor 
                    }}
                  />
                </div>
                {match.description && (
                  <div style={{ marginTop: '10px', color: '#64748b', fontSize: '14px' }}>
                    {match.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Page 5: Development Recommendations */}
      <div className="report-page">
        <h2 className="section-title">💡 Personal Development Roadmap</h2>
        <p style={{ marginBottom: '20px', color: '#64748b' }}>
          Your personalized development roadmap with prioritized action items for career growth:
        </p>

        {recommendations.slice(0, 10).map((rec, index) => (
          <div key={index} className="recommendation-item">
            <span className="recommendation-number">{index + 1}</span>
            <span>{rec}</span>
          </div>
        ))}

        {recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <p>Personalized recommendations will be generated based on your specific assessment results.</p>
          </div>
        )}

        <div style={{ marginTop: '40px', background: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '2px solid #22c55e' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#16a34a' }}>🎯 Next Steps</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
            <li>Review your RIASEC profile and identify your strongest interest areas</li>
            <li>Research the recommended careers that align with your interests and values</li>
            <li>Consider informational interviews with professionals in your target fields</li>
            <li>Develop skills and gain experience in your areas of interest</li>
            <li>Create a timeline for your career transition or development goals</li>
          </ul>
        </div>
      </div>

      {/* Page 6: Assessment Details & Methodology */}
      <div className="report-page">
        <h2 className="section-title">📊 Assessment Methodology & Validity</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', margin: '20px 0' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#008080', margin: '0 0 10px 0' }}>🔬 Holland RIASEC Theory</h4>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Six personality types and work environments for accurate career matching based on decades of research.
            </p>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#008080', margin: '0 0 10px 0' }}>📚 O*NET Career Database</h4>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              900+ career profiles with detailed requirements and outcomes for comprehensive matching.
            </p>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#008080', margin: '0 0 10px 0' }}>🧠 Cognitive Aptitude Assessment</h4>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Validated measures of reasoning and problem-solving abilities for accurate predictions.
            </p>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#008080', margin: '0 0 10px 0' }}>✅ Response Quality Validation</h4>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Statistical analysis ensures reliable and consistent responses for trustworthy results.
            </p>
          </div>
        </div>

        <div style={{ background: '#e0f2fe', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
          <h4 style={{ color: '#0277bd', margin: '0 0 15px 0' }}>📈 Assessment Statistics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <div><strong>Questions Answered:</strong> {data.userInfo.questionsAnswered || 'Complete Set'}</div>
            <div><strong>Time Spent:</strong> {data.userInfo.timeSpent || 'Appropriate Duration'}</div>
            <div><strong>Reliability Score:</strong> {data.userInfo.reliabilityScore || 'High'}%</div>
            <div><strong>Report Generated:</strong> {formatDate()}</div>
          </div>
        </div>

        <div className="footer">
          <div style={{ marginBottom: '10px' }}>
            <strong>AuthenCore Analytics</strong> | Professional Career Assessment Platform
          </div>
          <div style={{ fontSize: '11px' }}>
            This report is confidential and intended for professional use only. 
            For questions about this report, contact: support@authencore.com
          </div>
          <div style={{ marginTop: '10px', fontSize: '11px' }}>
            Generated on {formatDate()} | www.authencore.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLCareerReport;