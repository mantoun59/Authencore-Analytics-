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
  Zap
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ComplianceDisclaimer type="site-wide" className="mb-16" />
        
        {/* Hero Image */}
        <div className="mb-16">
          <img 
            src={businessPresentationImage}
            alt="Professional business presentation showing development analytics and team collaboration"
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-elegant"
          />
        </div>

        {/* Mission Statement */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🎯 Our Mission
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About Authencore Analytics
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-8">
            Empowering Professional Development Through Self-Discovery
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Authencore Analytics is a comprehensive professional development platform designed to help 
            individuals, teams, and organizations explore workplace preferences, communication tendencies, 
            and career interests through structured self-discovery experiences.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-20">
          {/* Mission Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
              <Target className="w-6 h-6" />
              Our Mission
            </h3>
            <p className="text-lg text-foreground leading-relaxed">
              To provide accessible, insightful, and actionable professional development tools that help 
              people understand their workplace preferences, discover their career interests, and create 
              meaningful paths for professional growth and success.
            </p>
          </div>

          {/* Platform Philosophy */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Approach to Professional Development
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                    <BookOpen className="w-6 h-6" />
                    Exploration Over Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 dark:text-blue-400">
                    We believe in self-discovery through structured exploration rather than definitive testing. 
                    Our tools help you understand your tendencies and preferences as starting points for 
                    professional development conversations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
                    <TrendingUp className="w-6 h-6" />
                    Development-Focused Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-600 dark:text-green-400">
                    Every insight is designed to support your professional growth journey. We focus on 
                    actionable recommendations and practical strategies that you can apply in your 
                    workplace and career development.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
                    <Users className="w-6 h-6" />
                    Collaborative Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-600 dark:text-purple-400">
                    Professional development happens in community. Our tools are designed to facilitate 
                    meaningful conversations with mentors, coaches, colleagues, and teams about workplace 
                    dynamics and career aspirations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
                    <Brain className="w-6 h-6" />
                    AI-Enhanced Understanding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-600 dark:text-orange-400">
                    We leverage artificial intelligence to identify patterns and provide personalized insights, 
                    while maintaining the human element essential for meaningful professional development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What We Provide */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Professional Development Exploration Tools
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Career Interest Exploration</h3>
                <p className="text-sm text-muted-foreground">
                  Structured tools to help you explore career paths, understand your work preferences, 
                  and identify potential areas for professional growth and development.
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <MessageSquare className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Workplace Dynamics Understanding</h3>
                <p className="text-sm text-muted-foreground">
                  Insights into communication styles, team collaboration preferences, and leadership 
                  approaches to enhance your workplace effectiveness and professional relationships.
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Professional Development Planning</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered insights and personalized recommendations to help you create targeted 
                  professional development goals and action plans.
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Team Development Support</h3>
                <p className="text-sm text-muted-foreground">
                  Tools for organizations to facilitate team development conversations, understand 
                  team dynamics, and support employee professional growth initiatives.
                </p>
              </div>
            </div>
          </div>

          {/* Development Areas with Accurate Question Counts */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Professional Development Exploration Areas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-blue-500" />
                    Career Path Exploration
                  </CardTitle>
                  <CardDescription>15-20 minutes • 45 questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore career directions that align with your interests, values, and natural work preferences.
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Career interest patterns</li>
                    <li>• Work value alignment</li>
                    <li>• Industry fit exploration</li>
                    <li>• Growth pathway suggestions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    Communication Style Discovery
                  </CardTitle>
                  <CardDescription>10-15 minutes • 30 questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understand your communication preferences and learn to adapt your style for different workplace situations.
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Communication preference patterns</li>
                    <li>• Workplace interaction styles</li>
                    <li>• Conflict resolution approaches</li>
                    <li>• Team collaboration insights</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5 text-teal-500" />
                    Cultural Intelligence Building
                  </CardTitle>
                  <CardDescription>15-20 minutes • 40 questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Develop awareness of your cross-cultural competencies and strategies for effective global workplace collaboration.
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Cultural awareness patterns</li>
                    <li>• Cross-cultural adaptation strategies</li>
                    <li>• Global collaboration insights</li>
                    <li>• Diversity engagement approaches</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                    Emotional Intelligence Exploration
                  </CardTitle>
                  <CardDescription>12-18 minutes • 35 questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore your emotional awareness patterns and interpersonal relationship tendencies in professional settings.
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Emotional awareness patterns</li>
                    <li>• Interpersonal relationship insights</li>
                    <li>• Professional relationship strategies</li>
                    <li>• Workplace empathy development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="w-5 h-5 text-purple-500" />
                    Leadership Approach Insights
                  </CardTitle>
                  <CardDescription>15-20 minutes • 40 questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover your natural leadership tendencies and explore different leadership approaches for various workplace contexts.
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Leadership style preferences</li>
                    <li>• Team management approaches</li>
                    <li>• Situational leadership awareness</li>
                    <li>• Executive presence development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Values & Purpose Exploration
                  </CardTitle>
                  <CardDescription>20-25 minutes • 90 questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore your personal values and how they align with your professional goals and workplace preferences.
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Personal values exploration</li>
                    <li>• Work-life integration insights</li>
                    <li>• Purpose-driven career alignment</li>
                    <li>• Value-based decision making</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Important Disclaimers */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">
              Platform Purpose & Appropriate Use
            </h2>
            
            <div className="space-y-6">
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                    <BookOpen className="w-6 h-6" />
                    Educational & Development Platform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 dark:text-blue-400">
                    Authencore Analytics is designed as a professional development and career exploration platform. 
                    Our tools provide insights for self-reflection, professional growth planning, and career 
                    development conversations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="w-6 h-6" />
                    Important Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-amber-600 dark:text-amber-400">
                    <p className="mb-4">Our platform is <strong>not intended for</strong>:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Clinical or psychological diagnosis
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Employment selection or evaluation decisions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Academic or professional credentialing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Medical or therapeutic purposes
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Definitive life or career decisions
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
                    <Info className="w-6 h-6" />
                    Understanding Your Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-600 dark:text-green-400">
                    Your development insights are based on your responses to our exploration tools and general 
                    patterns observed in similar response patterns. Individual experiences vary significantly, 
                    and results should be considered as starting points for further exploration and professional 
                    development conversations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technology & Innovation */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">
              Technology Behind Your Development Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Modern Web Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Built with React 18, TypeScript, and modern web technologies to provide a fast, 
                  secure, and user-friendly experience across all devices.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced artificial intelligence analyzes response patterns to provide personalized 
                  insights and recommendations for professional development.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with encrypted data storage, secure authentication, 
                  and comprehensive privacy protections for all user information.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Multi-Language Support</h3>
                <p className="text-sm text-muted-foreground">
                  Available in English, Spanish, and French to serve diverse professional communities 
                  and global workplace environments.
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Get Started with Professional Development
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Individual Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Begin your professional development journey today with our comprehensive career 
                    exploration and workplace effectiveness tools.
                  </p>
                  <Link to="/assessment">
                    <Button size="lg" className="w-full">
                      Start Your Development Journey
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Career Professionals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Enhance your coaching and counseling practice with structured professional development 
                    exploration tools and client insight generation.
                  </p>
                  <Link to="/assessment">
                    <Button size="lg" variant="outline" className="w-full">
                      Explore Professional Tools
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Support your team development and employee professional growth initiatives with 
                    comprehensive workplace insights and development planning tools.
                  </p>
                  <Link to="/partner-login">
                    <Button size="lg" variant="outline" className="w-full">
                      Organizational Solutions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Questions or Support?</h3>
              <p className="text-muted-foreground mb-4">
                Our team is here to help you make the most of your professional development exploration experience.
              </p>
              <p className="text-muted-foreground">
                Email: <a href="mailto:support@authencore.org" className="text-primary hover:underline">support@authencore.org</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;