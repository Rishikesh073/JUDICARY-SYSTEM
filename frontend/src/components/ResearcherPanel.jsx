import React from 'react';
import { motion } from 'framer-motion';

const ResearcherPanel = ({ cases }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Found {cases.length} Relevant Cases</h3>
            </div>
            
            <ul className="space-y-3">
                {cases.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="mt-1 w-6 h-6 rounded bg-blue-50 text-blue-600 text-xs flex items-center justify-center font-bold">
                            #{c.id}
                        </div>
                        <div>
                            <p className="font-medium text-slate-700">{c.filename.replace('.txt', '')}</p>
                            <p className="text-sm text-slate-500">Year: {c.year} • Source: <a href={c.source_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Link</a></p>
                        </div>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

export default ResearcherPanel;
