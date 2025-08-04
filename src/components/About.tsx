import { 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  Users, 
  Target, 
  Brain, 
  Shield, 
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Info,
  MessageSquare,
  Globe,
  Heart,
  Award,
  Zap,
  ArrowRight,
  GraduationCap,
  Handshake,
  BarChart3,
  Smartphone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import businessPresentationImage from "@/assets/business-presentation.jpg";
import professionalAssessmentImage from "@/assets/professional-assessment.jpg";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4">
          <ComplianceDisclaimer type="site-wide" className="mb-8" />
          
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4">
              Professional Development Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About Authencore Analytics
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">
              Empowering Professional Development Through Self-Discovery
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Authencore Analytics is a comprehensive professional development platform designed to help individuals, teams, and organizations explore workplace preferences, communication tendencies, and career interests through structured self-discovery experiences.
            </p>
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide accessible, insightful, and actionable professional development tools that help people understand their workplace preferences, discover their career interests, and create meaningful paths for professional growth and success.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment">
                <Button size="lg" className="group">
                  Start Your Development Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/#features">
                <Button variant="outline" size="lg">
                  Explore Development Areas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Philosophy */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Approach to Professional Development</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🔍 Exploration Over Assessment</h3>
              <p className="text-muted-foreground">
                We believe in self-discovery through structured exploration rather than definitive testing. Our tools help you understand your tendencies and preferences as starting points for professional development conversations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Development-Focused Insights</h3>
              <p className="text-muted-foreground">
                Every insight is designed to support your professional growth journey. We focus on actionable recommendations and practical strategies that you can apply in your workplace and career development.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🤝 Collaborative Growth</h3>
              <p className="text-muted-foreground">
                Professional development happens in community. Our tools are designed to facilitate meaningful conversations with mentors, coaches, colleagues, and teams about workplace dynamics and career aspirations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🧠 AI-Enhanced Understanding</h3>
              <p className="text-muted-foreground">
                We leverage artificial intelligence to identify patterns and provide personalized insights, while maintaining the human element essential for meaningful professional development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Platform Purpose & Appropriate Use</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <GraduationCap className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">🎓 Educational & Development Platform</h3>
              <p className="text-muted-foreground">
                Authencore Analytics is designed as a professional development and career exploration platform. Our tools provide insights for self-reflection, professional growth planning, and career development conversations.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">⚠️ Important Limitations</h3>
              <p className="text-muted-foreground mb-3">
                Our platform is <strong>not intended for</strong>:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mr-2 flex-shrink-0"></div>
                  Clinical or psychological diagnosis
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mr-2 flex-shrink-0"></div>
                  Employment selection or evaluation decisions
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mr-2 flex-shrink-0"></div>
                  Academic or professional credentialing
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mr-2 flex-shrink-0"></div>
                  Medical or therapeutic purposes
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mr-2 flex-shrink-0"></div>
                  Definitive life or career decisions
                </li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <Handshake className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">🤝 Professional Guidance Recommended</h3>
              <p className="text-muted-foreground">
                While our tools provide valuable insights for self-reflection and development planning, we recommend consulting with qualified career counselors, coaches, or other professionals for personalized guidance on important career and professional development decisions.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <BarChart3 className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">📊 Understanding Your Results</h3>
              <p className="text-muted-foreground">
                Your development insights are based on your responses to our exploration tools and general patterns observed in similar response patterns. Individual experiences vary significantly, and results should be considered as starting points for further exploration and professional development conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Innovation */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Technology Behind Your Development Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Modern Web Platform</h3>
              <p className="text-muted-foreground">
                Built with React 18, TypeScript, and modern web technologies to provide a fast, secure, and user-friendly experience across all devices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Advanced artificial intelligence analyzes response patterns to provide personalized insights and recommendations for professional development.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with encrypted data storage, secure authentication, and comprehensive privacy protections for all user information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Multi-Language Support</h3>
              <p className="text-muted-foreground">
                Available in English, Spanish, and French to serve diverse professional communities and global workplace environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Organizations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Supporting Organizational Development</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">Employee Development Programs</h3>
              <p className="text-muted-foreground">
                Enhance your professional development initiatives with structured tools that help employees explore their career interests, communication preferences, and workplace effectiveness strategies.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">Team Development Facilitation</h3>
              <p className="text-muted-foreground">
                Generate insights and discussion points for team development conversations, communication training programs, and collaborative workplace effectiveness initiatives.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">Career Development Support</h3>
              <p className="text-muted-foreground">
                Provide employees with tools to explore career paths within your organization and create personalized professional development plans aligned with business needs.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <BarChart3 className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-3">Professional Development Analytics</h3>
              <p className="text-muted-foreground">
                Understand professional development trends and preferences within your organization to inform learning and development strategy and program design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Get Started with Professional Development</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="text-center bg-card border border-border rounded-lg p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Individual Professionals</h3>
              <p className="text-muted-foreground mb-4">
                Begin your professional development journey today with our comprehensive career exploration and workplace effectiveness tools.
              </p>
              <Link to="/assessment">
                <Button className="w-full">
                  Start Your Development Journey
                </Button>
              </Link>
            </div>
            
            <div className="text-center bg-card border border-border rounded-lg p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Career Professionals</h3>
              <p className="text-muted-foreground mb-4">
                Enhance your coaching and counseling practice with structured professional development exploration tools and client insight generation.
              </p>
              <Link to="/assessment">
                <Button variant="outline" className="w-full">
                  Explore Professional Tools
                </Button>
              </Link>
            </div>
            
            <div className="text-center bg-card border border-border rounded-lg p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Organizations</h3>
              <p className="text-muted-foreground mb-4">
                Support your team development and employee professional growth initiatives with comprehensive workplace insights and development planning tools.
              </p>
              <Link to="/assessment">
                <Button variant="outline" className="w-full">
                  Learn About Organizational Solutions
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center bg-card border border-border rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-foreground mb-3">Questions or Support?</h3>
            <p className="text-muted-foreground mb-2">
              Our team is here to help you make the most of your professional development exploration experience.
            </p>
            <p className="text-muted-foreground">
              Email: <a href="mailto:support@authencore.org" className="text-primary hover:underline">support@authencore.org</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;