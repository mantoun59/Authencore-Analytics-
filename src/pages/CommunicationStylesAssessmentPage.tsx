import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Globe, FileText, TrendingUp, Shield } from "lucide-react";
import CommunicationStylesAssessment from "@/components/CommunicationStylesAssessment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CommunicationStylesAssessmentPage: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Enhanced Visual Analytics",
      description: "Advanced CEI radar charts, communication style matrix, and adaptability gauges with real-time interactive visualizations."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Team Compatibility Analysis",
      description: "Comprehensive team compatibility matrix with pairwise analysis, conflict potential assessment, and collaboration recommendations."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Advanced Distortion Analysis",
      description: "Sophisticated validity and reliability metrics including consistency checks, response time patterns, and social desirability bias detection."
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: "Multilingual Support",
      description: "Complete internationalization with support for English, Spanish, French, and German language interfaces and reports."
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      title: "Professional PDF & HTML Reports",
      description: "Comprehensive reports with visual charts, detailed analysis, and professional formatting for individual and team use."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
      title: "AI-Enhanced Insights",
      description: "Intelligent development recommendations, contextual effectiveness analysis, and personalized coaching suggestions."
    }
  ];

  if (isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="pt-20 pb-10">
          <CommunicationStylesAssessment
            onComplete={(results) => {
              console.log('Assessment completed with results:', results);
            }}
            participantName={participantName}
            participantEmail={participantEmail}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <MessageSquare className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-900">Communication Styles Assessment</h1>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover your unique communication patterns, strengths, and development opportunities with our comprehensive, 
              scientifically-validated assessment featuring advanced analytics and team compatibility analysis.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Badge variant="outline" className="text-lg px-4 py-2">
                ✨ Enhanced with AI Analytics
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                🌍 Multilingual Support
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                👥 Team Compatibility
              </Badge>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Assessment Highlights */}
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">What You'll Discover</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Comprehensive insights into your communication effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-blue-100">📊 Advanced Metrics</h4>
                  <ul className="space-y-2 text-blue-50">
                    <li>• Communication Effectiveness Index (CEI)</li>
                    <li>• 7 Core Communication Dimensions</li>
                    <li>• Contextual Performance Analysis</li>
                    <li>• Adaptability & Flexibility Scores</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-blue-100">🎯 Actionable Insights</h4>
                  <ul className="space-y-2 text-blue-50">
                    <li>• Personalized Development Roadmap</li>
                    <li>• Team Compatibility Analysis</li>
                    <li>• Professional Coaching Recommendations</li>
                    <li>• Workplace Effectiveness Strategies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  Individual Assessment
                </CardTitle>
                <CardDescription>Perfect for personal development and self-awareness</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li>• Comprehensive personal communication profile</li>
                  <li>• Detailed PDF and HTML reports</li>
                  <li>• Advanced visual analytics and charts</li>
                  <li>• Personalized development recommendations</li>
                  <li>• Multilingual report generation</li>
                </ul>
                <div className="flex gap-3">
                  <Badge variant="secondary">45-60 minutes</Badge>
                  <Badge variant="secondary">120+ questions</Badge>
                  <Badge variant="secondary">7 dimensions</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-600" />
                  Team Assessment
                </CardTitle>
                <CardDescription>Optimize team dynamics and collaboration</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li>• Team compatibility matrix analysis</li>
                  <li>• Conflict potential assessment</li>
                  <li>• Collaboration optimization strategies</li>
                  <li>• Group communication effectiveness</li>
                  <li>• Leadership and influence mapping</li>
                </ul>
                <div className="flex gap-3">
                  <Badge variant="secondary">Team of 2-10</Badge>
                  <Badge variant="secondary">Compatibility matrix</Badge>
                  <Badge variant="secondary">Group insights</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start Assessment Section */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-900">Ready to Discover Your Communication Style?</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Begin your comprehensive communication assessment journey
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-md mx-auto space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <Button
                onClick={() => setIsStarted(true)}
                disabled={!participantName.trim()}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
              >
                Start Communication Assessment
                <MessageSquare className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-sm text-slate-500 text-center">
                ⏱️ Takes 45-60 minutes • 🔒 Secure & Private • 📊 Instant Results
              </p>
            </CardContent>
          </Card>

          {/* Assessment Quality Indicators */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Assessment Quality & Reliability</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-sm text-slate-600">Reliability Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">120+</div>
                <div className="text-sm text-slate-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">7</div>
                <div className="text-sm text-slate-600">Dimensions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
                <div className="text-sm text-slate-600">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CommunicationStylesAssessmentPage;