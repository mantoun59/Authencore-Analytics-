import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, Users, BookOpen, Settings, AlertTriangle, CheckCircle, XCircle, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header & Introduction */}
        <section className="support-header mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Professional Development Support Center</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Welcome to the Authencore Analytics Support Center. We're here to help you make the most of your professional development exploration journey and ensure you have the best possible experience with our development insights platform.
            </p>
          </div>
          
          <Alert className="bg-gradient-subtle border-primary/20 mb-8">
            <Target className="h-4 w-4" />
            <AlertDescription className="text-foreground">
              <strong className="text-primary">🔍 Development Insights Platform</strong>
              <br />
              Our platform provides exploratory insights for professional development and self-reflection. 
              Results are suggestive starting points for growth conversations, not definitive assessments or diagnoses.
            </AlertDescription>
          </Alert>
        </section>

        {/* Quick Help Section */}
        <section className="quick-help mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Quick Help & Getting Started</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  🚀 Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li><a href="#getting-started" className="text-primary hover:underline">How to begin your development exploration</a></li>
                  <li><a href="#choosing-areas" className="text-primary hover:underline">Choosing the right development areas</a></li>
                  <li><a href="#understanding-process" className="text-primary hover:underline">Understanding the exploration process</a></li>
                  <li><a href="#time-commitment" className="text-primary hover:underline">Time commitment and preparation</a></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  📊 Understanding Your Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li><a href="#reading-insights" className="text-primary hover:underline">How to read your development insights</a></li>
                  <li><a href="#interpreting-patterns" className="text-primary hover:underline">Understanding response patterns</a></li>
                  <li><a href="#using-recommendations" className="text-primary hover:underline">Using growth recommendations effectively</a></li>
                  <li><a href="#limitations" className="text-primary hover:underline">Important limitations to remember</a></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  🔧 Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li><a href="#technical-issues" className="text-primary hover:underline">Common technical issues</a></li>
                  <li><a href="#browser-support" className="text-primary hover:underline">Browser compatibility</a></li>
                  <li><a href="#mobile-access" className="text-primary hover:underline">Mobile device access</a></li>
                  <li><a href="#account-management" className="text-primary hover:underline">Account and login help</a></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  💼 For Organizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li><a href="#team-setup" className="text-primary hover:underline">Setting up team development programs</a></li>
                  <li><a href="#bulk-access" className="text-primary hover:underline">Managing multiple user access</a></li>
                  <li><a href="#organizational-insights" className="text-primary hover:underline">Understanding team insights</a></li>
                  <li><a href="#integration-support" className="text-primary hover:underline">Platform integration support</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="faq-section mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            {/* Platform Understanding */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🎯 Understanding the Platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">What is Authencore Analytics?</h4>
                  <p className="text-muted-foreground">
                    Authencore Analytics is a professional development and career exploration platform. We provide structured self-discovery experiences that help you explore your workplace preferences, communication tendencies, and career interests. Our tools are designed to support professional growth conversations and development planning.
                  </p>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">How are your development tools different from psychological tests?</h4>
                  <p className="text-muted-foreground">
                    Our tools are designed for professional development and self-reflection, not psychological assessment or diagnosis. We provide exploratory insights based on your response patterns to help you understand your workplace preferences and professional tendencies. These insights are starting points for development conversations, not definitive measurements or clinical evaluations.
                  </p>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">Can I use these insights for hiring or employee evaluation?</h4>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive font-semibold mb-2">No.</p>
                    <p className="text-foreground">
                      Our platform is designed for professional development and career exploration only. It is not intended for employment selection, evaluation, or personnel decisions. Organizations should use our tools to support employee development conversations and team building activities, not for hiring or performance evaluation purposes.
                    </p>
                  </div>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">How accurate are the development insights?</h4>
                  <p className="text-muted-foreground">
                    Our insights are based on your responses and general patterns observed in similar response profiles. Individual experiences vary significantly, and results should be considered as starting points for further exploration and professional development conversations. We recommend discussing insights with mentors, coaches, or career counselors for personalized interpretation and application.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Using the Platform */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔍 Using the Development Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">Which development area should I explore first?</h4>
                  <p className="text-muted-foreground mb-3">Choose based on your current professional development goals:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong className="text-foreground">Career exploration:</strong> Start with Career Path Exploration</li>
                    <li><strong className="text-foreground">Workplace effectiveness:</strong> Try Communication Style Discovery</li>
                    <li><strong className="text-foreground">Leadership development:</strong> Begin with Leadership Approach Insights</li>
                    <li><strong className="text-foreground">Team dynamics:</strong> Explore Cultural Intelligence Building</li>
                    <li><strong className="text-foreground">Work-life balance:</strong> Consider Digital Wellness Awareness</li>
                  </ul>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">How long does each exploration take?</h4>
                  <p className="text-muted-foreground mb-3">Development explorations range from 8-25 minutes depending on the area:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Digital Wellness: 8-12 minutes</li>
                    <li>Communication Styles: 10-15 minutes</li>
                    <li>Leadership Approaches: 15-20 minutes</li>
                    <li>Values & Purpose: 20-25 minutes (most comprehensive)</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">You can pause and resume any exploration if needed.</p>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">Can I retake a development exploration?</h4>
                  <p className="text-muted-foreground">
                    Yes! You can retake any exploration after 30 days. Professional development is an ongoing journey, and your preferences and insights may evolve over time. We recommend retaking explorations annually or when experiencing significant career transitions.
                  </p>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">How should I use my development insights?</h4>
                  <p className="text-muted-foreground mb-3">Your insights are most valuable when used as discussion starters and reflection tools:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Share with mentors or career coaches for deeper exploration</li>
                    <li>Use in professional development planning conversations</li>
                    <li>Discuss with team members to improve collaboration</li>
                    <li>Apply recommendations in your current role</li>
                    <li>Consider insights when exploring new opportunities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* For Organizations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">💼 For Organizations & Teams</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">How can organizations use this platform appropriately?</h4>
                  <p className="text-muted-foreground mb-3">Organizations can use our platform to support:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Employee professional development initiatives</li>
                    <li>Team building and communication training</li>
                    <li>Career development planning conversations</li>
                    <li>Leadership development programs</li>
                    <li>Professional growth discussion facilitation</li>
                  </ul>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-3">
                    <p className="text-destructive font-semibold mb-2">Not appropriate for:</p>
                    <p className="text-foreground">Hiring decisions, performance evaluations, or personnel selection.</p>
                  </div>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">Can managers see individual employee results?</h4>
                  <p className="text-muted-foreground">
                    Individual development insights remain private unless employees choose to share them. Organizations can access aggregated insights about team development patterns and preferences, but not individual detailed results. This ensures privacy while supporting team development initiatives.
                  </p>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">How do we set up team development programs?</h4>
                  <p className="text-muted-foreground mb-3">Contact our organizational support team to:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Set up bulk access for your team</li>
                    <li>Configure appropriate development areas for your goals</li>
                    <li>Receive facilitation guides for team discussions</li>
                    <li>Access aggregated insights and team development resources</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Technical Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔧 Technical Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">What browsers are supported?</h4>
                  <p className="text-muted-foreground mb-3">Our platform works best on modern browsers:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Chrome 90+ (recommended)</li>
                    <li>Firefox 88+</li>
                    <li>Safari 14+</li>
                    <li>Edge 90+</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">Mobile browsers are fully supported on iOS and Android devices.</p>
                </div>
                
                <div className="faq-item">
                  <h4 className="font-semibold text-foreground mb-2">I'm having trouble accessing my account</h4>
                  <p className="text-muted-foreground mb-3">Try these steps:</p>
                  <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                    <li>Check your email for a verification link</li>
                    <li>Try resetting your password</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Try a different browser or incognito mode</li>
                    <li>Contact support if issues persist</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Guidelines & Best Practices */}
        <section className="guidelines-section mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Best Practices for Using Development Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  ✅ Recommended Uses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-700">
                  <li>Professional development planning and goal setting</li>
                  <li>Career exploration and path discovery</li>
                  <li>Team communication and collaboration improvement</li>
                  <li>Self-reflection and professional awareness building</li>
                  <li>Coaching and mentoring conversation starters</li>
                  <li>Professional development program design</li>
                  <li>Leadership development and training support</li>
                  <li>Workplace effectiveness skill building</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  ❌ Inappropriate Uses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-red-700">
                  <li>Hiring or recruitment decisions</li>
                  <li>Employee performance evaluations</li>
                  <li>Clinical or psychological diagnosis</li>
                  <li>Medical or therapeutic purposes</li>
                  <li>Academic grading or credentialing</li>
                  <li>Legal or forensic evaluation</li>
                  <li>Definitive life or career decisions without additional input</li>
                  <li>Discrimination in employment or education</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact & Support Options */}
        <section className="contact-support mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Get Help & Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  📧 Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">For general questions, technical issues, or platform guidance:</p>
                <p className="font-semibold text-foreground mb-2">support@authencore.org</p>
                <p className="text-sm text-muted-foreground">Response time: Within 24 hours on business days</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  💼 Organizational Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">For team setups, bulk access, and organizational development programs:</p>
                <p className="font-semibold text-foreground mb-2">organizations@authencore.org</p>
                <p className="text-sm text-muted-foreground">Dedicated support for HR and L&D professionals</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  🎓 Professional Development Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">For questions about using insights effectively in your development journey:</p>
                <p className="font-semibold text-foreground mb-2">development@authencore.org</p>
                <p className="text-sm text-muted-foreground">Tips and guidance for maximizing your professional growth</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  🔧 Technical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">For login problems, technical bugs, or platform accessibility:</p>
                <p className="font-semibold text-foreground mb-2">technical@authencore.org</p>
                <p className="text-sm text-muted-foreground">Priority support for technical difficulties</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy & Data Protection */}
        <section className="privacy-section mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Privacy & Data Protection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🔒 Your Development Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your responses and development insights are encrypted and securely stored. We use enterprise-grade security measures to protect your personal and professional development information.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>👥 Data Sharing & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Individual development insights remain private unless you choose to share them. Organizations can access aggregated, anonymized patterns for team development purposes, but not individual detailed results.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>📊 How We Use Your Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your responses help generate your personalized development insights and improve our platform's ability to provide relevant recommendations. We do not use your data for research or external purposes without explicit consent.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>🗑️ Data Deletion & Portability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can download your development insights at any time and request deletion of your account and data. We comply with GDPR and other privacy regulations to ensure you maintain control over your information.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              <Link to="/privacy-policy" className="text-primary hover:underline">Read our complete Privacy Policy</Link> | 
              <Link to="/terms-of-service" className="text-primary hover:underline ml-2">Terms of Service</Link>
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-subtle border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Ready to Begin Your Professional Development Journey?</CardTitle>
              <CardDescription className="text-lg">
                Explore your workplace preferences, discover your communication style, and unlock your professional potential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/assessment">Start Your Development Exploration</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More About Our Platform</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;