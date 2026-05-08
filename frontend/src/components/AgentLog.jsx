import React from 'react';
import { motion } from 'framer-motion';

const StatusIcon = ({ status }) => {
    if (status === 'waiting') {
        return <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />;
    } else if (status === 'running') {
        return (
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent flex-shrink-0"
            />
        );
    } else if (status === 'complete') {
        return (
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        );
    }
    return null;
};

const AgentLog = ({ statuses }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Multi-Agent Pipeline</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                
                <div className="flex items-center gap-3">
                    <StatusIcon status={statuses.researcher} />
                    <span className={`font-medium ${statuses.researcher === 'running' ? 'text-blue-600' : 'text-slate-600'}`}>
                        Researcher Agent
                    </span>
                </div>

                <div className="hidden sm:block h-px w-8 bg-slate-200"></div>

                <div className="flex items-center gap-3">
                    <StatusIcon status={statuses.summarizer} />
                    <span className={`font-medium ${statuses.summarizer === 'running' ? 'text-blue-600' : 'text-slate-600'}`}>
                        Summarizer Agent
                    </span>
                </div>

                <div className="hidden sm:block h-px w-8 bg-slate-200"></div>

                <div className="flex items-center gap-3">
                    <StatusIcon status={statuses.critic} />
                    <span className={`font-medium ${statuses.critic === 'running' ? 'text-blue-600' : 'text-slate-600'}`}>
                        Critic Agent
                    </span>
                </div>

            </div>
        </div>
    );
};

export default AgentLog;
