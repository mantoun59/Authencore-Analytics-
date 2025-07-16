import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Users, CheckCircle, Globe } from 'lucide-react';
import { CulturalChallenge } from '@/data/culturalScenarios';

interface MeetingSchedulingChallengeProps {
  challenge: CulturalChallenge;
  onComplete: (results: any) => void;
}

export const MeetingSchedulingChallenge: React.FC<MeetingSchedulingChallengeProps> = ({ challenge, onComplete }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [considerations, setConsiderations] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const timeSlots = [
    { time: '8:00 AM EST', utc: '13:00 UTC', locations: { 'New York': '8:00 AM', 'London': '1:00 PM', 'Singapore': '9:00 PM', 'São Paulo': '10:00 AM' }, suitable: false, reason: 'Too early for Brazil, too late for Singapore' },
    { time: '9:00 AM EST', utc: '14:00 UTC', locations: { 'New York': '9:00 AM', 'London': '2:00 PM', 'Singapore': '10:00 PM', 'São Paulo': '11:00 AM' }, suitable: false, reason: 'Still late for Singapore' },
    { time: '10:00 AM EST', utc: '15:00 UTC', locations: { 'New York': '10:00 AM', 'London': '3:00 PM', 'Singapore': '11:00 PM', 'São Paulo': '12:00 PM' }, suitable: false, reason: 'Very late for Singapore' },
    { time: '11:00 AM EST', utc: '16:00 UTC', locations: { 'New York': '11:00 AM', 'London': '4:00 PM', 'Singapore': '12:00 AM+1', 'São Paulo': '1:00 PM' }, suitable: false, reason: 'Midnight for Singapore' },
    { time: '7:00 AM EST', utc: '12:00 UTC', locations: { 'New York': '7:00 AM', 'London': '12:00 PM', 'Singapore': '8:00 PM', 'São Paulo': '9:00 AM' }, suitable: true, reason: 'Best compromise across all time zones' },
    { time: '6:00 AM EST', utc: '11:00 UTC', locations: { 'New York': '6:00 AM', 'London': '11:00 AM', 'Singapore': '7:00 PM', 'São Paulo': '8:00 AM' }, suitable: false, reason: 'Too early for US and Brazil' }
  ];

  const culturalConsiderations = [
    { id: 'prep_time', label: 'Send agenda 24-48 hours in advance', region: 'Germany/Asia' },
    { id: 'translation', label: 'Provide key materials in local languages', region: 'Global' },
    { id: 'recording', label: 'Record session for team members who cannot attend', region: 'Inclusive' },
    { id: 'followup', label: 'Plan detailed follow-up with action items', region: 'All regions' },
    { id: 'relationship', label: 'Allow 5-10 minutes for informal chat before business', region: 'Brazil/Asia' },
    { id: 'hierarchy', label: 'Ensure senior stakeholders can participate fully', region: 'Asia/Middle East' },
    { id: 'backup_time', label: 'Suggest backup time slot in case of conflicts', region: 'Best practice' },
    { id: 'cultural_holidays', label: 'Check for local holidays or cultural events', region: 'All regions' }
  ];

  const toggleConsideration = (considerationId: string) => {
    setConsiderations(prev => 
      prev.includes(considerationId)
        ? prev.filter(id => id !== considerationId)
        : [...prev, considerationId]
    );
  };

  const handleSubmit = () => {
    const results = {
      selectedTimeSlot,
      considerations,
      score: calculateScore()
    };
    
    setIsComplete(true);
    setTimeout(() => {
      onComplete(results);
    }, 2000);
  };

  const calculateScore = () => {
    let score = 0;
    
    // Time slot selection (40% of score)
    const selectedSlot = timeSlots.find(slot => slot.time === selectedTimeSlot);
    if (selectedSlot?.suitable) {
      score += 40;
    } else if (selectedSlot) {
      score += 10; // Partial credit for selecting any slot
    }
    
    // Cultural considerations (60% of score)
    const importantConsiderations = ['prep_time', 'relationship', 'cultural_holidays', 'hierarchy'];
    const selectedImportant = considerations.filter(c => importantConsiderations.includes(c));
    score += (selectedImportant.length / importantConsiderations.length) * 60;
    
    return Math.round(score);
  };

  const canSubmit = selectedTimeSlot && considerations.length >= 3;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Global Meeting Scheduling Challenge</span>
          </CardTitle>
          <CardDescription>
            Schedule a project kickoff meeting with cultural sensitivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Scenario:</h4>
            <p className="text-sm">{challenge.scenario}</p>
          </div>
        </CardContent>
      </Card>

      {/* Team Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Team Locations & Constraints</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {challenge.culturalFactors && Object.entries(challenge.culturalFactors).map(([location, factors]) => (
              <div key={location} className="border rounded-lg p-4">
                <h5 className="font-semibold mb-2">{location}</h5>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Work Hours:</span> {factors.workHours}</div>
                  <div><span className="font-medium">Preferences:</span> {factors.preferences}</div>
                  <div><span className="font-medium">Avoid:</span> {factors.avoid}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Select Meeting Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeSlots.map((slot) => (
              <Card 
                key={slot.time}
                className={`cursor-pointer transition-all ${
                  selectedTimeSlot === slot.time 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                } ${slot.suitable ? 'border-green-300' : 'border-gray-200'}`}
                onClick={() => setSelectedTimeSlot(slot.time)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedTimeSlot === slot.time 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`} />
                      <span className="font-medium">{slot.time}</span>
                      <Badge variant="outline">{slot.utc}</Badge>
                      {slot.suitable && <Badge className="bg-green-100 text-green-800">Recommended</Badge>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-2">
                    {Object.entries(slot.locations).map(([city, time]) => (
                      <div key={city} className="flex justify-between">
                        <span className="text-muted-foreground">{city}:</span>
                        <span className="font-mono">{time}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{slot.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Cultural Considerations</span>
          </CardTitle>
          <CardDescription>
            Select the cultural factors you would consider (choose at least 3)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {culturalConsiderations.map((consideration) => (
              <div key={consideration.id} className="flex items-start space-x-3">
                <Checkbox
                  id={consideration.id}
                  checked={considerations.includes(consideration.id)}
                  onCheckedChange={() => toggleConsideration(consideration.id)}
                />
                <div className="flex-1">
                  <label 
                    htmlFor={consideration.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {consideration.label}
                  </label>
                  <div className="text-xs text-muted-foreground">
                    Relevant for: {consideration.region}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={handleSubmit}
          disabled={!canSubmit || isComplete}
          size="lg"
          className="px-8"
        >
          {isComplete ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Challenge Complete!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Schedule Meeting</span>
              <Calendar className="h-5 w-5" />
            </div>
          )}
        </Button>
        
        {!canSubmit && !isComplete && (
          <p className="text-sm text-muted-foreground mt-2">
            Select a time slot and at least 3 cultural considerations
          </p>
        )}
      </div>
      
      {isComplete && (
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
            Meeting Scheduled Successfully!
          </h3>
          <p className="text-green-600 dark:text-green-400 mb-2">
            Cultural Intelligence Score: {calculateScore()}/100
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            {calculateScore() >= 80 ? 'Excellent cultural awareness!' : 
             calculateScore() >= 60 ? 'Good cultural sensitivity shown.' : 
             'Room for improvement in cultural considerations.'}
          </p>
        </div>
      )}
    </div>
  );
};