import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatInterface from '../components/ChatInterface';
import AgentLog from '../components/AgentLog';
import ResearcherPanel from '../components/ResearcherPanel';
import SummarizerPanel from '../components/SummarizerPanel';
import CriticPanel from '../components/CriticPanel';
import CitationGraph from '../components/CitationGraph';
import { motion } from 'framer-motion';

const ResearchPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuery, setCurrentQuery] = useState("");
    
    // Multi-agent states
    const [agentStatuses, setAgentStatuses] = useState({
        researcher: 'waiting', // waiting, running, complete
        summarizer: 'waiting',
        critic: 'waiting'
    });
    
    const [cases, setCases] = useState(null);
    const [summarizedCases, setSummarizedCases] = useState(null);
    const [evaluatedCases, setEvaluatedCases] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (query) => {
        setIsLoading(true);
        setError(null);
        setCurrentQuery(query);
        setAgentStatuses({
            researcher: 'waiting',
            summarizer: 'waiting',
            critic: 'waiting'
        });
        setCases(null);
        setSummarizedCases(null);
        setEvaluatedCases(null);

        try {
            const response = await fetch('http://localhost:5001/api/ask-lexagent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.body) throw new Error("ReadableStream not supported in this browser.");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                
                const lines = buffer.split('\n\n');
                // The last element is either empty or an incomplete chunk
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            
                            if (data.type === 'status') {
                                setAgentStatuses(prev => ({
                                    ...prev,
                                    [data.agent]: data.status
                                }));
                            } else if (data.type === 'payload') {
                                if (data.agent === 'researcher') {
                                    setCases(data.data);
                                } else if (data.agent === 'summarizer') {
                                    setSummarizedCases(data.data);
                                } else if (data.agent === 'critic') {
                                    setEvaluatedCases(data.data);
                                }
                            } else if (data.type === 'error') {
                                throw new Error(data.message);
                            }
                        } catch (e) {
                            console.error("Error parsing JSON from stream line:", line, e);
                            if (e.message && !e.message.includes("JSON")) {
                                throw e; // bubble up the backend errors
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to communicate with AI Engine. Please make sure the backend is running.");
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
                    
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    {/* Agent Status Log */}
                    {(agentStatuses.researcher !== 'waiting' || isLoading) && (
                        <AgentLog statuses={agentStatuses} />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            {cases && <ResearcherPanel cases={cases} />}
                            {summarizedCases && <SummarizerPanel cases={summarizedCases} />}
                            {evaluatedCases && <CriticPanel cases={evaluatedCases} />}
                        </div>
                        <div className="space-y-6">
                            {evaluatedCases && <CitationGraph cases={evaluatedCases} query={currentQuery} />}
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

export default ResearchPage;
