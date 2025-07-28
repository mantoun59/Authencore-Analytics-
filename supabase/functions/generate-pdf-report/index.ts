import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-PDF-REPORT] ${step}${detailsStr}`);
};

// Helper function to safely convert values to strings
const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    // Handle objects properly instead of showing [object Object]
    if (value.score !== undefined) return value.score.toString();
    if (value.name !== undefined) return value.name.toString();
    return JSON.stringify(value);
  }
  return String(value);
};

// Helper function to get proper assessment name
const getAssessmentDisplayName = (assessmentType: string): string => {
  const nameMap: Record<string, string> = {
    'stress_resilience': 'Stress & Resilience',
    'career_launch': 'Career Launch',
    'cair_plus': 'CAIR+ Cultural Intelligence',
    'emotional_intelligence': 'Emotional Intelligence',
    'leadership': 'Leadership Assessment',
    'communication_styles': 'Communication Styles',
    'digital_wellness': 'Digital Wellness',
    'faith_values': 'Faith & Values',
    'gen_z_workplace': 'Gen Z Workplace'
  };
  
  return nameMap[assessmentType] || assessmentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to safely get dimension scores
const getDimensionScores = (dimensions: any): Record<string, number> => {
  if (!dimensions) return {};
  
  if (Array.isArray(dimensions)) {
    const result: Record<string, number> = {};
    dimensions.forEach((dim: any) => {
      if (dim && typeof dim === 'object') {
        const name = safeString(dim.name || 'Unknown Dimension');
        const score = typeof dim.score === 'number' ? dim.score : 0;
        result[name] = score;
      }
    });
    return result;
  }
  
  if (typeof dimensions === 'object') {
    const result: Record<string, number> = {};
    Object.entries(dimensions).forEach(([key, value]) => {
      const score = typeof value === 'number' ? value : (typeof value === 'object' && value && 'score' in value ? (value as any).score : 0);
      result[key] = typeof score === 'number' ? score : 0;
    });
    return result;
  }
  
  return {};
};

// Helper function to generate detailed insights
const generateDetailedInsights = (dimensionScores: Record<string, number>, assessmentType: string): string => {
  const insights: string[] = [];
  
  Object.entries(dimensionScores).forEach(([dimension, score]) => {
    const formattedName = dimension.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (score >= 85) {
      insights.push(`<strong>${formattedName}:</strong> Exceptional performance demonstrates mastery in this area. This represents a significant competitive advantage and core strength that should be leveraged in career development and role assignments.`);
    } else if (score >= 70) {
      insights.push(`<strong>${formattedName}:</strong> Strong performance with solid foundational skills. Continue to build upon this strength while maintaining current competency levels through regular practice and application.`);
    } else if (score >= 55) {
      insights.push(`<strong>${formattedName}:</strong> Developing competency with room for growth. Focus on targeted skill development through training, mentorship, and practical application opportunities.`);
    } else {
      insights.push(`<strong>${formattedName}:</strong> Priority development area requiring immediate attention. Consider structured learning programs, coaching, and regular feedback to build fundamental skills in this critical area.`);
    }
  });
  
  return insights.join('<br><br>');
};

// Helper function to generate career recommendations
const generateCareerRecommendations = (dimensionScores: Record<string, number>, assessmentType: string): string => {
  const recommendations: string[] = [];
  const strongAreas = Object.entries(dimensionScores).filter(([_, score]) => score >= 75);
  const developmentAreas = Object.entries(dimensionScores).filter(([_, score]) => score < 60);
  
  if (strongAreas.length > 0) {
    recommendations.push(`<strong>Leverage Your Strengths:</strong> Your exceptional performance in ${strongAreas.map(([name]) => name.replace(/_/g, ' ')).join(', ')} suggests excellent fit for roles requiring these competencies.`);
  }
  
  if (developmentAreas.length > 0) {
    recommendations.push(`<strong>Development Focus:</strong> Prioritize growth in ${developmentAreas.map(([name]) => name.replace(/_/g, ' ')).join(', ')} through targeted learning and practice.`);
  }
  
  recommendations.push(`<strong>Career Progression:</strong> Based on your assessment profile, consider roles that utilize your strengths while providing opportunities to develop emerging competencies.`);
  
  return recommendations.join('<br><br>');
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const requestData = await req.json();
    logStep("Request data received", {
      assessmentType: requestData.assessmentType || requestData.result?.assessmentType,
      hasResults: !!requestData.results || !!requestData.result,
      hasUserData: !!requestData.userData,
      resultsType: typeof (requestData.results || requestData.result),
      userDataType: typeof requestData.userData
    });

    // Extract and sanitize data
    const userData = requestData.userData || {};
    const results = requestData.results || requestData.result || {};
    const assessmentType = safeString(requestData.assessmentType || results.assessmentType || 'Assessment');
    const displayName = getAssessmentDisplayName(assessmentType);

    // Get dimension scores safely
    const dimensionScores = getDimensionScores(results.dimensions || results.dimensionScores);
    const overallScore = typeof results.overallScore === 'number' ? results.overallScore : 0;
    const detailedInsights = generateDetailedInsights(dimensionScores, assessmentType);
    const careerRecommendations = generateCareerRecommendations(dimensionScores, assessmentType);

    // Build comprehensive HTML report
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${assessmentType} Assessment Report</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: #f9f9f9;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #4A90E2; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 { 
            color: #4A90E2; 
            margin: 0; 
            font-size: 2.5em;
            font-weight: 300;
        }
        .section { 
            margin: 30px 0; 
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section h2 { 
            color: #4A90E2; 
            border-bottom: 2px solid #E3F2FD; 
            padding-bottom: 10px;
            margin-top: 0;
        }
        .score-box { 
            background: linear-gradient(135deg, #4A90E2, #7B1FA2); 
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            text-align: center; 
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
        }
        .score-box .score { 
            font-size: 3em; 
            font-weight: bold; 
            margin: 0;
        }
        .score-box .label { 
            font-size: 1.2em; 
            opacity: 0.9;
        }
        .dimension { 
            margin: 15px 0; 
            padding: 15px;
            background: #F8F9FA;
            border-radius: 8px;
            border-left: 4px solid #4A90E2;
        }
        .dimension-name { 
            font-weight: bold; 
            color: #333;
            margin-bottom: 8px;
        }
        .progress-bar { 
            background: #E0E0E0; 
            border-radius: 10px; 
            overflow: hidden; 
            height: 20px;
            margin: 8px 0;
        }
        .progress-fill { 
            height: 100%; 
            background: linear-gradient(90deg, #4A90E2, #7B1FA2); 
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        .candidate-info { 
            background: #E3F2FD; 
            padding: 20px; 
            border-radius: 8px;
            margin: 20px 0;
        }
        .candidate-info h3 { 
            margin-top: 0; 
            color: #4A90E2;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        .info-item {
            background: white;
            padding: 10px 15px;
            border-radius: 5px;
            border-left: 3px solid #4A90E2;
        }
        .recommendations {
            background: #F3E5F5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .recommendations h3 {
            color: #7B1FA2;
            margin-top: 0;
        }
        .recommendation-item {
            background: white;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            border-left: 3px solid #7B1FA2;
        }
        @media print {
            body { background: white; }
            .section { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <img src="https://jlbftyjewxgetxcihban.supabase.co/storage/v1/object/public/assessment-logos/authencore-logo-transparent.png" 
                 alt="AuthenCore Analytics" style="height: 60px; margin-right: 20px;">
            <div>
                <h1 style="margin: 0; font-weight: bold;">${displayName} Assessment Report</h1>
                <p style="font-size: 1.2em; color: #666; margin: 5px 0 0 0;">Professional Psychometric Assessment</p>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="candidate-info">
            <h3>Candidate Information</h3>
            <div class="info-grid">
                <div class="info-item"><strong>Name:</strong> ${safeString(userData.name)}</div>
                <div class="info-item"><strong>Email:</strong> ${safeString(userData.email)}</div>
                ${userData.position ? `<div class="info-item"><strong>Position:</strong> ${safeString(userData.position)}</div>` : ''}
                ${userData.company || userData.organization ? `<div class="info-item"><strong>Organization:</strong> ${safeString(userData.company || userData.organization)}</div>` : ''}
                <div class="info-item"><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Overall Assessment Score</h2>
        <div class="score-box">
            <div class="score">${overallScore}/100</div>
            <div class="label">Overall Performance Score</div>
            <div style="margin-top: 10px; font-size: 1.1em;">
                Performance Level: ${overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : overallScore >= 55 ? 'Developing' : 'Needs Improvement'}
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Detailed Dimension Analysis</h2>
        ${Object.entries(dimensionScores).map(([dimension, score]) => {
          const formattedName = dimension.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const scoreNum = typeof score === 'number' ? score : 0;
          const level = scoreNum >= 80 ? 'Strong' : scoreNum >= 60 ? 'Moderate' : 'Developing';
          const color = scoreNum >= 80 ? '#4CAF50' : scoreNum >= 60 ? '#FF9800' : '#F44336';
          
          return `
            <div class="dimension">
                <div class="dimension-name">${formattedName}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${scoreNum}%; background: ${color};">
                        ${scoreNum}/100
                    </div>
                </div>
                <div style="margin-top: 8px; color: #666; font-size: 0.9em;">
                    Performance Level: ${level} | 
                    ${scoreNum >= 80 ? 'Exceptional performance in this area' : 
                      scoreNum >= 60 ? 'Good performance with room for growth' : 
                      'Priority area for development'}
                </div>
            </div>
          `;
        }).join('')}
    </div>

    <div class="section">
        <h2>Professional Insights & Analysis</h2>
        <div style="line-height: 1.8; font-size: 1em;">
            ${detailedInsights}
        </div>
    </div>

    <div class="section">
        <h2>Career Development Recommendations</h2>
        <div style="line-height: 1.8; font-size: 1em;">
            ${careerRecommendations}
        </div>
    </div>

    <div class="section">
        <div class="recommendations">
            <h3>Strategic Development Plan</h3>
            <div class="recommendation-item">
                <strong>Immediate Actions (Next 30 Days):</strong> Begin focusing on your priority development areas through targeted reading, online courses, or seeking feedback from colleagues and supervisors.
            </div>
            <div class="recommendation-item">
                <strong>Short-term Goals (3-6 Months):</strong> Implement specific skill-building activities, consider mentorship opportunities, and practice new competencies in safe environments.
            </div>
            <div class="recommendation-item">
                <strong>Long-term Development (6-12 Months):</strong> Pursue formal training programs, seek stretch assignments that challenge your growth areas, and regularly reassess progress.
            </div>
            <div class="recommendation-item">
                <strong>Performance Monitoring:</strong> Schedule quarterly reviews of your development progress and adjust strategies based on feedback and results.
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Assessment Methodology & Reliability</h2>
        <p style="line-height: 1.6; color: #555;">
            This assessment utilizes validated psychometric instruments based on established psychological frameworks. 
            The scoring algorithms incorporate normative data from diverse professional populations to ensure accuracy and relevance. 
            Results should be interpreted by qualified professionals and used in conjunction with other assessment methods for comprehensive evaluation.
        </p>
    </div>

    <!-- Footer with Copyright and Privacy -->
    <div style="background: #f8f9fa; padding: 30px; margin-top: 40px; border-radius: 10px; border-top: 3px solid #4A90E2;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://jlbftyjewxgetxcihban.supabase.co/storage/v1/object/public/assessment-logos/authencore-logo-transparent.png" 
                 alt="AuthenCore Analytics" style="height: 40px; opacity: 0.8;">
        </div>
        
        <div style="font-size: 0.85em; color: #666; line-height: 1.4;">
            <p style="text-align: center; margin: 10px 0;"><strong>© 2024 AuthenCore Analytics. All rights reserved.</strong></p>
            <p style="text-align: center; margin: 10px 0;">AuthenCore™ is a trademark of AuthenCore Analytics.</p>
            
            <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
            
            <p style="margin: 10px 0;"><strong>Confidentiality Notice:</strong> This report contains confidential and proprietary information. Unauthorized reproduction, distribution, or disclosure is strictly prohibited.</p>
            
            <p style="margin: 10px 0;"><strong>Privacy & Data Protection:</strong> Personal data is processed in accordance with our Privacy Policy and applicable data protection laws including GDPR. For our complete privacy policy, visit www.authencore.org/privacy</p>
            
            <p style="margin: 10px 0;"><strong>Disclaimer:</strong> This assessment and report are provided for educational and professional development purposes only. The results are based on self-reported data and structured using validated psychological frameworks interpreted through AI algorithms. These results are not clinical tools and should not be used to diagnose, treat, or manage any mental health condition. If you have concerns about your mental health or wellbeing, please consult a qualified mental health professional or licensed psychologist.</p>
            
            <p style="text-align: center; margin: 15px 0 5px 0; font-size: 0.8em; color: #888;">
                Report Generated: ${new Date().toLocaleString()} | Document ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
        </div>
    </div>
</body>
</html>`;

    logStep("Report generated successfully");

    return new Response(htmlContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html",
      },
    });

  } catch (error) {
    logStep("Error occurred", { error: error.message });
    console.error("Error in generate-pdf-report:", error);
    
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || "An error occurred while generating the report",
        },
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});