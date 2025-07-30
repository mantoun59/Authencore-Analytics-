// Unified Assessment Service - HTML generation only
import { toast } from "sonner";

export interface AssessmentResult {
  id: string;
  candidateInfo: { name: string; email: string; date: string; };
  scores: Record<string, number>;
  overallScore: number;
  assessmentType: string;
}

export class UnifiedAssessmentService {
  static async generateReport(result: AssessmentResult): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html><head><title>${result.assessmentType} Assessment Report</title>
<style>body{font-family:Arial;padding:20px}h1{color:#008080}.score{font-size:18px;font-weight:bold;color:#008080;margin:10px 0}@media print{body{margin:0}}</style>
</head><body><h1>${result.assessmentType} Assessment Report</h1><h2>Candidate: ${result.candidateInfo.name}</h2><p>Email: ${result.candidateInfo.email}</p><p>Date: ${result.candidateInfo.date}</p>
<div class="score">Overall Score: ${result.overallScore}%</div><h3>Detailed Scores:</h3>
${Object.entries(result.scores).map(([k, v]) => `<div class="score">${k.replace(/_/g, ' ')}: ${v}%</div>`).join('')}
<p>Generated: ${new Date().toLocaleDateString()}</p></body></html>`;
    
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      toast.success('Assessment report generated!');
    }
  }
}