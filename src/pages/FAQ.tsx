import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Download, BookOpen, Users, Settings, HelpCircle, FileText, CheckCircle, 
  Building2, TrendingUp, Shield, Briefcase, Globe, Target, DollarSign, 
  Clock, Search, MessageCircle, Phone, Mail, ExternalLink, Star, 
  ChevronRight, Lightbulb, Award, Brain, Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const FAQ = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const faqCategories = [
    {
      id: "platform",
      title: "Platform Overview",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Understanding AuthenCore and our mission",
      questions: [
        {
          id: "what-is-authencore",
          question: "What is AuthenCore Analytics?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                AuthenCore Analytics is a comprehensive psychometric assessment platform that helps individuals and organizations make data-driven decisions about career development, hiring, and team building.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">For Individuals</h4>
                  </div>
                  <p className="text-sm text-blue-700">Discover your strengths, career fit, and development opportunities through scientifically validated assessments.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-900">For Organizations</h4>
                  </div>
                  <p className="text-sm text-green-700">Reduce hiring risks, improve team performance, and make objective talent decisions with our enterprise solutions.</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "mission",
          question: "What is your mission and vision?",
          answer: (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-l-4 border-primary">
                <p className="font-semibold text-primary text-lg">"Empowering authentic career decisions through validated psychological insights"</p>
              </div>
              <p className="text-foreground leading-relaxed">
                We believe everyone deserves to find work that aligns with their authentic self. Our mission is to provide scientifically rigorous yet accessible assessment tools that help people understand themselves and organizations build better teams.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: Award, text: "Scientifically validated assessment instruments" },
                  { icon: Shield, text: "Advanced validity detection and bias prevention" },
                  { icon: Target, text: "Personalized insights and development recommendations" },
                  { icon: TrendingUp, text: "Professional-grade reporting and analytics" },
                  { icon: Heart, text: "Ethical assessment practices and data protection" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: "assessments",
      title: "Assessment Information",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Everything about our assessment offerings",
      questions: [
        {
          id: "assessment-types",
          question: "What types of assessments do you offer?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">
                We offer 9 specialized assessments designed for different aspects of career and personal development:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Career Launch Assessment", desc: "Comprehensive career readiness and potential evaluation", icon: Target },
                  { title: "CAIR Personality Assessment", desc: "Core personality traits for workplace effectiveness", icon: Brain },
                  { title: "Stress Resilience Assessment", desc: "Ability to handle pressure and bounce back from setbacks", icon: Shield },
                  { title: "Cultural Intelligence Assessment", desc: "Skills for working effectively across cultures", icon: Globe },
                  { title: "Communication Styles Assessment", desc: "How you communicate and collaborate with others", icon: MessageCircle },
                  { title: "Emotional Intelligence Assessment", desc: "Understanding and managing emotions effectively", icon: Heart },
                  { title: "Authentic Leadership Assessment", desc: "Leadership style and potential evaluation", icon: Award },
                  { title: "Digital Wellness Assessment", desc: "Healthy technology use and digital balance", icon: Settings },
                  { title: "Gen Z Workplace Assessment", desc: "Modern workplace preferences and expectations", icon: TrendingUp }
                ].map((assessment, index) => (
                  <div key={index} className="group p-4 border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <assessment.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">{assessment.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{assessment.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        },
        {
          id: "how-long",
          question: "How long do assessments take to complete?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">Assessment duration varies by complexity and depth of analysis:</p>
              <div className="space-y-3">
                {[
                  { type: "Quick Assessments", time: "15-25 minutes", color: "green" },
                  { type: "Standard Assessments", time: "25-40 minutes", color: "blue" },
                  { type: "Comprehensive Assessments", time: "45-60 minutes", color: "purple" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <Badge variant="outline" className="font-medium">{item.time}</Badge>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  💡 <strong>Tip:</strong> You can pause and resume most assessments, but we recommend completing them in one session for the most accurate results.
                </p>
              </div>
            </div>
          )
        },
        {
          id: "how-to-take",
          question: "How do I take an assessment?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">Taking an assessment is simple and straightforward:</p>
              <div className="space-y-4">
                {[
                  { step: 1, text: "Create a free account or log in to your existing account", icon: Users },
                  { step: 2, text: "Choose the assessment that fits your needs", icon: Target },
                  { step: 3, text: "Answer questions honestly - there are no right or wrong answers", icon: MessageCircle },
                  { step: 4, text: "Receive your detailed report immediately upon completion", icon: FileText }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-semibold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <h5 className="font-semibold text-blue-900 dark:text-blue-100">Pro Tips for Best Results</h5>
                </div>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Answer based on your natural tendencies, not what you think is expected</li>
                  <li>• Find a quiet environment without distractions</li>
                  <li>• Don't overthink your responses - your first instinct is usually most accurate</li>
                  <li>• Ensure stable internet connection before starting</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          id: "reports",
          question: "What do I receive in my assessment report?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">Each assessment provides a comprehensive, personalized report including:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { text: "Detailed results with visual charts and graphs", icon: TrendingUp },
                  { text: "Professional PDF report for sharing or printing", icon: Download },
                  { text: "Personalized development recommendations", icon: Target },
                  { text: "Percentile rankings compared to similar professionals", icon: Award },
                  { text: "Career insights and role recommendations", icon: Briefcase },
                  { text: "AI-powered bias detection and quality assurance", icon: Shield }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="p-1 rounded bg-green-100 dark:bg-green-900">
                      <item.icon className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-green-800 dark:text-green-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: "business",
      title: "Business Solutions",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Enterprise and organizational solutions",
      questions: [
        {
          id: "enterprise-features",
          question: "What enterprise features do you offer?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">Our enterprise solutions are designed for organizations of all sizes:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Bulk Assessment Management", desc: "Administer assessments to multiple candidates simultaneously", icon: Users },
                  { title: "Custom Branding", desc: "White-label reports with your organization's branding", icon: Star },
                  { title: "Advanced Analytics", desc: "Team-wide insights and performance dashboards", icon: TrendingUp },
                  { title: "API Integration", desc: "Seamless integration with your existing HR systems", icon: Settings },
                  { title: "Dedicated Support", desc: "Priority customer success management", icon: MessageCircle },
                  { title: "Custom Pricing", desc: "Volume discounts and flexible payment options", icon: DollarSign }
                ].map((feature, index) => (
                  <div key={index} className="p-4 border border-border rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                        <feature.icon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">{feature.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  <strong>Enterprise Ready:</strong> SOC 2 compliant, GDPR ready, and built for scale with 99.9% uptime SLA.
                </p>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Technical requirements and support information",
      questions: [
        {
          id: "technical-requirements",
          question: "What are the technical requirements?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">Our platform works on all modern devices and browsers:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-orange-600" />
                    Supported Browsers
                  </h5>
                  <div className="space-y-2">
                    {[
                      "Chrome 90+ (recommended)",
                      "Firefox 88+",
                      "Safari 14+",
                      "Edge 90+"
                    ].map((browser, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded bg-orange-50 dark:bg-orange-950/20">
                        <CheckCircle className="h-3 w-3 text-orange-600" />
                        <span className="text-sm">{browser}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4 text-orange-600" />
                    Device Requirements
                  </h5>
                  <div className="space-y-2">
                    {[
                      "Stable internet connection",
                      "Modern smartphone, tablet, or computer",
                      "JavaScript enabled",
                      "Cookies enabled"
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded bg-orange-50 dark:bg-orange-950/20">
                        <CheckCircle className="h-3 w-3 text-orange-600" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "support",
          question: "How can I get technical support?",
          answer: (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">We offer multiple support channels to help you:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    title: "Email Support", 
                    desc: "Get detailed help via email", 
                    contact: "support@authencore.com",
                    icon: Mail,
                    color: "blue"
                  },
                  { 
                    title: "Live Chat", 
                    desc: "Instant support during business hours", 
                    contact: "Available 9AM-5PM EST",
                    icon: MessageCircle,
                    color: "green"
                  }
                ].map((support, index) => (
                  <div key={index} className="p-4 border border-border rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${support.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'}`}>
                        <support.icon className={`h-4 w-4 ${support.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">{support.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{support.desc}</p>
                        <p className="text-sm font-medium text-primary mt-2">{support.contact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0 || searchTerm === "");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Find answers to common questions about our assessments, platform features, and business solutions.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search FAQ..." 
                  className="pl-10 py-3 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    Quick Navigation
                  </h3>
                  <nav className="space-y-2">
                    {faqCategories.map((category) => (
                      <a
                        key={category.id}
                        href={`#${category.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className={`p-1.5 rounded-md ${category.bgColor}`}>
                          <category.icon className={`h-3 w-3 ${category.color}`} />
                        </div>
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">
                          {category.title}
                        </span>
                      </a>
                    ))}
                  </nav>
                </Card>
                
                {/* Quick Contact */}
                <Card className="p-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Need More Help?
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link to="/support">
                        <Mail className="h-3 w-3 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href="mailto:support@authencore.com">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Email Us
                      </a>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* Main FAQ Content */}
            <div className="lg:col-span-3 space-y-8">
              
              {filteredCategories.map((category) => (
                <Card key={category.id} id={category.id} className="overflow-hidden">
                  <CardHeader className={`${category.bgColor} border-b`}>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/80 dark:bg-gray-900/80`}>
                        <category.icon className={`h-5 w-5 ${category.color}`} />
                      </div>
                      <div>
                        <div className="text-xl font-bold">{category.title}</div>
                        <CardDescription className="text-sm font-medium opacity-80">
                          {category.description}
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {category.questions.map((faq) => (
                        <AccordionItem 
                          key={faq.id} 
                          value={faq.id}
                          className="border border-border rounded-lg px-4 py-2 hover:shadow-sm transition-shadow"
                        >
                          <AccordionTrigger className="text-left hover:no-underline group py-4">
                            <div className="flex items-center gap-3">
                              <HelpCircle className="h-4 w-4 text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
                              <span className="font-medium group-hover:text-primary transition-colors">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4">
                            <div className="pl-7">
                              {faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
              
              {/* No Results */}
              {searchTerm && filteredCategories.every(cat => cat.questions.length === 0) && (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">No results found</h3>
                      <p className="text-muted-foreground">
                        Try searching with different keywords or browse our categories above.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Still have questions?</h3>
                    <p className="text-muted-foreground">
                      Our support team is here to help you succeed with AuthenCore Analytics.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <Link to="/support">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/assessment">
                        <Target className="h-4 w-4 mr-2" />
                        Try an Assessment
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQ;