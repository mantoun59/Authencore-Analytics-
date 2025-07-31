import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2, Calendar, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ApplicantData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  education: string;
  experience: string;
  currentPosition: string;
  company: string;
  assessmentType: string;
  additionalInfo: string;
}

interface ApplicantDataFormProps {
  assessmentType: string;
  assessmentTitle: string;
  onComplete: (data: ApplicantData) => void;
}

const ApplicantDataForm: React.FC<ApplicantDataFormProps> = ({ 
  assessmentType, 
  assessmentTitle, 
  onComplete 
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: ApplicantData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      education: formData.get('education') as string,
      experience: formData.get('experience') as string,
      currentPosition: formData.get('currentPosition') as string,
      company: formData.get('company') as string,
      assessmentType,
      additionalInfo: formData.get('additionalInfo') as string,
    };

    // Enhanced validation
    const errors: string[] = [];
    if (!data.fullName?.trim()) errors.push('Full name is required');
    if (!data.email?.trim()) errors.push('Email address is required');
    if (!data.phone?.trim()) errors.push('Phone number is required');
    
    // Email format validation
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Phone format validation  
    if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
      errors.push('Please enter a valid phone number');
    }
    
    if (errors.length > 0) {
      toast({
        title: 'Validation Errors',
        description: errors.join('. '),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      // Here you would typically save the data to your backend
      // For now, we'll just pass it to the parent component
      onComplete(data);
      
      toast({
        title: 'Information Saved',
        description: 'Your information has been recorded. Starting assessment...',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save information. Please try again.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Applicant Information
          </CardTitle>
          <CardDescription>
            Please provide your information before starting the <strong>{assessmentTitle}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="required">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="required">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="required">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Enter your state"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    placeholder="Enter your ZIP code"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select name="education">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select name="experience">
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-15">11-15 years</SelectItem>
                      <SelectItem value="16+">16+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPosition">Current Position</Label>
                  <Input
                    id="currentPosition"
                    name="currentPosition"
                    type="text"
                    placeholder="Enter your current position"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Comments (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Any additional information you'd like to share..."
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={loading}
              >
                {loading ? "Saving Information..." : "Start Assessment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantDataForm;