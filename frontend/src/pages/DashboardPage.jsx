import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import axios from 'axios';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [memo, setMemo] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ask-lexagent', { query });
      setMemo(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <main className="pt-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto py-8">
          <Dashboard onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
