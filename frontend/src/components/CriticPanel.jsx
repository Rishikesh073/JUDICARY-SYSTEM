import React from 'react';
import { motion } from 'framer-motion';

const CriticPanel = ({ cases }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Critic Board</h3>
            </div>

            <div className="flex flex-col gap-4">
                {cases.map((c, i) => {
                    let badgeColor = "bg-slate-100 text-slate-800 border-slate-200";
                    if (c.verdict === "Approved") badgeColor = "bg-green-100 text-green-800 border-green-200";
                    if (c.verdict === "Dissenting") badgeColor = "bg-orange-100 text-orange-800 border-orange-200";
                    if (c.verdict === "Rejected") badgeColor = "bg-red-100 text-red-800 border-red-200";

                    return (
                        <div key={i} className={`p-4 rounded-lg border ${badgeColor.split(' ')[2]} bg-white shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3`}>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-800 text-sm">{c.filename.replace('.txt', '')}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                                    {c.verdict}
                                </span>
                                <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-600">
                                    Score: {c.confidence_score}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default CriticPanel;
