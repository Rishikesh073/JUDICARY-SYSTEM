import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatInterface from '../components/ChatInterface';
import MemoDisplay from '../components/MemoDisplay';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResearchPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [memo, setMemo] = useState(null);
    const [logs, setLogs] = useState([]);

    const handleSearch = async (query) => {
        setIsLoading(true);
        setMemo(null);
        setLogs(["Initiating LexAgent reasoning pipeline..."]);
        try {
            const response = await axios.post('http://localhost:5000/api/ask-lexagent', { query });
            setMemo(response.data);
            if (response.data.logs) setLogs(response.data.logs);
        } catch (err) {
            console.error(err);
            setLogs(prev => [...prev, "Error: Engine connection failed."]);
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Query & Logs */}
                    <div className="flex flex-col gap-6">
                        <ChatInterface onSearch={handleSearch} isLoading={isLoading} />
                        
                        {(isLoading || logs.length > 0) && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">Agent Activity Trace</h3>
                                <div className="space-y-3">
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-3 items-start animate-in slide-in-from-left duration-300">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]" />
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{log}</p>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3 items-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                                            <p className="text-[10px] text-slate-400 italic">Clerk is thinking...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Memo Display */}
                    <div className="lg:col-span-2">
                        {memo && <MemoDisplay data={memo} />}
                        {!memo && !isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl p-12">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p className="font-medium">No active research session</p>
                                <p className="text-xs mt-1 text-slate-500">Your clerk is ready to analyze precedents</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

export default ResearchPage;
