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
        description="Revolutionary real-time skills intelligence platform with live market data from global sources. Multi-AI consensus predictions, automated insights from recruitment companies, governments, NGOs, and economic institutions worldwide."
        keywords="future skills, AI prediction, career pathways, skills forecasting, professional development, AI intelligence, real-time market data, multi-AI consensus, global skills intelligence, live dashboard"
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <FutureSkillsEnhanced />
      </div>
    </>
  );
};

export default FutureSkillsAI;