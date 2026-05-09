import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Comparison from '../components/Comparison';
import JuniorClerkSection from '../components/JuniorClerkSection';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

const LandingPage = () => {
  return (
    <PageTransition>
      <div className="bg-slate-50 min-h-screen text-slate-900">
        <Navbar />
        <Hero />
        <JuniorClerkSection />
        <Comparison />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LandingPage;

