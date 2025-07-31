// Professional Gen Z Workplace Assessment Report Generator
// Using generic results interface for Gen Z assessment

export interface GenZReportData {
  candidateInfo: {
    name: string;
    email: string;
    position?: string;
    organization?: string;
    assessmentDate: string;
    generation?: string;
  };
  results: any;
  reportType: 'candidate' | 'employer';
}

// Gen Z Workplace Archetypes
const getGenZArchetype = (scores: any) => {
  const overallScore = scores.overallScore || 75;
  const digitalNative = scores.digitalNative || 80;
  const valuesDriven = scores.valuesDriven || 75;
  
  if (overallScore >= 85 && digitalNative >= 80) {
    return {
      type: 'Digital Pioneer',
      badge: '🚀',
      color: '#8b5cf6',
      description: 'Tech-savvy innovator who drives digital transformation and modern workplace practices',
      traits: ['Digital Native', 'Innovation Catalyst', 'Change Agent', 'Tech Evangelist']
    };
  }
  
  if (overallScore >= 80 && valuesDriven >= 80) {
    return {
      type: 'Purpose-Driven Leader',
      badge: '🌟',
      color: '#3b82f6',
      description: 'Values-centered professional who motivates teams through meaningful work and social impact',
      traits: ['Values Alignment', 'Social Impact', 'Authentic Leadership', 'Purpose-Driven']
    };
  }
  
  if (overallScore >= 75) {
    return {
      type: 'Agile Collaborator',
      badge: '🤝',
      color: '#10b981',
      description: 'Flexible team player who bridges generational gaps and adapts quickly to change',
      traits: ['Cross-Gen Connector', 'Adaptive', 'Collaborative', 'Growth Mindset']
    };
  }
  
  if (overallScore >= 65) {
    return {
      type: 'Emerging Professional',
      badge: '🌱',
      color: '#f59e0b',
      description: 'Developing modern workplace skills with strong foundation for growth',
      traits: ['Learning-Focused', 'Developing', 'Ambitious', 'Growth-Oriented']
    };
  }
  
  return {
    type: 'Traditional Adapter',
    badge: '🔄',
    color: '#ef4444',
    description: 'Learning to integrate modern workplace expectations with established practices',
    traits: ['Adapting', 'Traditional Values', 'Stability-Focused', 'Process-Oriented']
  };
};

export const generateGenZReport = (data: GenZReportData): string => {
  const { candidateInfo, results, reportType } = data;
  const archetype = getGenZArchetype(results);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gen Z Workplace Assessment Report - ${candidateInfo.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        :root {
            --primary: 217 91% 60%;
            --secondary: 210 40% 96%;
            --muted: 210 40% 96%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --border: 214.3 31.8% 91.4%;
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            
            --gradient-genz: linear-gradient(135deg, #8b5cf6, #3b82f6, #10b981);
            --gradient-digital: linear-gradient(135deg, #06b6d4, #8b5cf6);
            --gradient-purpose: linear-gradient(135deg, #3b82f6, #10b981);
            --shadow-modern: 0 25px 50px -12px rgba(139, 92, 246, 0.25);
            --shadow-glow: 0 0 40px rgba(139, 92, 246, 0.15);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        @keyframes slideIn {
            from { 
                opacity: 0; 
                transform: translateX(-30px); 
            }
            to { 
                opacity: 1; 
                transform: translateX(0); 
            }
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: hsl(var(--foreground));
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            min-height: 100vh;
        }
        
        .report-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 20px;
            background: hsl(var(--background));
            box-shadow: var(--shadow-modern);
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            animation: slideIn 0.6s ease-out;
        }
        
        .report-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: var(--gradient-genz);
            border-radius: 24px 24px 0 0;
        }
        
        .report-header {
            text-align: center;
            padding: 60px 30px;
            background: var(--gradient-genz);
            color: white;
            margin: -20px -20px 40px -20px;
            border-radius: 24px 24px 0 0;
            position: relative;
            overflow: hidden;
        }
        
        .report-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: float 6s ease-in-out infinite;
        }
        
        .brand-logo {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            animation: pulse 3s ease-in-out infinite;
        }
        
        .brand-subtitle {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 25px;
            position: relative;
            z-index: 1;
            letter-spacing: 1px;
        }
        
        .report-title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 15px;
            text-shadow: 0 4px 8px rgba(0,0,0,0.2);
            position: relative;
            z-index: 1;
            background: linear-gradient(45deg, #ffffff, #f1f5f9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .report-subtitle {
            font-size: 1.3rem;
            opacity: 0.95;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        .archetype-showcase {
            text-align: center;
            padding: 50px;
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border-radius: 24px;
            border: 3px solid ${archetype.color}30;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-glow);
        }
        
        .archetype-showcase::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, ${archetype.color}05, transparent);
            pointer-events: none;
        }
        
        .archetype-badge {
            font-size: 5rem;
            margin-bottom: 20px;
            display: block;
            animation: float 4s ease-in-out infinite;
            filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));
        }
        
        .archetype-type {
            font-size: 2.5rem;
            font-weight: 700;
            color: ${archetype.color};
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .archetype-description {
            color: hsl(var(--muted-foreground));
            font-size: 1.2rem;
            max-width: 600px;
            margin: 0 auto 25px;
            line-height: 1.7;
        }
        
        .archetype-traits {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            margin-top: 20px;
        }
        
        .trait-tag {
            background: ${archetype.color}15;
            color: ${archetype.color};
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
            border: 2px solid ${archetype.color}30;
            transition: all 0.3s ease;
        }
        
        .trait-tag:hover {
            background: ${archetype.color}25;
            transform: translateY(-2px);
        }
        
        .section {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 20px;
            padding: 35px;
            margin-bottom: 35px;
            box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .section:hover {
            box-shadow: 0 12px 35px -8px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
        
        .section-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: hsl(var(--foreground));
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 15px;
            border-bottom: 2px solid ${archetype.color}20;
            padding-bottom: 10px;
        }
        
        .dimensions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .dimension-card {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .dimension-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, ${archetype.color}, ${archetype.color}80);
        }
        
        .dimension-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
        }
        
        .dimension-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .dimension-name {
            font-weight: 600;
            font-size: 1.1rem;
            color: hsl(var(--foreground));
        }
        
        .dimension-score {
            font-size: 1.8rem;
            font-weight: 700;
            color: ${archetype.color};
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .progress-container {
            margin: 15px 0;
        }
        
        .progress-bar {
            background: hsl(var(--muted));
            height: 10px;
            border-radius: 5px;
            overflow: hidden;
            position: relative;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, ${archetype.color}, ${archetype.color}CC);
            border-radius: 5px;
            transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        
        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .dimension-insight {
            color: hsl(var(--muted-foreground));
            font-size: 0.95rem;
            line-height: 1.6;
            margin-top: 12px;
            font-style: italic;
        }
        
        .insights-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }
        
        .insight-card {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            padding: 25px;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .insight-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 25px -8px rgba(0, 0, 0, 0.15);
        }
        
        .insight-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            display: block;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        
        .insight-title {
            font-weight: 600;
            color: ${archetype.color};
            margin-bottom: 12px;
            font-size: 1.2rem;
        }
        
        .insight-content {
            color: hsl(var(--muted-foreground));
            line-height: 1.7;
            font-size: 0.95rem;
        }
        
        .action-roadmap {
            background: linear-gradient(135deg, #f0f9ff, #ecfdf5);
            border: 2px solid ${archetype.color}30;
            border-radius: 20px;
            padding: 35px;
            position: relative;
        }
        
        .roadmap-title {
            text-align: center;
            color: ${archetype.color};
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 30px;
        }
        
        .roadmap-timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .roadmap-timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(to bottom, ${archetype.color}, ${archetype.color}50);
        }
        
        .roadmap-phase {
            position: relative;
            margin-bottom: 30px;
            background: hsl(var(--background));
            border-radius: 12px;
            padding: 20px;
            border: 1px solid hsl(var(--border));
            margin-left: 20px;
        }
        
        .roadmap-phase::before {
            content: '';
            position: absolute;
            left: -35px;
            top: 20px;
            width: 12px;
            height: 12px;
            background: ${archetype.color};
            border-radius: 50%;
            border: 3px solid hsl(var(--background));
        }
        
        .phase-number {
            display: inline-block;
            background: ${archetype.color};
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-weight: 600;
            font-size: 0.85rem;
            margin-bottom: 8px;
        }
        
        .phase-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: hsl(var(--foreground));
        }
        
        .phase-description {
            color: hsl(var(--muted-foreground));
            font-size: 0.95rem;
            line-height: 1.6;
        }
        
        ${reportType === 'employer' ? `
        .employer-analysis {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border: 2px solid ${archetype.color}40;
            border-radius: 20px;
            padding: 35px;
            margin-bottom: 35px;
        }
        
        .hiring-recommendation {
            background: ${archetype.color};
            color: white;
            padding: 25px;
            border-radius: 16px;
            text-align: center;
            margin-bottom: 25px;
            position: relative;
            overflow: hidden;
        }
        
        .hiring-recommendation::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: shimmer 3s infinite;
        }
        
        .recommendation-level {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .recommendation-text {
            font-size: 1.1rem;
            opacity: 0.95;
        }
        
        .employer-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .metric-card {
            background: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.15);
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: ${archetype.color};
            margin-bottom: 5px;
        }
        
        .metric-label {
            color: hsl(var(--muted-foreground));
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .management-tips {
            background: hsl(var(--background));
            border-radius: 16px;
            padding: 25px;
            border: 1px solid hsl(var(--border));
        }
        
        .tips-title {
            color: ${archetype.color};
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .tips-list {
            list-style: none;
            padding: 0;
        }
        
        .tips-list li {
            padding: 10px 0;
            border-bottom: 1px solid hsl(var(--border));
            position: relative;
            padding-left: 25px;
            color: hsl(var(--muted-foreground));
        }
        
        .tips-list li:last-child {
            border-bottom: none;
        }
        
        .tips-list li::before {
            content: '💡';
            position: absolute;
            left: 0;
        }
        ` : ''}
        
        .print-button {
            background: var(--gradient-genz);
            color: white;
            padding: 16px 32px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 20px 0;
            box-shadow: var(--shadow-glow);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .print-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .print-button:hover::before {
            left: 100%;
        }
        
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px -8px rgba(139, 92, 246, 0.4);
        }
        
        .footer {
            text-align: center;
            padding: 40px 0;
            border-top: 2px solid hsl(var(--border));
            color: hsl(var(--muted-foreground));
            font-size: 0.9rem;
            margin-top: 50px;
            background: linear-gradient(135deg, #fafafa, #f1f5f9);
            border-radius: 16px;
            margin-left: -35px;
            margin-right: -35px;
            margin-bottom: -35px;
            padding-left: 35px;
            padding-right: 35px;
        }
        
        @media print {
            .print-button { display: none; }
            body { margin: 0; }
            .report-container { box-shadow: none; margin: 0; padding: 15px; }
            .archetype-showcase { break-inside: avoid; }
        }
        
        @media (max-width: 768px) {
            .dimensions-grid { grid-template-columns: 1fr; }
            .insights-showcase { grid-template-columns: 1fr; }
            .employer-metrics { grid-template-columns: repeat(2, 1fr); }
            .report-title { font-size: 2.2rem; }
            .archetype-type { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
        
        <div class="report-header">
            <div class="brand-logo">AuthenCore Analytics</div>
            <div class="brand-subtitle">Next-Generation Workplace Assessment</div>
            <h1 class="report-title">Gen Z Workplace Assessment</h1>
            <p class="report-subtitle">${reportType === 'employer' ? 'Employer Insights & Hiring Analysis' : 'Personal Development & Career Insights'}</p>
        </div>
        
        <div class="section">
            <h2 class="section-title">👤 Assessment Information</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div><strong>Name:</strong> ${candidateInfo.name}</div>
                <div><strong>Email:</strong> ${candidateInfo.email}</div>
                ${candidateInfo.position ? `<div><strong>Position:</strong> ${candidateInfo.position}</div>` : ''}
                ${candidateInfo.organization ? `<div><strong>Organization:</strong> ${candidateInfo.organization}</div>` : ''}
                <div><strong>Assessment Date:</strong> ${candidateInfo.assessmentDate}</div>
                <div><strong>Generation:</strong> ${candidateInfo.generation || 'Gen Z Professional'}</div>
            </div>
        </div>
        
        <div class="archetype-showcase">
            <span class="archetype-badge">${archetype.badge}</span>
            <div class="archetype-type">${archetype.type}</div>
            <div class="archetype-description">${archetype.description}</div>
            
            <div class="archetype-traits">
                ${archetype.traits.map(trait => `
                    <span class="trait-tag">${trait}</span>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📊 Workplace Dimensions</h2>
            <div class="dimensions-grid">
                ${Object.entries(results.dimensionScores || {}).map(([key, dimension]: [string, any]) => `
                    <div class="dimension-card">
                        <div class="dimension-header">
                            <div class="dimension-name">${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</div>
                            <div class="dimension-score">${dimension.score || 75}%</div>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${dimension.score || 75}%"></div>
                            </div>
                        </div>
                        <div class="dimension-insight">
                            ${dimension.level || 'Strong'} performance in ${key.toLowerCase()}. 
                            ${dimension.description || 'This dimension reflects modern workplace competency.'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">💡 Workplace Insights</h2>
            <div class="insights-showcase">
                <div class="insight-card">
                    <span class="insight-icon">🚀</span>
                    <div class="insight-title">Digital Fluency</div>
                    <div class="insight-content">
                        ${results.overallScore >= 80 ? 'Exceptional digital native capabilities. Natural tech adoption and innovation mindset.' : 
                          results.overallScore >= 70 ? 'Strong digital skills with good tech adaptation abilities.' :
                          'Developing digital competencies with solid growth potential.'}
                    </div>
                </div>
                
                <div class="insight-card">
                    <span class="insight-icon">🎯</span>
                    <div class="insight-title">Purpose & Values</div>
                    <div class="insight-content">
                        ${results.overallScore >= 75 ? 'Strong values alignment drives motivation and engagement in meaningful work.' :
                          results.overallScore >= 65 ? 'Good sense of purpose with developing values integration.' :
                          'Building connection between personal values and professional goals.'}
                    </div>
                </div>
                
                <div class="insight-card">
                    <span class="insight-icon">🤝</span>
                    <div class="insight-title">Collaboration Style</div>
                    <div class="insight-content">
                        ${results.overallScore >= 80 ? 'Excellent cross-generational collaboration and inclusive mindset.' :
                          results.overallScore >= 70 ? 'Good team collaboration with modern communication preferences.' :
                          'Developing collaborative skills with preference for digital communication.'}
                    </div>
                </div>
                
                <div class="insight-card">
                    <span class="insight-icon">📈</span>
                    <div class="insight-title">Growth Mindset</div>
                    <div class="insight-content">
                        Gen Z professionals show strong learning agility and adaptability. 
                        ${results.overallScore >= 75 ? 'Exceptional growth potential with proactive learning approach.' :
                          'Good foundation for continuous development and skill building.'}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="action-roadmap">
            <h2 class="roadmap-title">🗺️ 90-Day Development Roadmap</h2>
            
            <div class="roadmap-timeline">
                <div class="roadmap-phase">
                    <span class="phase-number">Phase 1</span>
                    <div class="phase-title">Digital Integration (Days 1-30)</div>
                    <div class="phase-description">
                        Leverage natural digital fluency while building cross-platform communication skills. 
                        Focus on professional digital presence and virtual collaboration mastery.
                    </div>
                </div>
                
                <div class="roadmap-phase">
                    <span class="phase-number">Phase 2</span>
                    <div class="phase-title">Values-Work Alignment (Days 31-60)</div>
                    <div class="phase-description">
                        Develop strategies for integrating personal values with professional responsibilities. 
                        Build skills in purpose-driven decision making and meaningful contribution.
                    </div>
                </div>
                
                <div class="roadmap-phase">
                    <span class="phase-number">Phase 3</span>
                    <div class="phase-title">Leadership Emergence (Days 61-90)</div>
                    <div class="phase-description">
                        Apply strengths in innovation and collaboration to take on leadership challenges. 
                        Focus on mentoring others and driving positive workplace change.
                    </div>
                </div>
            </div>
        </div>
        
        ${reportType === 'employer' ? `
        <div class="employer-analysis">
            <h2 class="section-title">👔 Employer Analysis & Recommendations</h2>
            
            <div class="hiring-recommendation">
                <div class="recommendation-level">
                    ${results.overallScore >= 80 ? 'Highly Recommended' : 
                      results.overallScore >= 70 ? 'Recommended' : 
                      results.overallScore >= 60 ? 'Consider with Development' : 'Requires Significant Development'}
                </div>
                <div class="recommendation-text">
                    ${results.overallScore >= 80 ? 'Exceptional Gen Z candidate with strong modern workplace competencies. Ideal for innovation-focused roles.' :
                      results.overallScore >= 70 ? 'Strong candidate with good Gen Z workplace characteristics. Well-suited for most modern roles.' :
                      results.overallScore >= 60 ? 'Developing Gen Z professional with potential. Consider for entry-level roles with mentorship.' :
                      'Early-stage professional requiring structured development and support.'}
                </div>
            </div>
            
            <div class="employer-metrics">
                <div class="metric-card">
                    <div class="metric-value">${results.overallScore}%</div>
                    <div class="metric-label">Gen Z Readiness</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${results.overallScore >= 75 ? 'High' : results.overallScore >= 60 ? 'Moderate' : 'Developing'}</div>
                    <div class="metric-label">Innovation Potential</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${results.overallScore >= 70 ? 'Excellent' : 'Good'}</div>
                    <div class="metric-label">Cultural Fit</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${archetype.type.split(' ')[0]}</div>
                    <div class="metric-label">Archetype</div>
                </div>
            </div>
            
            <div class="management-tips">
                <div class="tips-title">Management & Development Tips</div>
                <ul class="tips-list">
                    <li>Provide ${results.overallScore >= 75 ? 'autonomous project ownership with innovation opportunities' : 'structured guidance with clear expectations'}</li>
                    <li>Offer ${results.overallScore >= 70 ? 'mentorship roles and reverse mentoring opportunities' : 'comprehensive onboarding and skills development'}</li>
                    <li>Enable ${results.overallScore >= 75 ? 'flexible work arrangements and digital-first processes' : 'gradual introduction to flexible work practices'}</li>
                    <li>Create ${results.overallScore >= 70 ? 'purpose-driven projects aligned with company values' : 'clear connections between role and organizational mission'}</li>
                    <li>Implement ${results.overallScore >= 75 ? 'rapid feedback cycles and continuous learning opportunities' : 'regular check-ins and structured feedback sessions'}</li>
                </ul>
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p><strong>AuthenCore Analytics</strong> - Next-Generation Workplace Assessment Platform</p>
            <p style="margin-top: 15px; font-size: 0.85rem;">
                Report Generated: ${new Date().toLocaleDateString()} | 
                Assessment Version: 2.0 | 
                Questions Analyzed: 45 items
            </p>
            <p style="margin-top: 10px; font-size: 0.8rem; line-height: 1.5;">
                This assessment leverages validated psychological instruments and modern workplace research 
                to provide insights into Gen Z professional characteristics and workplace preferences. 
                Results should be considered as part of a comprehensive evaluation process.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};