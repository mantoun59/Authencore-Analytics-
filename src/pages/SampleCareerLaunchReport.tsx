import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CareerLaunchReportEnhanced } from "@/components/CareerLaunchReportEnhanced";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Trophy, 
  Download,
  Rocket
} from "lucide-react";

// Enhanced AI Sample Data
const enhancedAIFeatures = {
  distortionAnalysis: {
    score: 2,
    reliability: 'high',
    confidenceLevel: 94,
    responsePatterns: {
      fakeGood: 1,
      fakeBad: 0,
      random: 1,
      inconsistency: 2
    },
    interpretation: 'Assessment shows excellent validity with consistent response patterns and high reliability.'
  },
  cognitiveProfile: {
    processingStyle: 'Analytical-Creative Hybrid',
    learningPreferences: ['Visual Learning', 'Hands-on Experience', 'Collaborative Problem Solving'],
    decisionMakingApproach: 'Data-informed with intuitive validation',
    problemSolvingStrategy: 'Systematic analysis followed by creative synthesis'
  },
  behavioralPredictions: {
    workplacePerformance: {
      predictedEffectiveness: 87,
      performanceIndicators: ['High innovation potential', 'Strong team collaboration', 'Effective under pressure']
    },
    teamDynamics: {
      collaborationStyle: 'Collaborative leader with mentoring tendencies',
      leadershipPotential: 82,
      influenceStyle: 'Inspirational and consultative'
    }
  },
  enhancedInterviewQuestions: [
    'Describe a time when you had to balance analytical thinking with creative problem-solving.',
    'How do you approach learning new technologies or methodologies?',
    'Tell me about a situation where you led a team through an innovative project.',
    'How do you validate your creative ideas with data or feedback?'
  ]
};

const SampleCareerLaunchReport = () => {
  const { toast } = useToast();
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Humanized sample data that feels real and relatable
  const sampleResults = {
    interests: {
      realistic: 75,      // Love working with your hands and solving tangible problems  
      investigative: 85,  // Your curiosity drives you to dig deep and understand how things work
      artistic: 78,       // You have a creative spark that needs an outlet
      social: 70,         // Making a difference in people's lives matters to you
      enterprising: 82,   // You're drawn to leadership and building something meaningful
      conventional: 65    // You appreciate structure, but don't want to be boxed in
    },
    aptitudes: [
      { name: "Abstract Thinking", score: 92 },
      { name: "Communication Skills", score: 88 },
      { name: "Problem Solving", score: 85 },
      { name: "Focus & Memory", score: 79 }
    ],
    personality: {
      introversion: 45,        // You're energized by people but also need your thinking time
      openness: 88,           // You're always up for new experiences and ideas  
      conscientiousness: 76,   // You get things done, but you're not obsessive about it
      adaptability: 82        // Change doesn't scare you - it excites you
    },
    values: {
      security: 65,      // Stability matters, but not at the cost of growth
      achievement: 78,   // You want to make your mark on the world
      creativity: 85,    // Innovation and originality fuel your soul
      community: 72      // You want your work to have positive impact
    },
    flags: {
      insights: [
        "Your blend of analytical thinking and creativity is rare - you could thrive in roles that let you innovate with data",
        "You're wired to be a bridge-builder between technical teams and creative visionaries"
      ]
    },
    career_fit: {
      label: "The Innovation Catalyst",
      description: "You're someone who can see patterns others miss and turn complex problems into elegant solutions. You thrive when you can combine analytical rigor with creative thinking.",
      suggestions: [
        "Data Scientist (with creative projects)",
        "UX Research Lead", 
        "Product Strategy Manager",
        "Innovation Consultant",
        "Creative Technology Director"
      ]
    },
    action_plan: [
      "Start building a portfolio that showcases both your analytical skills and creative problem-solving - this combo is your superpower",
      "Look for roles in companies that value innovation and aren't afraid to try new approaches",
      "Consider positions where you can work across departments - you're naturally good at translating between different teams", 
      "Develop skills in both data visualization and storytelling - you can make complex insights accessible and compelling",
      "Find mentors who've successfully blended analytical and creative careers - they'll understand your unique perspective"
    ]
  };

  const sampleUserProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    assessmentDate: "2024-07-19",
    questionsAnswered: 145,  // Updated to reflect new question count
    timeSpent: "28 minutes",
    reliabilityScore: 94     // High reliability due to expanded question set
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Trophy className="h-4 w-4 mr-2" />
              Enhanced Sample Assessment Results
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Meet Alex: A CareerLaunch Success Story
            </h1>
            <p className="text-xl text-muted-foreground">
              Experience our enhanced report with accessibility, dynamic insights, and advisor features
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ✨ This demonstrates the complete enhanced reporting system with accessibility features, 
                advisor insights, interactive tooltips, and PDF generation. Try the accessibility controls!
              </p>
            </div>
          </div>

          {/* Enhanced Report Component */}
          <CareerLaunchReportEnhanced 
            results={sampleResults}
            userProfile={sampleUserProfile}
            enhancedAI={enhancedAIFeatures}
            viewType="candidate"
          />
          
          <div className="text-center mt-8 space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Ready to Discover Your Own Career Path?</h3>
              <p className="text-muted-foreground mb-4">
                Take the CareerLaunch Assessment and get your personalized insights with all these enhanced features.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                <Rocket className="h-4 w-4 mr-2" />
                Start Your Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Controls */}
      <Button
        onClick={() => setAccessibilityOpen(true)}
        className="fixed bottom-4 right-4 z-50"
        size="sm"
        variant="outline"
        aria-label="Open accessibility settings"
      >
        Accessibility
      </Button>
      
      <AccessibilityControls 
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
      
      <Footer />
    </div>
  );
};

export default SampleCareerLaunchReport;