import React from 'react';
import LogoSelection from '../components/LogoSelection';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LogoSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <LogoSelection />
      </main>
      <Footer />
    </div>
  );
};

export default LogoSelectionPage;