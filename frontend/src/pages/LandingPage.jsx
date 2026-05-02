import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LiveWorkspace from '../components/LiveWorkspace';
import FeatureGrid from '../components/FeatureGrid';
import Comparison from '../components/Comparison';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <Navbar />
      <Hero />
      <LiveWorkspace />
      <FeatureGrid />
      <Comparison />
      <Footer />
    </div>
  );
};

export default LandingPage;
