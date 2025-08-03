import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Users, Database, FileText, AlertTriangle } from 'lucide-react';

interface ConsentAgreementProps {
  onAccept: () => void;
  onDecline: () => void;
  assessmentType: string;
  userType?: 'applicant' | 'employer' | 'partner';
}

export const ConsentAgreement: React.FC<ConsentAgreementProps> = ({
  onAccept,
  onDecline,
  assessmentType,
  userType = 'applicant'
}) => {
  const [consentItems, setConsentItems] = useState({
    dataCollection: false,
    dataProcessing: false,
    dataSharing: false,
    internationalTransfer: false,
    reportGeneration: false,
    legalTerms: false
  });

  const allConsentsGiven = Object.values(consentItems).every(item => item === true);

  const handleConsentChange = (key: keyof typeof consentItems, checked: boolean) => {
    setConsentItems(prev => ({ ...prev, [key]: checked }));
  };

  const handleAccept = () => {
    if (allConsentsGiven) {
      // Store consent with timestamp
      const consentRecord = {
        userType,
        assessmentType,
        consentGiven: consentItems,
        timestamp: new Date().toISOString(),
        ipAddress: 'recorded', // IP would be captured server-side
        userAgent: navigator.userAgent
      };
      
      localStorage.setItem(`assessment_consent_${assessmentType}`, JSON.stringify(consentRecord));
      onAccept();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Assessment Consent Agreement
            </CardTitle>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="outline">{assessmentType}</Badge>
              <Badge variant="secondary">{userType}</Badge>
              <Badge variant="outline">International Compliance</Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              Please review and accept the following terms to proceed with your assessment
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Important Notice */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">Important Legal Notice</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    This assessment is governed by international data protection laws including GDPR, CCPA, and other applicable regulations.
                    Your consent is required for legal compliance and to ensure your data protection rights.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent Items */}
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-4">
                
                {/* Data Collection */}
                <Card className="border-muted hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Checkbox
                          id="dataCollection"
                          checked={consentItems.dataCollection}
                          onCheckedChange={(checked) => handleConsentChange('dataCollection', checked as boolean)}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="w-5 h-5 text-primary" />
                          <label htmlFor="dataCollection" className="font-semibold cursor-pointer text-lg">
                            Data Collection & Storage
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          I consent to the collection, storage, and processing of my assessment responses, demographic information, 
                          and metadata for the purpose of generating my psychological assessment report. Data is stored securely 
                          using enterprise-grade encryption and access controls.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Processing */}
                <Card className="border-muted hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Checkbox
                          id="dataProcessing"
                          checked={consentItems.dataProcessing}
                          onCheckedChange={(checked) => handleConsentChange('dataProcessing', checked as boolean)}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-5 h-5 text-primary" />
                          <label htmlFor="dataProcessing" className="font-semibold cursor-pointer text-lg">
                            AI-Powered Analysis & Processing
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          I consent to the use of artificial intelligence and machine learning algorithms to analyze my responses 
                          and generate insights. This includes natural language processing, statistical analysis, and comparison 
                          with normative databases for accurate assessment results.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Sharing */}
                <Card className="border-muted hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Checkbox
                          id="dataSharing"
                          checked={consentItems.dataSharing}
                          onCheckedChange={(checked) => handleConsentChange('dataSharing', checked as boolean)}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-5 h-5 text-primary" />
                          <label htmlFor="dataSharing" className="font-semibold cursor-pointer text-lg">
                            Authorized Report Sharing
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {userType === 'applicant' && (
                            <>I understand that my assessment results may be shared with authorized personnel (HR, hiring managers, 
                            supervisors) as part of employment processes, performance reviews, or development programs.</>
                          )}
                          {userType === 'employer' && (
                            <>I consent to sharing candidate assessment results with authorized organizational stakeholders 
                            for hiring, development, and organizational planning purposes.</>
                          )}
                          {userType === 'partner' && (
                            <>I consent to sharing aggregate and individual assessment data with partner organizations 
                            for consulting, development, and organizational improvement purposes.</>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* International Transfer */}
                <Card className="border-muted hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Checkbox
                          id="internationalTransfer"
                          checked={consentItems.internationalTransfer}
                          onCheckedChange={(checked) => handleConsentChange('internationalTransfer', checked as boolean)}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-5 h-5 text-primary" />
                          <label htmlFor="internationalTransfer" className="font-semibold cursor-pointer text-lg">
                            International Data Transfer
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          I consent to the transfer of my data to secure servers and processing facilities located globally, 
                          including but not limited to the United States, European Union, and other jurisdictions with adequate 
                          data protection safeguards. All transfers comply with applicable international data protection frameworks.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Report Generation */}
                <Card className="border-muted hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Checkbox
                          id="reportGeneration"
                          checked={consentItems.reportGeneration}
                          onCheckedChange={(checked) => handleConsentChange('reportGeneration', checked as boolean)}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <label htmlFor="reportGeneration" className="font-semibold cursor-pointer text-lg">
                            Report Generation & Distribution
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          I consent to the generation of detailed assessment reports in PDF format, which may include personal 
                          insights, recommendations, and graphical representations of my results. These reports may be downloaded, 
                          printed, or shared electronically with authorized parties.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Legal Terms */}
                <Card className="border-muted hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <Checkbox
                          id="legalTerms"
                          checked={consentItems.legalTerms}
                          onCheckedChange={(checked) => handleConsentChange('legalTerms', checked as boolean)}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <label htmlFor="legalTerms" className="font-semibold cursor-pointer text-lg">
                            Legal Terms & Liability
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          I acknowledge that this assessment is for educational and development purposes only and should not be 
                          used for clinical diagnosis. I understand my data protection rights including access, rectification, 
                          erasure, and portability. I agree to the Terms of Service and Privacy Policy, and understand that 
                          AuthenCore Analytics limits liability as outlined in the terms.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </ScrollArea>

            {/* Footer Information */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <h4 className="font-semibold mb-2">Your Rights:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Right to withdraw consent at any time</li>
                <li>• Right to access your personal data</li>
                <li>• Right to rectification and erasure</li>
                <li>• Right to data portability</li>
                <li>• Right to lodge a complaint with supervisory authorities</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={handleAccept}
                disabled={!allConsentsGiven}
                className="flex-1"
                size="lg"
              >
                Accept & Continue Assessment
              </Button>
              <Button 
                variant="outline"
                onClick={onDecline}
                className="flex-1"
                size="lg"
              >
                Decline & Exit
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By clicking "Accept & Continue Assessment", you provide your informed consent for the processing 
              of your personal data as described above. This consent is recorded with timestamp and technical metadata 
              for legal compliance purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsentAgreement;