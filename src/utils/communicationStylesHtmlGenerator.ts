import { CommunicationStylesResults } from "@/hooks/useCommunicationStylesScoring";

interface CommunicationHTMLOptions {
  results: CommunicationStylesResults;
  participantName: string;
  participantEmail: string;
  includeDistortionAnalysis?: boolean;
  includeVisualCharts?: boolean;
  language?: string;
}

export const generateCommunicationStylesHTML = (options: CommunicationHTMLOptions): string => {
  const {
    results,
    participantName,
    participantEmail,
    includeDistortionAnalysis = true,
    includeVisualCharts = true,
    language = 'en'
  } = options;

  // Calculate CEI components for visual representation
  const clarity = (results.dimensions.assertiveness.score + results.dimensions.informationProcessing.score) / 2;
  const empathy = (results.dimensions.listeningPatterns.score + results.dimensions.expressiveness.score) / 2;
  const adaptability = results.dimensions.channelPreferences.score;
  const influence = results.dimensions.influenceStrategies.score;

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Communication Styles Assessment Report - ${participantName}</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .participant-info {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 40px;
            border-left: 6px solid #3b82f6;
        }
        .participant-info h2 {
            color: #1e40af;
            margin-bottom: 20px;
            font-size: 1.5em;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .score-dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        .score-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .score-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        .score-value {
            font-size: 3em;
            font-weight: bold;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        .score-label {
            color: #64748b;
            font-weight: 500;
            font-size: 1.1em;
        }
        .section {
            margin-bottom: 50px;
        }
        .section-title {
            font-size: 2em;
            color: #1e40af;
            margin-bottom: 30px;
            position: relative;
            padding-bottom: 15px;
        }
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80px;
            height: 4px;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            border-radius: 2px;
        }
        .visual-charts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .chart-container {
            background: #f8fafc;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            border: 2px dashed #cbd5e1;
        }
        .chart-title {
            font-size: 1.3em;
            color: #374151;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .cei-breakdown {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .cei-component {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .cei-score {
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .dimension-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        .dimension-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }
        .dimension-card:hover {
            transform: translateY(-3px);
        }
        .dimension-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .dimension-name {
            font-weight: bold;
            color: #374151;
            font-size: 1.1em;
        }
        .dimension-level {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .progress-container {
            margin: 15px 0;
        }
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            border-radius: 6px;
            transition: width 1s ease-in-out;
            position: relative;
        }
        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%);
            background-size: 20px 20px;
            animation: progress-shine 2s infinite linear;
        }
        @keyframes progress-shine {
            0% { background-position: -20px 0; }
            100% { background-position: 20px 0; }
        }
        .score-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            font-size: 0.9em;
            color: #64748b;
        }
        .context-effectiveness {
            background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
            border: 2px solid #0ea5e9;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }
        .context-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .context-item {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .context-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .context-name {
            font-weight: 600;
            color: #374151;
        }
        .context-score {
            font-weight: bold;
            font-size: 1.1em;
        }
        .profile-analysis {
            background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
            border: 2px solid #eab308;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }
        .profile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .profile-trait {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .trait-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .development-section {
            background: #f0f4f8;
            border-radius: 12px;
            padding: 30px;
        }
        .development-area {
            background: white;
            border-left: 6px solid #6366f1;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .development-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        .priority-badge {
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: white;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .development-title {
            font-weight: bold;
            color: #374151;
            font-size: 1.1em;
        }
        .action-items {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .action-item {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid #6366f1;
            font-size: 0.95em;
        }
        .distortion-analysis {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 2px solid #f87171;
            border-radius: 12px;
            padding: 30px;
            margin-top: 40px;
        }
        .reliability-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: bold;
            margin-bottom: 20px;
            font-size: 1.1em;
        }
        .quality-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        .quality-metric {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .metric-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
        }
        .metric-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 8px;
        }
        .indicator {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 12px 15px;
            border-radius: 6px;
            margin: 8px 0;
            font-size: 0.95em;
            border-left: 4px solid #f59e0b;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 40px;
            text-align: center;
        }
        .footer-content {
            max-width: 600px;
            margin: 0 auto;
        }
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        @media print {
            .print-button { display: none; }
            body { background: white; padding: 0; }
            .container { box-shadow: none; margin: 0; }
            .score-dashboard { grid-template-columns: repeat(2, 1fr); }
            .dimension-grid { grid-template-columns: 1fr; }
            .section { page-break-inside: avoid; }
        }
        @media (max-width: 768px) {
            .container { margin: 10px; border-radius: 8px; }
            .header { padding: 20px; }
            .content { padding: 20px; }
            .header h1 { font-size: 1.8em; }
            .score-dashboard { grid-template-columns: 1fr; }
            .visual-charts { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
    
    <div class="container">
        <div class="header">
            <h1>Communication Styles Assessment</h1>
            <div class="subtitle">Comprehensive Communication Effectiveness Analysis</div>
        </div>

        <div class="content">
            <div class="participant-info">
                <h2>📊 Assessment Overview</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Participant:</strong> ${participantName}
                    </div>
                    ${participantEmail ? `
                    <div class="info-item">
                        <strong>Email:</strong> ${participantEmail}
                    </div>
                    ` : ''}
                    <div class="info-item">
                        <strong>Assessment Date:</strong> ${new Date(results.completedAt).toLocaleDateString()}
                    </div>
                    <div class="info-item">
                        <strong>Time Spent:</strong> ${Math.round(results.timeSpent / 60000)} minutes
                    </div>
                    <div class="info-item">
                        <strong>Communication Style:</strong> ${results.profile.type}
                    </div>
                    <div class="info-item">
                        <strong>Response Pattern:</strong> ${results.responsePattern}
                    </div>
                </div>
            </div>

            <div class="score-dashboard">
                <div class="score-card">
                    <div class="score-value">${Math.round(results.overallScore)}%</div>
                    <div class="score-label">Overall Communication Effectiveness</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${Math.round(results.communicationEffectivenessIndex)}%</div>
                    <div class="score-label">Communication Effectiveness Index</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${Math.round(results.adaptabilityScore)}%</div>
                    <div class="score-label">Adaptability Score</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${results.profile.type}</div>
                    <div class="score-label">Communication Style</div>
                </div>
            </div>

            ${includeVisualCharts ? `
            <div class="section">
                <h2 class="section-title">📈 Visual Communication Profile</h2>
                <div class="visual-charts">
                    <div class="chart-container">
                        <div class="chart-title">Communication Effectiveness Index (CEI)</div>
                        <p>Comprehensive view of communication dimensions</p>
                        <div class="cei-breakdown">
                            <div class="cei-component">
                                <div class="cei-score" style="color: #3b82f6;">${Math.round(clarity)}%</div>
                                <div>Clarity</div>
                            </div>
                            <div class="cei-component">
                                <div class="cei-score" style="color: #10b981;">${Math.round(empathy)}%</div>
                                <div>Empathy</div>
                            </div>
                            <div class="cei-component">
                                <div class="cei-score" style="color: #f59e0b;">${Math.round(adaptability)}%</div>
                                <div>Adaptability</div>
                            </div>
                            <div class="cei-component">
                                <div class="cei-score" style="color: #8b5cf6;">${Math.round(influence)}%</div>
                                <div>Influence</div>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container">
                        <div class="chart-title">Communication Style Positioning</div>
                        <p>Assertiveness: ${Math.round(results.dimensions.assertiveness.score)}% | Expressiveness: ${Math.round(results.dimensions.expressiveness.score)}%</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #3b82f6;">${results.profile.type} Communication Style</p>
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="section">
                <h2 class="section-title">🎯 Communication Dimensions Analysis</h2>
                <div class="dimension-grid">
                    ${Object.entries(results.dimensions).map(([key, dimension]) => `
                        <div class="dimension-card">
                            <div class="dimension-header">
                                <span class="dimension-name">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                <span class="dimension-level">${dimension.level}</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${dimension.score}%"></div>
                                </div>
                            </div>
                            <div class="score-details">
                                <span><strong>Score:</strong> ${Math.round(dimension.score)}%</span>
                                <span><strong>Percentile:</strong> ${dimension.percentile}th</span>
                            </div>
                            <p style="margin-top: 12px; font-size: 0.95em; color: #64748b;">${dimension.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">🌟 Contextual Effectiveness Analysis</h2>
                <div class="context-effectiveness">
                    <h3 style="margin-bottom: 20px; color: #0c4a6e;">Performance Across Different Communication Contexts</h3>
                    <div class="context-grid">
                        ${Object.entries(results.contextualEffectiveness).map(([context, score]) => `
                            <div class="context-item">
                                <div class="context-header">
                                    <span class="context-name">${context.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                    <span class="context-score" style="color: ${score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'};">${Math.round(score)}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${score}%; background: ${score >= 70 ? 'linear-gradient(135deg, #10b981, #059669)' : score >= 50 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};"></div>
                                </div>
                                <p style="margin-top: 8px; font-size: 0.9em; color: #64748b;">
                                    ${score >= 80 ? 'Excellent performance expected' :
                                      score >= 60 ? 'Good performance with growth potential' :
                                      score >= 40 ? 'Moderate effectiveness, development recommended' :
                                      'Significant development opportunity'}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">👤 Communication Profile Analysis</h2>
                <div class="profile-analysis">
                    <h3 style="margin-bottom: 20px; color: #92400e;">${results.profile.type} Communication Style</h3>
                    <div class="profile-grid">
                        <div class="profile-trait">
                            <div class="trait-title">🎯 Primary Characteristics</div>
                            <p>${results.profile.primary}</p>
                        </div>
                        <div class="profile-trait">
                            <div class="trait-title">🔍 Secondary Traits</div>
                            <p>${results.profile.secondary}</p>
                        </div>
                        <div class="profile-trait">
                            <div class="trait-title">💪 Key Strengths</div>
                            <p>${results.profile.strength}</p>
                        </div>
                        <div class="profile-trait">
                            <div class="trait-title">📈 Development Areas</div>
                            <p>${results.profile.challenge}</p>
                        </div>
                        <div class="profile-trait">
                            <div class="trait-title">🏢 Work Style Preferences</div>
                            <p>${results.profile.workStyle}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">🚀 Development Recommendations</h2>
                <div class="development-section">
                    ${results.developmentAreas.map((area, index) => `
                        <div class="development-area">
                            <div class="development-header">
                                <span class="priority-badge">Priority ${index + 1}</span>
                                <span class="development-title">${area.priority}</span>
                            </div>
                            <p style="margin-bottom: 20px; color: #64748b; line-height: 1.6;">${area.description}</p>
                            <div class="action-items">
                                ${area.actionItems.map(item => `
                                    <div class="action-item">
                                        <strong>•</strong> ${item}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${includeDistortionAnalysis && results.distortionAnalysis ? `
            <div class="section">
                <h2 class="section-title">🔍 Assessment Quality & Validity Analysis</h2>
                <div class="distortion-analysis">
                    <div class="reliability-badge" style="background-color: ${
                        results.distortionAnalysis.reliability === 'High' ? '#10b981' :
                        results.distortionAnalysis.reliability === 'Moderate' ? '#f59e0b' :
                        results.distortionAnalysis.reliability === 'Low' ? '#f97316' : '#ef4444'
                    };">
                        🛡️ ${results.distortionAnalysis.reliability} Reliability Assessment
                    </div>
                    
                    <div class="quality-metrics">
                        <div class="quality-metric">
                            <div class="metric-title">Consistency Check</div>
                            <div class="metric-value">${results.distortionAnalysis.consistencyCheck}%</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${results.distortionAnalysis.consistencyCheck}%"></div>
                            </div>
                        </div>
                        <div class="quality-metric">
                            <div class="metric-title">Response Time Pattern</div>
                            <div class="metric-value">${results.distortionAnalysis.responseTimePattern}%</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${results.distortionAnalysis.responseTimePattern}%"></div>
                            </div>
                        </div>
                        <div class="quality-metric">
                            <div class="metric-title">Social Desirability Control</div>
                            <div class="metric-value">${100 - results.distortionAnalysis.socialDesirabilityBias}%</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${100 - results.distortionAnalysis.socialDesirabilityBias}%"></div>
                            </div>
                            <p style="font-size: 0.8em; margin-top: 5px; color: #64748b;">Higher is better</p>
                        </div>
                    </div>

                    ${results.distortionAnalysis.indicators.length > 0 ? `
                        <h4 style="margin-bottom: 15px; color: #92400e;">⚠️ Quality Indicators</h4>
                        ${results.distortionAnalysis.indicators.map(indicator => `
                            <div class="indicator">🔔 ${indicator}</div>
                        `).join('')}
                    ` : `
                        <div style="background: #dcfce7; border: 2px solid #16a34a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="color: #16a34a; font-weight: bold; margin: 0;">✅ Excellent Assessment Quality</p>
                            <p style="color: #15803d; margin: 5px 0 0 0;">No quality concerns detected - Assessment appears highly reliable and valid for decision-making.</p>
                        </div>
                    `}

                    <h4 style="margin-top: 25px; margin-bottom: 15px; color: #92400e;">💡 Professional Recommendations</h4>
                    <ul style="margin-left: 20px;">
                        ${results.distortionAnalysis.recommendations.map(rec => `<li style="margin-bottom: 8px; color: #374151;">${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <div class="footer-content">
                <h3>📋 Assessment Information</h3>
                <p>This comprehensive Communication Styles Assessment was generated using advanced psychometric analysis on ${new Date().toLocaleDateString()}.</p>
                <p style="margin-top: 15px;">For questions about this assessment or to schedule follow-up coaching sessions, please contact your assessment administrator.</p>
                <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">© ${new Date().getFullYear()} Communication Styles Assessment Platform</p>
            </div>
        </div>
    </div>

    <script>
        // Add smooth scrolling for better UX
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Animate progress bars on load
        window.addEventListener('load', function() {
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        });
    </script>
</body>
</html>
  `;
};