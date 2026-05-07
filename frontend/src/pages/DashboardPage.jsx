import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [memo, setMemo] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/ask-lexagent', { query });
      setMemo(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50"
    >
      <Navbar />
      <main className="pt-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto py-8">
          <Dashboard />
        </div>
      </main>
    </motion.div>
  );
};

export default DashboardPage;
