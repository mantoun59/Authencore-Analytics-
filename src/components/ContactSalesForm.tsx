import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2, Mail, Phone, Users } from 'lucide-react';

interface ContactSalesFormProps {
  className?: string;
}

export const ContactSalesForm: React.FC<ContactSalesFormProps> = ({ className = '' }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    organizationType: '',
    teamSize: '',
    message: '',
    assessmentInterest: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`Enterprise/Partner Inquiry - ${formData.company}`);
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Phone: ${formData.phone}
Organization Type: ${formData.organizationType}
Team Size: ${formData.teamSize}
Assessment Interest: ${formData.assessmentInterest}

Message:
${formData.message}

---
This inquiry was submitted through the AuthenCore Analytics website.
`);

      const mailtoLink = `mailto:sales@authencore.org?subject=${subject}&body=${body}`;
      window.open(mailtoLink, '_blank');

      toast({
        title: "Contact Request Sent",
        description: "Your inquiry has been sent to our sales team. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        organizationType: '',
        teamSize: '',
        message: '',
        assessmentInterest: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your inquiry. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className={`max-w-2xl mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Enterprise & Partner Inquiry</CardTitle>
        <p className="text-muted-foreground">
          Get custom pricing and solutions tailored to your organization's needs
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@company.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company/Organization *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Acme Corporation"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organizationType">Organization Type</Label>
              <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="consulting">Consulting Firm</SelectItem>
                  <SelectItem value="hr-agency">HR Agency</SelectItem>
                  <SelectItem value="education">Educational Institution</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="teamSize">Team/Organization Size</Label>
              <Select value={formData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                  <SelectItem value="1000+">1,000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="assessmentInterest">Assessment Interest</Label>
            <Select value={formData.assessmentInterest} onValueChange={(value) => handleInputChange('assessmentInterest', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assessments Bundle</SelectItem>
                <SelectItem value="personality">Personality Assessments</SelectItem>
                <SelectItem value="career">Career Development</SelectItem>
                <SelectItem value="leadership">Leadership Assessment</SelectItem>
                <SelectItem value="cultural">Cultural Intelligence</SelectItem>
                <SelectItem value="communication">Communication Styles</SelectItem>
                <SelectItem value="custom">Custom Solution</SelectItem>
                <SelectItem value="api">API Integration</SelectItem>
                <SelectItem value="whitelabel">White-label Solution</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your requirements, expected volume, timeline, and any specific needs..."
              rows={4}
              required
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              What to Expect:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Response within 24 hours</li>
              <li>• Custom pricing based on your needs</li>
              <li>• Dedicated account manager</li>
              <li>• Integration support and training</li>
              <li>• Volume discounts available</li>
            </ul>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? 'Sending...' : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Inquiry
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Or contact us directly: <a href="tel:+1-555-AUTHEN" className="text-primary hover:underline">+1 (555) AUTHEN</a>
            {' | '}
            <a href="mailto:sales@authencore.org" className="text-primary hover:underline">sales@authencore.org</a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};