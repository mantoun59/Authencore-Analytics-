import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import FutureSkillsEnhanced from '@/components/FutureSkillsEnhanced';
import SEOHead from '@/components/SEOHead';

const FutureSkillsAI: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <SEOHead 
        title="Future Skills AI Intelligence Platform | AuthenCore"
        description="Predict your future skills needs and career pathways using advanced AI intelligence for up to 3 years ahead. Get personalized recommendations based on your assessment results."
        keywords="future skills, AI prediction, career pathways, skills forecasting, professional development, AI intelligence"
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <FutureSkillsEnhanced />
      </div>
    </>
  );
};

export default FutureSkillsAI;