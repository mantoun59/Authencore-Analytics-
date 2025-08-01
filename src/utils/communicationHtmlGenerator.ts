import { CommunicationStylesResults } from "@/hooks/useCommunicationStylesScoring";
import finalLogo from '../assets/final-logo.png';

interface CommunicationHtmlOptions {
  results: CommunicationStylesResults;
  participantName: string;
  participantEmail: string;
  includeDistortionAnalysis?: boolean;
  includeVisualCharts?: boolean;
  language?: string;
}

export const generateCommunicationStylesHtml = async (options: CommunicationHtmlOptions): Promise<void> => {
  const {
    results,
    participantName,
    participantEmail,
    includeDistortionAnalysis = true,
    includeVisualCharts = true,
    language = 'en'
  } = options;

  // Create comprehensive HTML content
  const htmlContent = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Communication Styles Assessment Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            border-radius: 8px;
        }
        .participant-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .score-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .score-card {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .score-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 1.8em;
            color: #1e40af;
            border-bottom: 2px solid #93c5fd;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .dimension-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .dimension-card {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 15px;
            background: #f9fafb;
        }
        .dimension-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .dimension-name {
            font-weight: bold;
            color: #374151;
        }
        .dimension-level {
            background: #3b82f6;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: #3b82f6;
            transition: width 0.3s ease;
        }
        .context-effectiveness {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .profile-analysis {
            background: #fefce8;
            border: 1px solid #eab308;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .development-area {
            background: #f0f4f8;
            border-left: 4px solid #6366f1;
            padding: 15px;
            margin-bottom: 15px;
        }
        .distortion-analysis {
            background: #fef2f2;
            border: 1px solid #f87171;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        .reliability-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .indicator {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 8px 12px;
            border-radius: 4px;
            margin: 5px 0;
            font-size: 0.9em;
        }
        .chart-placeholder {
            width: 100%;
            height: 300px;
            background: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            margin: 20px 0;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 0.9em;
            color: #6b7280;
        }
        .print-button {
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin: 20px 0;
        }
        .print-button:hover {
            background: #2563eb;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .score-grid { grid-template-columns: repeat(2, 1fr); }
            .dimension-grid { grid-template-columns: 1fr; }
            .section { page-break-inside: avoid; }
            .print-button { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="${finalLogo}" alt="AuthenCore Analytics" class="logo" />
        <h1>Communication Styles Assessment Report</h1>
        <p style="font-size: 1.2em; color: #6b7280;">Comprehensive Communication Effectiveness Analysis</p>
    </div>

    <button class="print-button" onclick="window.print()">🖨️ Print Report</button>

    <div class="participant-info">
        <h2>Participant Information</h2>
        <p><strong>Name:</strong> ${participantName}</p>
        ${participantEmail ? `<p><strong>Email:</strong> ${participantEmail}</p>` : ''}
        <p><strong>Assessment Date:</strong> ${new Date(results.completedAt).toLocaleDateString()}</p>
        <p><strong>Total Time:</strong> ${Math.round(results.timeSpent / 60000)} minutes</p>
        <p><strong>Communication Profile:</strong> ${results.profile.type} Style</p>
    </div>

    <div class="score-grid">
        <div class="score-card">
            <div class="score-value">${Math.round(results.overallScore)}%</div>
            <div>Overall Communication Effectiveness</div>
        </div>
        <div class="score-card">
            <div class="score-value">${Math.round(results.communicationEffectivenessIndex)}%</div>
            <div>Communication Effectiveness Index</div>
        </div>
        <div class="score-card">
            <div class="score-value">${Math.round(results.adaptabilityScore)}%</div>
            <div>Adaptability Score</div>
        </div>
        <div class="score-card">
            <div class="score-value">${results.profile.type}</div>
            <div>Communication Style</div>
        </div>
    </div>

    ${includeVisualCharts ? `
    <div class="section">
        <h2 class="section-title">Visual Communication Profile</h2>
        <div class="chart-placeholder">
            CEI Radar Chart - Shows Clarity, Empathy, Adaptability, and Influence scores
        </div>
        <div class="chart-placeholder">
            Communication Style Matrix - Assertiveness vs Expressiveness positioning
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h2 class="section-title">Communication Dimensions Analysis</h2>
        <div class="dimension-grid">
            ${Object.entries(results.dimensions).map(([key, dimension]) => `
                <div class="dimension-card">
                    <div class="dimension-header">
                        <span class="dimension-name">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        <span class="dimension-level">${dimension.level}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${dimension.score}%"></div>
                    </div>
                    <p><strong>Score:</strong> ${Math.round(dimension.score)}% (${dimension.percentile}th percentile)</p>
                    <p>${dimension.description}</p>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Contextual Effectiveness Analysis</h2>
        <div class="context-effectiveness">
            ${Object.entries(results.contextualEffectiveness).map(([context, score]) => `
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span><strong>${context.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong></span>
                        <span style="font-weight: bold; color: ${score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'};">${Math.round(score)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${score}%; background-color: ${score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'};"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Communication Profile Analysis</h2>
        <div class="profile-analysis">
            <h3>${results.profile.type} Communication Style</h3>
            <p><strong>Primary Characteristics:</strong> ${results.profile.primary}</p>
            <p><strong>Secondary Traits:</strong> ${results.profile.secondary}</p>
            <p><strong>Key Strengths:</strong> ${results.profile.strength}</p>
            <p><strong>Development Areas:</strong> ${results.profile.challenge}</p>
            <p><strong>Work Style Preferences:</strong> ${results.profile.workStyle}</p>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Development Recommendations</h2>
        ${results.developmentAreas.map((area, index) => `
            <div class="development-area">
                <h4>Priority ${index + 1}: ${area.priority}</h4>
                <p>${area.description}</p>
                <ul>
                    ${area.actionItems.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>

    ${includeDistortionAnalysis && results.distortionAnalysis ? `
    <div class="section">
        <h2 class="section-title">Assessment Quality & Validity Analysis</h2>
        <div class="distortion-analysis">
            <div class="reliability-badge" style="background-color: ${
                results.distortionAnalysis.reliability === 'High' ? '#10b981' :
                results.distortionAnalysis.reliability === 'Moderate' ? '#f59e0b' :
                results.distortionAnalysis.reliability === 'Low' ? '#f97316' : '#ef4444'
            };">
                ${results.distortionAnalysis.reliability} Reliability
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4>Consistency Check</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${results.distortionAnalysis.consistencyCheck}%"></div>
                    </div>
                    <p>${results.distortionAnalysis.consistencyCheck}%</p>
                </div>
                <div>
                    <h4>Response Time Pattern</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${results.distortionAnalysis.responseTimePattern}%"></div>
                    </div>
                    <p>${results.distortionAnalysis.responseTimePattern}%</p>
                </div>
                <div>
                    <h4>Social Desirability Bias</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${100 - results.distortionAnalysis.socialDesirabilityBias}%"></div>
                    </div>
                    <p>${100 - results.distortionAnalysis.socialDesirabilityBias}% (Lower is better)</p>
                </div>
            </div>

            ${results.distortionAnalysis.indicators.length > 0 ? `
                <h4>Quality Indicators</h4>
                ${results.distortionAnalysis.indicators.map(indicator => `
                    <div class="indicator">${indicator}</div>
                `).join('')}
            ` : '<p style="color: #10b981; font-weight: bold;">✓ No quality concerns detected - Assessment appears highly reliable</p>'}

            <h4>Recommendations</h4>
            <ul>
                ${results.distortionAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <p>This report was generated on ${new Date().toLocaleDateString()} using advanced psychometric analysis.</p>
        <p>For questions about this assessment, please contact your administrator.</p>
        <p>© ${new Date().getFullYear()} AuthenCore Analytics - Confidential Assessment Report</p>
    </div>
</body>
</html>
  `;

  // Open in new window for viewing/printing
  try {
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (!reportWindow) {
      throw new Error('Unable to open report window. Please allow popups for this site.');
    }
    
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    
    // Auto-focus the window
    reportWindow.onload = () => {
      reportWindow.focus();
    };
    
    console.log('Communication styles HTML report generated successfully');
    
  } catch (error) {
    console.error('Error generating HTML report:', error);
    throw new Error('Failed to generate HTML report');
  }
};