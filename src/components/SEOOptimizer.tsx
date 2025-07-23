import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Download
} from 'lucide-react';
import { useToast } from './ui/use-toast';

const SEOOptimizer = () => {
  const { toast } = useToast();
  const [seoData, setSeoData] = useState({
    title: 'AuthenCore Analytics - Professional Assessment Platform',
    description: 'Comprehensive personality, career, and workplace assessments. Validate talent with scientific precision. CAIR+, CareerLaunch, Communication Styles & more.',
    keywords: 'personality assessment, career assessment, workplace analytics, talent validation, CAIR personality test, emotional intelligence',
    domain: '',
    targetCountries: ['United States', 'Canada', 'United Kingdom', 'Australia'],
    languages: ['English', 'Spanish', 'French']
  });

  const [analyticsSetup, setAnalyticsSetup] = useState({
    googleAnalytics: '',
    facebookPixel: '',
    linkedinInsight: '',
    hotjarId: ''
  });

  const seoChecklist = [
    { item: 'Meta Title & Description', status: 'completed', description: 'Optimized for search engines' },
    { item: 'Schema.org Structured Data', status: 'pending', description: 'Rich snippets for assessments' },
    { item: 'XML Sitemap', status: 'pending', description: 'Help search engines index pages' },
    { item: 'Google Analytics', status: 'setup-needed', description: 'Track visitor behavior' },
    { item: 'Page Speed Optimization', status: 'in-progress', description: 'Fast loading times' },
    { item: 'Mobile Responsiveness', status: 'completed', description: 'Mobile-friendly design' },
    { item: 'International SEO', status: 'pending', description: 'Multi-language support' },
    { item: 'Local SEO', status: 'pending', description: 'Location-based optimization' }
  ];

  const marketingStrategies = [
    {
      strategy: 'Content Marketing',
      description: 'Create valuable assessment guides and career resources',
      priority: 'High',
      effort: 'Medium',
      impact: 'High'
    },
    {
      strategy: 'Social Media Marketing',
      description: 'LinkedIn, Twitter, and Facebook presence for B2B outreach',
      priority: 'High',
      effort: 'Medium',
      impact: 'Medium'
    },
    {
      strategy: 'Email Marketing',
      description: 'Nurture leads with assessment insights and tips',
      priority: 'Medium',
      effort: 'Low',
      impact: 'High'
    },
    {
      strategy: 'Influencer Partnerships',
      description: 'Collaborate with HR professionals and career coaches',
      priority: 'Medium',
      effort: 'High',
      impact: 'High'
    },
    {
      strategy: 'Paid Advertising',
      description: 'Google Ads and LinkedIn Ads for targeted reach',
      priority: 'Low',
      effort: 'High',
      impact: 'Medium'
    }
  ];

  const internationalTips = [
    {
      title: 'Domain Strategy',
      tip: 'Use .com for global reach, consider ccTLDs (.co.uk, .ca) for specific countries'
    },
    {
      title: 'Content Localization',
      tip: 'Translate key pages and adapt assessments for cultural differences'
    },
    {
      title: 'Local SEO',
      tip: 'Create Google My Business listings in target countries'
    },
    {
      title: 'Cultural Adaptation',
      tip: 'Adjust assessment questions for cultural sensitivity'
    },
    {
      title: 'Legal Compliance',
      tip: 'Ensure GDPR, PIPEDA, and other privacy law compliance'
    }
  ];

  const generateMetaTags = () => {
    const metaTagsCode = `<!-- Primary Meta Tags -->
<title>${seoData.title}</title>
<meta name="title" content="${seoData.title}">
<meta name="description" content="${seoData.description}">
<meta name="keywords" content="${seoData.keywords}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://${seoData.domain || 'yourdomain.com'}/">
<meta property="og:title" content="${seoData.title}">
<meta property="og:description" content="${seoData.description}">
<meta property="og:image" content="https://${seoData.domain || 'yourdomain.com'}/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://${seoData.domain || 'yourdomain.com'}/">
<meta property="twitter:title" content="${seoData.title}">
<meta property="twitter:description" content="${seoData.description}">
<meta property="twitter:image" content="https://${seoData.domain || 'yourdomain.com'}/twitter-image.png">`;

    navigator.clipboard.writeText(metaTagsCode);
    toast({
      title: "Meta tags copied!",
      description: "Paste these into your website's <head> section"
    });
  };

  const generateAnalyticsCode = () => {
    const analyticsCode = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${analyticsSetup.googleAnalytics}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${analyticsSetup.googleAnalytics}');
</script>

<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${analyticsSetup.facebookPixel}');
  fbq('track', 'PageView');
</script>`;

    navigator.clipboard.writeText(analyticsCode);
    toast({
      title: "Analytics code copied!",
      description: "Add this to your website's header"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <BarChart3 className="h-5 w-5 text-blue-500" />;
      case 'setup-needed':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          International SEO & Marketing Optimizer
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete guide to optimize your assessment platform for global success
        </p>
      </div>

      <Tabs defaultValue="seo-basics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="seo-basics">SEO Basics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="seo-basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Foundation Setup
              </CardTitle>
              <CardDescription>
                Configure your basic SEO settings for better search visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Page Title (50-60 characters)</Label>
                  <Input
                    id="title"
                    value={seoData.title}
                    onChange={(e) => setSeoData({...seoData, title: e.target.value})}
                    placeholder="Your compelling page title"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Characters: {seoData.title.length}/60
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="domain">Your Domain</Label>
                  <Input
                    id="domain"
                    value={seoData.domain}
                    onChange={(e) => setSeoData({...seoData, domain: e.target.value})}
                    placeholder="yourdomain.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Meta Description (150-160 characters)</Label>
                <Textarea
                  id="description"
                  value={seoData.description}
                  onChange={(e) => setSeoData({...seoData, description: e.target.value})}
                  placeholder="Compelling description of your assessment platform"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Characters: {seoData.description.length}/160
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({...seoData, keywords: e.target.value})}
                  placeholder="personality assessment, career test, workplace analytics"
                  rows={2}
                />
              </div>

              <Button onClick={generateMetaTags} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Generate & Copy Meta Tags
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Checklist</CardTitle>
              <CardDescription>Track your SEO optimization progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoChecklist.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Tracking Setup
              </CardTitle>
              <CardDescription>
                Add tracking codes to monitor your website performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ga">Google Analytics ID</Label>
                  <Input
                    id="ga"
                    value={analyticsSetup.googleAnalytics}
                    onChange={(e) => setAnalyticsSetup({...analyticsSetup, googleAnalytics: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fb">Facebook Pixel ID</Label>
                  <Input
                    id="fb"
                    value={analyticsSetup.facebookPixel}
                    onChange={(e) => setAnalyticsSetup({...analyticsSetup, facebookPixel: e.target.value})}
                    placeholder="123456789012345"
                  />
                </div>

                <div>
                  <Label htmlFor="li">LinkedIn Insight Tag</Label>
                  <Input
                    id="li"
                    value={analyticsSetup.linkedinInsight}
                    onChange={(e) => setAnalyticsSetup({...analyticsSetup, linkedinInsight: e.target.value})}
                    placeholder="12345"
                  />
                </div>

                <div>
                  <Label htmlFor="hj">Hotjar Site ID</Label>
                  <Input
                    id="hj"
                    value={analyticsSetup.hotjarId}
                    onChange={(e) => setAnalyticsSetup({...analyticsSetup, hotjarId: e.target.value})}
                    placeholder="1234567"
                  />
                </div>
              </div>

              <Button onClick={generateAnalyticsCode} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Generate Analytics Code
              </Button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Setup Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Create accounts on Google Analytics, Facebook Business, etc.</li>
                  <li>Get your tracking IDs from each platform</li>
                  <li>Enter the IDs above and generate the code</li>
                  <li>Add the generated code to your website's header</li>
                  <li>Verify tracking is working using browser developer tools</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="international" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                International Expansion Strategy
              </CardTitle>
              <CardDescription>
                Optimize your platform for global markets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Target Countries</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seoData.targetCountries.map((country, index) => (
                      <Badge key={index} variant="outline">{country}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Target Languages</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {seoData.languages.map((language, index) => (
                      <Badge key={index} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">International SEO Tips:</h4>
                {internationalTips.map((tip, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h5 className="font-medium">{tip.title}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{tip.tip}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-2">Quick Win: Set up hreflang tags</h4>
                <p className="text-sm mb-2">Add these to your website header for international SEO:</p>
                <code className="block bg-white p-2 rounded text-xs">
                  {`<link rel="alternate" hreflang="en" href="https://yourdomain.com/" />
<link rel="alternate" hreflang="es" href="https://yourdomain.com/es/" />
<link rel="alternate" hreflang="fr" href="https://yourdomain.com/fr/" />`}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Marketing Strategy Prioritization
              </CardTitle>
              <CardDescription>
                Focus on high-impact, low-effort marketing activities first
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketingStrategies.map((strategy, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{strategy.strategy}</h4>
                      <Badge className={getPriorityColor(strategy.priority)}>
                        {strategy.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                    <div className="flex gap-4 text-xs">
                      <span>Effort: <strong>{strategy.effort}</strong></span>
                      <span>Impact: <strong>{strategy.impact}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your 90-Day International Success Roadmap
              </CardTitle>
              <CardDescription>
                Step-by-step plan to optimize and expand globally
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-700">Days 1-30: Foundation</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Set up Google Analytics and Search Console</li>
                    <li>Optimize meta tags and descriptions</li>
                    <li>Implement schema.org structured data</li>
                    <li>Create XML sitemap</li>
                    <li>Set up custom domain (yourbrand.com)</li>
                    <li>Add SSL certificate</li>
                    <li>Optimize page loading speed</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">Days 31-60: Content & Social</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Create valuable blog content (assessment guides)</li>
                    <li>Set up social media profiles (LinkedIn, Twitter, Facebook)</li>
                    <li>Start email marketing campaigns</li>
                    <li>Add customer testimonials and case studies</li>
                    <li>Create lead magnets (free assessment previews)</li>
                    <li>Implement tracking pixels (Facebook, LinkedIn)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-700">Days 61-90: International Expansion</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Translate key pages to target languages</li>
                    <li>Set up hreflang tags for international SEO</li>
                    <li>Create country-specific landing pages</li>
                    <li>Start paid advertising in target markets</li>
                    <li>Partner with local influencers/organizations</li>
                    <li>Ensure GDPR and privacy law compliance</li>
                    <li>Monitor and optimize based on analytics data</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Pro Tips for Beginners:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Start small:</strong> Focus on 1-2 countries initially</li>
                  <li><strong>Track everything:</strong> Use analytics to guide decisions</li>
                  <li><strong>Content is king:</strong> Create valuable, shareable content</li>
                  <li><strong>Be patient:</strong> SEO results take 3-6 months to show</li>
                  <li><strong>Mobile-first:</strong> Ensure perfect mobile experience</li>
                  <li><strong>Local partnerships:</strong> Connect with local HR professionals</li>
                </ul>
              </div>

              <Button className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Download Complete SEO Checklist (PDF)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOOptimizer;