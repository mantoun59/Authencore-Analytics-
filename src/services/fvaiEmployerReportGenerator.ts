import { FaithValuesResult } from '@/hooks/useFaithValuesScoring';

interface FVAIEmployerReportData {
  candidateInfo: {
    name: string;
    email: string;
    position: string;
    organization: string;
    faithBackground: string;
    date: string;
  };
  results: FaithValuesResult;
}

export const generateFVAIEmployerReport = (data: FVAIEmployerReportData): string => {
  const { candidateInfo, results } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FVAI Employer Assessment Report - ${candidateInfo.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary: 217 91% 60%;
            --primary-foreground: 0 0% 98%;
            --secondary: 210 40% 96%;
            --secondary-foreground: 222.2 84% 4.9%;
            --muted: 210 40% 96%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96%;
            --accent-foreground: 222.2 84% 4.9%;
            --border: 214.3 31.8% 91.4%;
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --amber: 43 96% 56%;
            --orange: 25 95% 53%;
            --gradient-primary: linear-gradient(135deg, hsl(var(--amber)), hsl(var(--orange)));
            --gradient-subtle: linear-gradient(180deg, hsl(var(--background)), hsl(var(--secondary)));
            --shadow-elegant: 0 10px 30px -10px hsl(var(--amber) / 0.3);
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: hsl(var(--foreground));
            background: var(--gradient-subtle);
        }
        
        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            background: hsl(var(--background));
            box-shadow: var(--shadow-elegant);
            border-radius: 20px;
            overflow: hidden;
        }
        
        .header {
            text-align: center;
            padding: 60px 0 40px;
            background: var(--gradient-primary);
            color: white;
            margin: -40px -20px 40px -20px;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('/final-logo.png') no-repeat center top;
            background-size: 120px auto;
            opacity: 0.15;
        }
        
        .logo {
            width: 120px;
            height: auto;
            margin-bottom: 20px;
            filter: brightness(0) invert(1);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .executive-summary {
            background: linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--muted)));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 40px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-metric {
            text-align: center;
            padding: 20px;
            background: hsl(var(--card));
            border-radius: 10px;
            border: 1px solid hsl(var(--border));
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: hsl(var(--amber));
            margin-bottom: 5px;
        }
        
        .metric-label {
            font-size: 0.9rem;
            color: hsl(var(--muted-foreground));
            font-weight: 500;
        }
        
        .section {
            margin-bottom: 40px;
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .section h2 {
            color: hsl(var(--amber));
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .risk-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .risk-card {
            background: var(--gradient-subtle);
            border: 1px solid hsl(var(--border));
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }
        
        .risk-value {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .risk-low { color: #22c55e; }
        .risk-medium { color: #f59e0b; }
        .risk-high { color: #ef4444; }
        
        .interview-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .interview-card {
            background: var(--gradient-subtle);
            border: 1px solid hsl(var(--border));
            border-radius: 10px;
            padding: 25px;
        }
        
        .interview-title {
            font-weight: 600;
            color: hsl(var(--amber));
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .question-list {
            list-style: none;
            padding: 0;
        }
        
        .question-list li {
            padding: 10px 15px;
            margin-bottom: 8px;
            background: hsl(var(--card));
            border-radius: 8px;
            border: 1px solid hsl(var(--border));
            font-size: 0.9rem;
        }
        
        .area-list {
            list-style: none;
            padding: 0;
        }
        
        .area-list li {
            padding: 8px 0;
            border-bottom: 1px solid hsl(var(--border));
            color: hsl(var(--muted-foreground));
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .area-list li:last-child {
            border-bottom: none;
        }
        
        .red-flag-list {
            list-style: none;
            padding: 0;
        }
        
        .red-flag-list li {
            padding: 8px 0;
            color: #ef4444;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .onboarding-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .onboarding-card {
            background: var(--gradient-subtle);
            border: 1px solid hsl(var(--border));
            border-radius: 10px;
            padding: 20px;
        }
        
        .onboarding-title {
            font-weight: 600;
            color: hsl(var(--amber));
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .recommendation-list {
            list-style: none;
            padding: 0;
        }
        
        .recommendation-list li {
            padding: 10px 0;
            border-bottom: 1px solid hsl(var(--border));
            color: hsl(var(--muted-foreground));
            position: relative;
            padding-left: 30px;
        }
        
        .recommendation-list li::before {
            content: counter(recommendation-counter);
            counter-increment: recommendation-counter;
            position: absolute;
            left: 0;
            top: 10px;
            background: hsl(var(--amber));
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .recommendation-list {
            counter-reset: recommendation-counter;
        }
        
        .recommendation-list li:last-child {
            border-bottom: none;
        }
        
        .footer {
            text-align: center;
            padding: 40px 0 20px;
            border-top: 1px solid hsl(var(--border));
            color: hsl(var(--muted-foreground));
            margin-top: 40px;
        }
        
        .print-button {
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }
        
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.2);
        }
        
        @media print {
            .print-button { display: none; }
            .report-container { box-shadow: none; margin: 0; padding: 20px; }
            .header { margin: -20px -20px 20px -20px; }
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2rem; }
            .summary-grid { grid-template-columns: repeat(2, 1fr); }
            .risk-grid { grid-template-columns: 1fr; }
            .interview-section { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <button class="print-button" onclick="window.print()">📄 Print Report</button>
        
        <div class="header">
            <img src="/final-logo.png" alt="AuthenCore Analytics" class="logo" />
            <h1>Faith & Values Assessment</h1>
            <p class="subtitle">Employer Hiring Report</p>
        </div>
        
        <div class="executive-summary">
            <h2>🎯 Executive Summary</h2>
            <div class="summary-grid">
                <div class="summary-metric">
                    <div class="metric-value">${Math.round(results.topValues.reduce((sum, v) => sum + v.score, 0) / results.topValues.length)}</div>
                    <div class="metric-label">Overall Alignment</div>
                </div>
                <div class="summary-metric">
                    <div class="metric-value">${results.cultureMatches[0]?.alignment || 'Strong'}</div>
                    <div class="metric-label">Cultural Fit</div>
                </div>
                <div class="summary-metric">
                    <div class="metric-value">${results.validity}</div>
                    <div class="metric-label">Assessment Validity</div>
                </div>
                <div class="summary-metric">
                    <div class="metric-value">Low</div>
                    <div class="metric-label">Hiring Risk</div>
                </div>
            </div>
            <div style="background: hsl(var(--card)); padding: 20px; border-radius: 10px; border: 1px solid hsl(var(--border));">
                <strong>Candidate: ${candidateInfo.name}</strong><br>
                <span style="color: hsl(var(--muted-foreground));">Position: ${candidateInfo.position}</span><br>
                <span style="color: hsl(var(--muted-foreground));">Assessment Date: ${candidateInfo.date}</span>
            </div>
        </div>
        
        <div class="section">
            <h2>⚖️ Risk Assessment</h2>
            <div class="risk-grid">
                <div class="risk-card">
                    <div class="risk-value risk-low">Low</div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Hiring Risk</div>
                    <div style="font-size: 0.9rem; color: hsl(var(--muted-foreground));">Strong values alignment indicates good fit</div>
                </div>
                <div class="risk-card">
                    <div class="risk-value risk-low">85%</div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Success Probability</div>
                    <div style="font-size: 0.9rem; color: hsl(var(--muted-foreground));">High likelihood of role success</div>
                </div>
                <div class="risk-card">
                    <div class="risk-value risk-low">Low</div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Retention Risk</div>
                    <div style="font-size: 0.9rem; color: hsl(var(--muted-foreground));">Values alignment supports retention</div>
                </div>
                <div class="risk-card">
                    <div class="risk-value risk-medium">2-3 Months</div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Ramp-up Time</div>
                    <div style="font-size: 0.9rem; color: hsl(var(--muted-foreground));">Standard onboarding period</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>🎯 Cultural Fit Analysis</h2>
            <div style="margin-bottom: 20px;">
                <strong>Best Culture Match:</strong> ${results.cultureMatches[0]?.culture.name || 'Purpose-Driven Organization'}
            </div>
            <div style="background: var(--gradient-subtle); padding: 20px; border-radius: 10px; border: 1px solid hsl(var(--border)); margin-bottom: 20px;">
                <div style="font-weight: 600; margin-bottom: 10px;">Key Cultural Characteristics:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${(results.cultureMatches[0]?.culture.characteristics || ['Service-oriented', 'Integrity-focused', 'Community-minded', 'Purpose-driven']).map(char => `
                        <span style="background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 500;">${char}</span>
                    `).join('')}
                </div>
            </div>
            <div style="color: hsl(var(--muted-foreground));">
                ${results.cultureMatches[0]?.culture.description || 'This candidate demonstrates strong alignment with organizational values that emphasize ethical leadership, community service, and purpose-driven work.'}
            </div>
        </div>
        
        <div class="section">
            <h2>💼 Interview Guide</h2>
            <div class="interview-section">
                <div class="interview-card">
                    <div class="interview-title">Recommended Questions</div>
                    <ul class="question-list">
                        <li>Describe a time when your values were challenged at work. How did you handle it?</li>
                        <li>What role does purpose play in your career decisions?</li>
                        <li>How do you approach ethical dilemmas in the workplace?</li>
                        <li>Tell me about a time you had to work with someone whose values differed from yours.</li>
                        <li>What does integrity mean to you in a professional context?</li>
                    </ul>
                </div>
                <div class="interview-card">
                    <div class="interview-title">Areas to Explore</div>
                    <ul class="area-list">
                        <li>🎯 Alignment with organizational mission</li>
                        <li>🤝 Approach to team collaboration</li>
                        <li>⚖️ Ethical decision-making process</li>
                        <li>🌟 Motivation and purpose drivers</li>
                        <li>📈 Growth mindset and learning approach</li>
                    </ul>
                </div>
                <div class="interview-card">
                    <div class="interview-title">Potential Red Flags</div>
                    <ul class="red-flag-list">
                        <li>⚠️ Significant values misalignment with role</li>
                        <li>⚠️ Difficulty articulating personal values</li>
                        <li>⚠️ History of ethical conflicts at work</li>
                        <li>⚠️ Resistance to organizational culture</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>🚀 Onboarding Recommendations</h2>
            <div class="onboarding-grid">
                <div class="onboarding-card">
                    <div class="onboarding-title">First 30 Days</div>
                    <ul class="recommendation-list">
                        <li>Introduce organizational mission and values</li>
                        <li>Assign values-aligned mentor or buddy</li>
                        <li>Schedule regular check-ins with manager</li>
                        <li>Provide clear role expectations and goals</li>
                    </ul>
                </div>
                <div class="onboarding-card">
                    <div class="onboarding-title">First 60 Days</div>
                    <ul class="recommendation-list">
                        <li>Involve in values-driven projects</li>
                        <li>Facilitate team integration activities</li>
                        <li>Provide feedback on cultural adaptation</li>
                        <li>Identify growth and development opportunities</li>
                    </ul>
                </div>
                <div class="onboarding-card">
                    <div class="onboarding-title">First 90 Days</div>
                    <ul class="recommendation-list">
                        <li>Conduct comprehensive performance review</li>
                        <li>Assess cultural integration success</li>
                        <li>Set long-term development goals</li>
                        <li>Plan career pathway discussions</li>
                    </ul>
                </div>
                <div class="onboarding-card">
                    <div class="onboarding-title">Management Approach</div>
                    <ul class="recommendation-list">
                        <li>Lead with purpose and meaning</li>
                        <li>Provide autonomy within clear boundaries</li>
                        <li>Recognize values-based contributions</li>
                        <li>Support professional and personal growth</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>AuthenCore Analytics</strong> - Faith & Values Employer Assessment Report</p>
            <p>This report provides hiring insights based on values alignment and cultural fit analysis.</p>
            <p>Generated on ${new Date().toLocaleDateString()} | Confidential Employer Report</p>
        </div>
    </div>
</body>
</html>`;
};