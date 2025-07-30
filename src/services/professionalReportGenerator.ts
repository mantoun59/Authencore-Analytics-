// Professional Report Generator - HTML generation only
import { toast } from "sonner";

export interface ProfessionalReportConfig {
  candidateData: { name: string; email: string; date: string; };
  scores: Array<{ name: string; percentile: number; level: string; description: string; }>;
  validity: { consistencyScore: number; overallValidity: string; };
  actionPlan: string[];
  reportType: 'candidate' | 'employer';
}

export async function generateProfessionalReport(config: ProfessionalReportConfig): Promise<void> {
  const htmlContent = `
<!DOCTYPE html>
<html><head><title>Professional Assessment Report</title>
<style>body{font-family:Arial;padding:20px;line-height:1.6}h1{color:#008080;border-bottom:2px solid #008080;padding-bottom:10px}.score-item{background:#f9f9f9;padding:10px;margin:10px 0;border-left:4px solid #008080}@media print{body{margin:0;padding:15px}}</style>
</head><body><h1>Professional Assessment Report</h1>
<div><h2>Candidate Information</h2><p><strong>Name:</strong> ${config.candidateData.name}</p><p><strong>Email:</strong> ${config.candidateData.email}</p><p><strong>Date:</strong> ${config.candidateData.date}</p></div>
<h2>Assessment Scores</h2>${config.scores.map(s => `<div class="score-item"><strong>${s.name}</strong><div>Score: ${s.percentile}% (${s.level})</div><div>${s.description}</div></div>`).join('')}
<h2>Validity Assessment</h2><p><strong>Consistency:</strong> ${config.validity.consistencyScore}%</p><p><strong>Validity:</strong> ${config.validity.overallValidity}</p>
<h2>Action Plan</h2>${config.actionPlan.map((a, i) => `<div>${i + 1}. ${a}</div>`).join('')}
<div style="margin-top:40px;font-size:12px;color:#666;"><p>Generated: ${new Date().toLocaleDateString()}</p></div></body></html>`;
  
  const reportWindow = window.open('', '_blank', 'width=900,height=700');
  if (reportWindow) {
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    toast.success('Professional report generated!');
  }
}

export class ProfessionalReportGenerator {
  static async generateReport(config: ProfessionalReportConfig): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html><head><title>Professional Assessment Report</title>
<style>body{font-family:Arial;padding:20px;line-height:1.6}h1{color:#008080;border-bottom:2px solid #008080;padding-bottom:10px}.score-item{background:#f9f9f9;padding:10px;margin:10px 0;border-left:4px solid #008080}@media print{body{margin:0;padding:15px}}</style>
</head><body><h1>Professional Assessment Report</h1>
<div><h2>Candidate Information</h2><p><strong>Name:</strong> ${config.candidateData.name}</p><p><strong>Email:</strong> ${config.candidateData.email}</p><p><strong>Date:</strong> ${config.candidateData.date}</p></div>
<h2>Assessment Scores</h2>${config.scores.map(s => `<div class="score-item"><strong>${s.name}</strong><div>Score: ${s.percentile}% (${s.level})</div><div>${s.description}</div></div>`).join('')}
<h2>Validity Assessment</h2><p><strong>Consistency:</strong> ${config.validity.consistencyScore}%</p><p><strong>Validity:</strong> ${config.validity.overallValidity}</p>
<h2>Action Plan</h2>${config.actionPlan.map((a, i) => `<div>${i + 1}. ${a}</div>`).join('')}
<div style="margin-top:40px;font-size:12px;color:#666;"><p>Generated: ${new Date().toLocaleDateString()}</p></div></body></html>`;
    
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      toast.success('Professional report generated!');
    }
  }
}