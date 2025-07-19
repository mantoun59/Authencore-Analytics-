import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Link2, QrCode, Users, TestTube, BarChart3, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TestingDashboard = () => {
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const testingLinks = [
    {
      title: "Main Testing Portal",
      url: "/candidate-testing",
      description: "Complete testing environment with all assessments"
    },
    {
      title: "Career Launch Assessment",
      url: "/career-launch",
      description: "Direct link to career readiness assessment"
    },
    {
      title: "Leadership Assessment",
      url: "/leadership",
      description: "Direct link to leadership evaluation"
    },
    {
      title: "Communication Assessment", 
      url: "/communication",
      description: "Direct link to communication skills test"
    },
    {
      title: "Emotional Intelligence",
      url: "/emotional-intelligence",
      description: "Direct link to EQ assessment"
    },
    {
      title: "Stress & Resilience",
      url: "/stress-resilience",
      description: "Direct link to stress management evaluation"
    },
    {
      title: "Cultural Intelligence",
      url: "/cultural-intelligence",
      description: "Direct link to cross-cultural competency test"
    },
    {
      title: "CAIR Assessment",
      url: "/cair",
      description: "Direct link to comprehensive assessment and intelligence report"
    },
    {
      title: "Gen Z Assessment",
      url: "/genz",
      description: "Direct link to generation-specific workplace dynamics evaluation"
    },
    {
      title: "Digital Wellness Assessment",
      url: "/digital-wellness",
      description: "Direct link to digital habits and well-being evaluation"
    },
    {
      title: "Faith & Values Assessment",
      url: "/faith-values",
      description: "Direct link to personal values and belief systems assessment"
    },
    {
      title: "Solo Assessment Portal",
      url: "/solo-assessment/demo-token",
      description: "Demo of solo candidate assessment flow"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Link has been copied to your clipboard.",
    });
  };

  const generateQRCode = (url: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(baseUrl + url)}`;
    window.open(qrUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Testing Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage candidate testing, generate shareable links, and collect feedback
          </p>
        </div>

        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Testing Links
            </TabsTrigger>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Test Candidates
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Testing Links
                </CardTitle>
                <CardDescription>
                  Share these links with candidates for testing different assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testingLinks.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{link.title}</h3>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                          {baseUrl}{link.url}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(baseUrl + link.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateQRCode(link.url)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open(baseUrl + link.url, '_blank')}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <CardTitle>Test Candidate Management</CardTitle>
                <CardDescription>
                  Create and manage test candidate accounts for assessment trials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="candidate-name">Candidate Name</Label>
                      <Input id="candidate-name" placeholder="John Doe" />
                    </div>
                    <div>
                      <Label htmlFor="candidate-email">Email Address</Label>
                      <Input id="candidate-email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" placeholder="Software Developer" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Tech Corp" />
                    </div>
                  </div>
                  <Button>Create Test Candidate</Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Recent Test Candidates</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Demo Candidate</p>
                        <p className="text-sm text-muted-foreground">demo@example.com • Software Developer</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Testing Feedback</CardTitle>
                <CardDescription>
                  Review feedback from candidates who tested the assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Demo Candidate</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Career Launch Assessment</p>
                    <p>"The assessment was intuitive and engaging. Questions were relevant to real workplace scenarios."</p>
                  </div>
                  
                  <div className="text-center text-muted-foreground">
                    <p>More feedback will appear here as candidates complete testing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Testing Analytics</CardTitle>
                <CardDescription>
                  Monitor testing activity and assessment performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-sm text-muted-foreground">Tests Completed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-sm text-muted-foreground">Active Candidates</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-sm text-muted-foreground">Feedback Received</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center text-muted-foreground">
                  <p>Analytics data will populate as testing activity increases</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestingDashboard;