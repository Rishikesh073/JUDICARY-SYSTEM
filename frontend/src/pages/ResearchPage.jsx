import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatInterface from '../components/ChatInterface';
import MemoDisplay from '../components/MemoDisplay';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResearchPage = () => {
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
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-slate-50"
        >
            <Navbar />
            <main className="pt-24 px-6 lg:px-12 max-w-7xl mx-auto py-8">
                <div className="flex flex-col gap-6">
                    <ChatInterface onSearch={handleSearch} isLoading={isLoading} />
                    {memo && <MemoDisplay data={memo} />}
                </div>
            </main>
        </motion.div>
    );
};

export default ResearchPage;
