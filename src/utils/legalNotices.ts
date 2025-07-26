/**
 * Legal notices and copyright information for AuthenCore Analytics
 */

export const LEGAL_NOTICES = {
  copyright: "© 2024 AuthenCore Analytics. All rights reserved.",
  trademark: "AuthenCore™ is a trademark of AuthenCore Analytics.",
  disclaimerShort: "This report is for educational and development purposes only. Results are based on self-reported data and should not be used for clinical diagnosis.",
  disclaimerFull: `This assessment and report are provided for educational and personal development purposes only. The results are based on self-reported data and structured using validated psychological frameworks interpreted through AI algorithms. These results are not clinical tools and should not be used to diagnose, treat, or manage any mental health condition. If you have concerns about your mental health or wellbeing, please consult a qualified mental health professional or licensed psychologist.

AuthenCore Analytics makes no warranties, express or implied, regarding the accuracy, completeness, or suitability of this assessment for any particular purpose. The company shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of this assessment or report.`,
  confidentiality: "This report contains confidential and proprietary information. Unauthorized reproduction, distribution, or disclosure is strictly prohibited.",
  dataProtection: "Personal data is processed in accordance with our Privacy Policy and applicable data protection laws including GDPR."
};

export const formatCopyrightLine = (): string => {
  return `${LEGAL_NOTICES.copyright} ${LEGAL_NOTICES.trademark}`;
};

export const formatFullLegalFooter = (): string => {
  return `${LEGAL_NOTICES.copyright}
${LEGAL_NOTICES.trademark}
${LEGAL_NOTICES.confidentiality}
${LEGAL_NOTICES.dataProtection}

${LEGAL_NOTICES.disclaimerShort}`;
};

export const formatPDFLegalFooter = (): string[] => {
  return [
    LEGAL_NOTICES.copyright,
    LEGAL_NOTICES.trademark,
    "",
    LEGAL_NOTICES.confidentiality,
    LEGAL_NOTICES.dataProtection,
    "",
    LEGAL_NOTICES.disclaimerShort
  ];
};

export const formatComprehensiveLegalNotice = (): string => {
  return `${LEGAL_NOTICES.copyright}
${LEGAL_NOTICES.trademark}

${LEGAL_NOTICES.confidentiality}
${LEGAL_NOTICES.dataProtection}

DISCLAIMER:
${LEGAL_NOTICES.disclaimerFull}`;
};