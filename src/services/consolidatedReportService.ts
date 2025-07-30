// Consolidated Report Service - HTML generation only
import { toast } from "sonner";

export interface ReportConfig {
  title: string;
  type: 'candidate' | 'employer';
  candidate: { name: string; email: string; date: string; };
  scores: Array<{ dimension: string; score: number; percentile: number; }>;
  summary: string;
  recommendations: string[];
}

export class ConsolidatedReportService {
  static async generateReport(config: ReportConfig): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html><head><title>${config.title}</title>
<style>body{font-family:Arial;padding:20px}h1{color:#008080}.score{font-size:18px;font-weight:bold;color:#008080;margin:10px 0}@media print{body{margin:0}}</style>
</head><body><h1>${config.title}</h1><h2>Candidate: ${config.candidate.name}</h2><p>Email: ${config.candidate.email}</p><p>Date: ${config.candidate.date}</p>
<h3>Scores:</h3>${config.scores.map(s => `<div class="score">${s.dimension}: ${s.score}%</div>`).join('')}
<h3>Summary:</h3><p>${config.summary}</p><h3>Recommendations:</h3><ul>${config.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
<p>Generated: ${new Date().toLocaleDateString()}</p></body></html>`;
    
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      toast.success('Report generated successfully!');
    }
  }
}