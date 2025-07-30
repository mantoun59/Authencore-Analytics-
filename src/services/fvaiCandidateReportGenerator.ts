import { FaithValuesResult } from '@/hooks/useFaithValuesScoring';

interface FVAICandidateReportData {
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

export const generateFVAICandidateReport = (data: FVAICandidateReportData): string => {
  const { candidateInfo, results } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faith & Values Alignment Report - ${candidateInfo.name}</title>
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
        
        .candidate-info {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 40px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .candidate-info h2 {
            color: hsl(var(--amber));
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .info-label {
            font-weight: 600;
            color: hsl(var(--muted-foreground));
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            font-size: 1.1rem;
            font-weight: 500;
            color: hsl(var(--foreground));
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
        
        .chart-container {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .chart-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .chart-header h3 {
            font-size: 1.2rem;
            font-weight: 600;
            color: hsl(var(--muted-foreground));
        }
        
        .bar-chart {
            display: flex;
            align-items: end;
            justify-content: center;
            gap: 15px;
            height: 300px;
            padding: 20px;
            background: 
                linear-gradient(to top, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to top, hsl(var(--border)) 1px, transparent 1px);
            background-size: 100% 20%, 100% 10%;
            background-position: 0 0, 0 0;
            position: relative;
        }
        
        .bar-chart::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            background: 
                repeating-linear-gradient(
                    to top,
                    transparent 0px,
                    transparent 24px,
                    hsl(var(--border)) 24px,
                    hsl(var(--border)) 25px
                );
            pointer-events: none;
        }
        
        .bar-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 60px;
            max-width: 80px;
            flex: 1;
        }
        
        .bar-container {
            height: 250px;
            width: 100%;
            display: flex;
            align-items: end;
            justify-content: center;
            position: relative;
        }
        
        .bar {
            width: 80%;
            background: #7DD3FC;
            border-radius: 4px 4px 0 0;
            position: relative;
            min-height: 10px;
            transition: all 0.8s ease-in-out;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .bar-value {
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.85rem;
            font-weight: 600;
            color: hsl(var(--foreground));
            background: hsl(var(--background));
            padding: 2px 6px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .bar-label {
            margin-top: 10px;
            font-size: 0.8rem;
            font-weight: 500;
            color: hsl(var(--foreground));
            text-align: center;
            line-height: 1.2;
        }
        
        .values-detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .value-detail-card {
            background: var(--gradient-subtle);
            border: 1px solid hsl(var(--border));
            border-radius: 10px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .value-detail-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.1);
        }
        
        .value-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
        }
        
        .value-icon {
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-primary);
            border-radius: 8px;
            color: white;
        }
        
        .value-name {
            font-weight: 600;
            font-size: 1.1rem;
            color: hsl(var(--foreground));
        }
        
        .value-score {
            font-size: 1.5rem;
            font-weight: 700;
            color: hsl(var(--amber));
            margin-left: auto;
        }
        
        .value-description {
            font-size: 0.9rem;
            color: hsl(var(--muted-foreground));
            margin-bottom: 15px;
        }
        
        .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .insight-card {
            background: var(--gradient-subtle);
            border: 1px solid hsl(var(--border));
            border-radius: 10px;
            padding: 20px;
        }
        
        .insight-title {
            font-weight: 600;
            color: hsl(var(--amber));
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .insight-content {
            color: hsl(var(--muted-foreground));
            line-height: 1.6;
        }
        
        .development-section {
            background: linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--muted)));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 30px;
        }
        
        .development-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .development-card {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 10px;
            padding: 20px;
        }
        
        .development-title {
            font-weight: 600;
            color: hsl(var(--amber));
            margin-bottom: 15px;
            font-size: 1.1rem;
        }
        
        .development-list {
            list-style: none;
            padding: 0;
        }
        
        .development-list li {
            padding: 8px 0;
            border-bottom: 1px solid hsl(var(--border));
            color: hsl(var(--muted-foreground));
        }
        
        .development-list li:last-child {
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
            .values-detail-grid { grid-template-columns: 1fr; }
            .insights-grid { grid-template-columns: 1fr; }
            .development-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <button class="print-button" onclick="window.print()">📄 Print Report</button>
        
        <div class="header">
            <img src="/final-logo.png" alt="AuthenCore Analytics" class="logo" />
            <h1>Faith & Values Assessment</h1>
            <p class="subtitle">Personal Development Report</p>
        </div>
        
        <div class="candidate-info">
            <h2>👤 Personal Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${candidateInfo.name}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${candidateInfo.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Position</div>
                    <div class="info-value">${candidateInfo.position}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Organization</div>
                    <div class="info-value">${candidateInfo.organization}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Faith Background</div>
                    <div class="info-value">${candidateInfo.faithBackground}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Assessment Date</div>
                    <div class="info-value">${candidateInfo.date}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>⭐ Values Alignment Profile</h2>
            <div class="chart-container">
                <div class="chart-header">
                    <h3>Alignment Score (0-100)</h3>
                </div>
                <div class="bar-chart">
                    ${results.topValues.map(value => `
                        <div class="bar-group">
                            <div class="bar-container">
                                <div class="bar" style="height: ${value.score}%">
                                    <span class="bar-value">${Math.round(value.score)}</span>
                                </div>
                            </div>
                            <div class="bar-label">${value.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="values-detail-grid">
                ${results.topValues.slice(0, 6).map(value => `
                    <div class="value-detail-card">
                        <div class="value-header">
                            <div class="value-icon">${value.icon}</div>
                            <div class="value-name">${value.name}</div>
                            <div class="value-score">${Math.round(value.score)}</div>
                        </div>
                        <div class="value-description">${value.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>💡 Personal Insights</h2>
            <div class="insights-grid">
                <div class="insight-card">
                    <div class="insight-title">Work Style</div>
                    <div class="insight-content">${results.insights.workStyle}</div>
                </div>
                <div class="insight-card">
                    <div class="insight-title">Ideal Environment</div>
                    <div class="insight-content">${results.insights.idealEnvironment}</div>
                </div>
                <div class="insight-card">
                    <div class="insight-title">Growth Areas</div>
                    <div class="insight-content">${results.insights.growthAreas}</div>
                </div>
                <div class="insight-card">
                    <div class="insight-title">Leadership Potential</div>
                    <div class="insight-content">Your strong values alignment suggests natural leadership abilities in environments that prioritize ethical decision-making and authentic relationships.</div>
                </div>
            </div>
        </div>
        
        <div class="development-section">
            <h2>🌱 Personal Development Plan</h2>
            <div class="development-grid">
                <div class="development-card">
                    <div class="development-title">Strengthen Core Values</div>
                    <ul class="development-list">
                        <li>Practice daily reflection on value-based decisions</li>
                        <li>Seek mentorship in areas of growth</li>
                        <li>Join communities aligned with your values</li>
                        <li>Read books on spiritual and ethical leadership</li>
                    </ul>
                </div>
                <div class="development-card">
                    <div class="development-title">Career Integration</div>
                    <ul class="development-list">
                        <li>Align career choices with core values</li>
                        <li>Seek roles that emphasize purpose and meaning</li>
                        <li>Consider service-oriented opportunities</li>
                        <li>Develop skills in ethical decision-making</li>
                    </ul>
                </div>
                <div class="development-card">
                    <div class="development-title">Relationship Building</div>
                    <ul class="development-list">
                        <li>Practice empathy and active listening</li>
                        <li>Build authentic professional relationships</li>
                        <li>Engage in community service activities</li>
                        <li>Develop conflict resolution skills</li>
                    </ul>
                </div>
                <div class="development-card">
                    <div class="development-title">Spiritual Growth</div>
                    <ul class="development-list">
                        <li>Engage in regular spiritual practices</li>
                        <li>Study wisdom traditions and texts</li>
                        <li>Participate in faith community activities</li>
                        <li>Practice gratitude and mindfulness</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>AuthenCore Analytics</strong> - Faith & Values Personal Assessment Report</p>
            <p>This assessment provides insights into your spiritual and ethical values alignment for personal and professional growth.</p>
            <p>Generated on ${new Date().toLocaleDateString()} | Confidential Personal Report</p>
        </div>
    </div>
</body>
</html>`;
};