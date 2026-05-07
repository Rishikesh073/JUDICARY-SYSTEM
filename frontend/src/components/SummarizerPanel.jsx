import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SummarizerPanel = ({ cases }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Case Summaries</h3>
            </div>
            
            <div className="space-y-4">
                {cases.map((c, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-800 mb-2">{c.filename.replace('.txt', '')}</h4>
                        
                        <div className="mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Holding</span>
                            <p className="text-sm text-slate-700 mt-1">{c.holding}</p>
                        </div>
                        
                        <div className="mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Ratio Decidendi</span>
                            <p className="text-sm text-slate-700 mt-1">{c.ratio_decidendi}</p>
                        </div>
                        
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Outcome</span>
                            <p className="text-sm text-slate-700 mt-1">{c.outcome}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default SummarizerPanel;
