import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LiveWorkspace from '../components/LiveWorkspace';
import Comparison from '../components/Comparison';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-50 min-h-screen text-slate-900"
    >
      <Navbar />
      <Hero />
      <LiveWorkspace />
      <Comparison />
      <Footer />
    </motion.div>
  );
};

export default LandingPage;

