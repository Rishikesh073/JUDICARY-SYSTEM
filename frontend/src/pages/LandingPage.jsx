import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LiveWorkspace from '../components/LiveWorkspace';
import Comparison from '../components/Comparison';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

const LandingPage = () => {
  return (
    <PageTransition>
      <div className="bg-slate-50 min-h-screen text-slate-900">
        <Navbar />
        <Hero />
        <LiveWorkspace />
        <Comparison />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LandingPage;

