import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Users, Plus, X, TrendingUp, AlertTriangle, CheckCircle, UserPlus } from "lucide-react";
import { CommunicationStylesResults } from "@/hooks/useCommunicationStylesScoring";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  profile: CommunicationStylesResults;
}

interface CompatibilityMatrix {
  memberA: string;
  memberB: string;
  overallCompatibility: number;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  workingStyleMatch: number;
  communicationSynergy: number;
  conflictPotential: number;
}

interface TeamCompatibilityAnalyzerProps {
  currentUserProfile: CommunicationStylesResults;
  currentUserName?: string;
}

const TeamCompatibilityAnalyzer: React.FC<TeamCompatibilityAnalyzerProps> = ({ 
  currentUserProfile, 
  currentUserName = "You" 
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Add current user as first team member
  const allMembers = [
    {
      id: 'current-user',
      name: currentUserName,
      role: 'You',
      profile: currentUserProfile
    },
    ...teamMembers
  ];

  const calculateCompatibility = (profileA: CommunicationStylesResults, profileB: CommunicationStylesResults): CompatibilityMatrix => {
    const dimA = profileA.dimensions;
    const dimB = profileB.dimensions;

    // Calculate dimension differences (lower difference = higher compatibility)
    const assertivenessDiff = Math.abs(dimA.assertiveness.score - dimB.assertiveness.score);
    const expressivenessDiff = Math.abs(dimA.expressiveness.score - dimB.expressiveness.score);
    const processingDiff = Math.abs(dimA.informationProcessing.score - dimB.informationProcessing.score);
    const channelDiff = Math.abs(dimA.channelPreferences.score - dimB.channelPreferences.score);
    const listeningDiff = Math.abs(dimA.listeningPatterns.score - dimB.listeningPatterns.score);
    const influenceDiff = Math.abs(dimA.influenceStrategies.score - dimB.influenceStrategies.score);
    const conflictDiff = Math.abs(dimA.conflictCommunication.score - dimB.conflictCommunication.score);

    // Working style compatibility (similar styles work better together)
    const workingStyleMatch = 100 - ((assertivenessDiff + expressivenessDiff + processingDiff) / 3);

    // Communication synergy (complementary skills)
    const communicationSynergy = calculateSynergy(profileA, profileB);

    // Conflict potential (based on conflict handling and assertiveness differences)
    const conflictPotential = (conflictDiff + assertivenessDiff) / 2;

    // Overall compatibility score
    const overallCompatibility = (workingStyleMatch * 0.4 + communicationSynergy * 0.4 + (100 - conflictPotential) * 0.2);

    // Generate insights
    const { strengths, challenges, recommendations } = generateCompatibilityInsights(profileA, profileB);

    return {
      memberA: '',
      memberB: '',
      overallCompatibility: Math.round(overallCompatibility),
      workingStyleMatch: Math.round(workingStyleMatch),
      communicationSynergy: Math.round(communicationSynergy),
      conflictPotential: Math.round(conflictPotential),
      strengths,
      challenges,
      recommendations
    };
  };

  const calculateSynergy = (profileA: CommunicationStylesResults, profileB: CommunicationStylesResults): number => {
    const dimA = profileA.dimensions;
    const dimB = profileB.dimensions;

    let synergyScore = 0;

    // Complementary strengths (one high, one moderate/low can be beneficial)
    if ((dimA.assertiveness.score > 70 && dimB.listeningPatterns.score > 70) ||
        (dimB.assertiveness.score > 70 && dimA.listeningPatterns.score > 70)) {
      synergyScore += 20; // Leader + Good listener
    }

    if ((dimA.expressiveness.score > 70 && dimB.informationProcessing.score > 70) ||
        (dimB.expressiveness.score > 70 && dimA.informationProcessing.score > 70)) {
      synergyScore += 15; // Creative communicator + Analytical thinker
    }

    if ((dimA.influenceStrategies.score > 70 && dimB.conflictCommunication.score > 70) ||
        (dimB.influenceStrategies.score > 70 && dimA.conflictCommunication.score > 70)) {
      synergyScore += 15; // Influencer + Conflict resolver
    }

    // Similar high scores in key areas
    if (dimA.listeningPatterns.score > 70 && dimB.listeningPatterns.score > 70) {
      synergyScore += 10; // Both good listeners
    }

    if (dimA.channelPreferences.score > 70 && dimB.channelPreferences.score > 70) {
      synergyScore += 10; // Both adaptable in communication channels
    }

    return Math.min(100, synergyScore + 40); // Base synergy of 40
  };

  const generateCompatibilityInsights = (profileA: CommunicationStylesResults, profileB: CommunicationStylesResults) => {
    const dimA = profileA.dimensions;
    const dimB = profileB.dimensions;
    const strengths: string[] = [];
    const challenges: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths
    if (Math.abs(dimA.assertiveness.score - dimB.assertiveness.score) < 20) {
      strengths.push("Similar assertiveness levels promote balanced discussions");
    }
    
    if (dimA.listeningPatterns.score > 70 || dimB.listeningPatterns.score > 70) {
      strengths.push("Strong listening skills ensure good understanding");
    }

    if ((dimA.expressiveness.score > 70) !== (dimB.expressiveness.score > 70)) {
      strengths.push("Complementary expressiveness creates balanced communication");
    }

    // Analyze challenges
    if (Math.abs(dimA.assertiveness.score - dimB.assertiveness.score) > 40) {
      challenges.push("Significant assertiveness differences may cause communication imbalances");
    }

    if (Math.abs(dimA.informationProcessing.score - dimB.informationProcessing.score) > 30) {
      challenges.push("Different information processing speeds may require adjustment");
    }

    if (dimA.conflictCommunication.score < 50 && dimB.conflictCommunication.score < 50) {
      challenges.push("Both may struggle with direct conflict resolution");
    }

    // Generate recommendations
    if (challenges.length > 0) {
      recommendations.push("Schedule regular check-ins to ensure clear communication");
      recommendations.push("Establish agreed-upon communication protocols");
    }

    if (Math.abs(dimA.expressiveness.score - dimB.expressiveness.score) > 30) {
      recommendations.push("The more expressive member should allow space for the reserved member");
    }

    if (Math.abs(dimA.informationProcessing.score - dimB.informationProcessing.score) > 30) {
      recommendations.push("Adjust meeting pace to accommodate different processing styles");
    }

    return { strengths, challenges, recommendations };
  };

  const generateMockProfile = (name: string, role: string): CommunicationStylesResults => {
    // Generate realistic but random communication profiles for demo purposes
    const baseScores = {
      assertiveness: 40 + Math.random() * 40,
      expressiveness: 30 + Math.random() * 50,
      informationProcessing: 45 + Math.random() * 35,
      channelPreferences: 50 + Math.random() * 30,
      listeningPatterns: 40 + Math.random() * 40,
      influenceStrategies: 35 + Math.random() * 45,
      conflictCommunication: 30 + Math.random() * 50
    };

    const createDimension = (score: number) => ({
      score,
      level: score > 75 ? 'Very High' : score > 60 ? 'High' : score > 40 ? 'Moderate' : 'Low' as any,
      percentile: Math.round(score),
      description: `${score > 70 ? 'Strong' : score > 50 ? 'Moderate' : 'Developing'} capability in this area`
    });

    const dimensions = {
      assertiveness: createDimension(baseScores.assertiveness),
      expressiveness: createDimension(baseScores.expressiveness),
      informationProcessing: createDimension(baseScores.informationProcessing),
      channelPreferences: createDimension(baseScores.channelPreferences),
      listeningPatterns: createDimension(baseScores.listeningPatterns),
      influenceStrategies: createDimension(baseScores.influenceStrategies),
      conflictCommunication: createDimension(baseScores.conflictCommunication)
    };

    const overallScore = Object.values(baseScores).reduce((a, b) => a + b, 0) / Object.values(baseScores).length;
    
    const profileTypes = ['Director', 'Socializer', 'Thinker', 'Supporter', 'Balanced'] as const;
    const randomProfile = profileTypes[Math.floor(Math.random() * profileTypes.length)];

    return {
      dimensions,
      overallScore,
      communicationEffectivenessIndex: overallScore * 0.9,
      adaptabilityScore: baseScores.channelPreferences,
      profile: {
        type: randomProfile,
        primary: `${randomProfile} characteristics`,
        secondary: 'Secondary traits',
        strength: 'Key strengths',
        challenge: 'Development areas',
        workStyle: 'Work style preferences'
      },
      distortionAnalysis: {
        score: 15,
        level: 'Low',
        indicators: [],
        reliability: 'High',
        recommendations: [],
        consistencyCheck: 95,
        extremePatterns: 10,
        socialDesirabilityBias: 5,
        responseTimePattern: 90
      },
      contextualEffectiveness: {
        leadership: overallScore * 0.9,
        teamwork: overallScore * 1.1,
        customerService: overallScore,
        salesNegotiation: overallScore * 0.8,
        conflictResolution: overallScore * 0.95,
        publicSpeaking: overallScore * 0.85
      },
      developmentAreas: [],
      completedAt: new Date().toISOString(),
      timeSpent: 1800000,
      responsePattern: 'Consistent'
    };
  };

  const addTeamMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
        role: newMemberRole.trim(),
        profile: generateMockProfile(newMemberName.trim(), newMemberRole.trim())
      };
      
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberName('');
      setNewMemberRole('');
      setIsAddingMember(false);
    }
  };

  const removeMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getCompatibilityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    if (score >= 65) return <TrendingUp className="w-5 h-5 text-blue-600" />;
    if (score >= 50) return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            Team Compatibility Analysis
          </CardTitle>
          <CardDescription>
            Analyze communication compatibility between team members to optimize collaboration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {allMembers.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-white">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-800">{member.name}</h4>
                    <p className="text-sm text-slate-600">{member.role}</p>
                  </div>
                  {member.id !== 'current-user' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {member.profile.profile.type} Style
                  </Badge>
                  <div className="text-xs text-slate-600">
                    CEI: {Math.round(member.profile.communicationEffectivenessIndex)}%
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add Member Card */}
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
              {!isAddingMember ? (
                <Button
                  variant="ghost"
                  onClick={() => setIsAddingMember(true)}
                  className="w-full h-full min-h-[100px] flex-col gap-2"
                >
                  <Plus className="w-6 h-6 text-slate-400" />
                  <span className="text-sm text-slate-600">Add Team Member</span>
                </Button>
              ) : (
                <div className="space-y-3 w-full">
                  <div>
                    <Label htmlFor="memberName" className="text-xs">Name</Label>
                    <Input
                      id="memberName"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Enter name"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberRole" className="text-xs">Role</Label>
                    <Input
                      id="memberRole"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      placeholder="Enter role"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addTeamMember} size="sm" className="flex-1">
                      <UserPlus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAddingMember(false)} 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Matrix */}
      {allMembers.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Compatibility Matrix</CardTitle>
            <CardDescription>
              Pairwise compatibility analysis between all team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {allMembers.map((memberA, indexA) => 
                allMembers.slice(indexA + 1).map((memberB, indexB) => {
                  const compatibility = calculateCompatibility(memberA.profile, memberB.profile);
                  
                  return (
                    <div key={`${memberA.id}-${memberB.id}`} className={`p-6 rounded-lg border-2 ${getCompatibilityColor(compatibility.overallCompatibility)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getCompatibilityIcon(compatibility.overallCompatibility)}
                          <h4 className="font-semibold text-lg">
                            {memberA.name} ↔ {memberB.name}
                          </h4>
                        </div>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {compatibility.overallCompatibility}% Compatible
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Working Style Match</h5>
                          <Progress value={compatibility.workingStyleMatch} className="h-2 mb-1" />
                          <span className="text-xs text-slate-600">{compatibility.workingStyleMatch}%</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Communication Synergy</h5>
                          <Progress value={compatibility.communicationSynergy} className="h-2 mb-1" />
                          <span className="text-xs text-slate-600">{compatibility.communicationSynergy}%</span>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">Conflict Risk</h5>
                          <Progress value={compatibility.conflictPotential} className="h-2 mb-1" />
                          <span className="text-xs text-slate-600">{compatibility.conflictPotential}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-sm text-green-700 mb-2">Strengths</h5>
                          <ul className="space-y-1">
                            {compatibility.strengths.map((strength, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1">
                                <span className="text-green-500 mt-1">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-amber-700 mb-2">Challenges</h5>
                          <ul className="space-y-1">
                            {compatibility.challenges.map((challenge, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1">
                                <span className="text-amber-500 mt-1">•</span>
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm text-blue-700 mb-2">Recommendations</h5>
                          <ul className="space-y-1">
                            {compatibility.recommendations.map((rec, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1">
                                <span className="text-blue-500 mt-1">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {allMembers.length === 1 && (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-medium text-slate-700 mb-2">Build Your Team</h3>
            <p className="text-sm text-slate-600 mb-4">
              Add team members to analyze communication compatibility and optimize collaboration
            </p>
            <Button onClick={() => setIsAddingMember(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Team Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamCompatibilityAnalyzer;