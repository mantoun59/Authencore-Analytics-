/**
 * Psychometric Audit Page
 * Administrative access to audit dashboard and validation controls
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PsychometricAuditDashboard from '@/components/PsychometricAuditDashboard';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const PsychometricAudit: React.FC = () => {
  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-24">
          <PsychometricAuditDashboard />
        </main>
        <Footer />
      </div>
    </ProtectedAdminRoute>
  );
};

export default PsychometricAudit;