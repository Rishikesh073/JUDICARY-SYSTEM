import React from 'react';
import { motion } from 'framer-motion';

const CitationGraph = ({ cases, query }) => {
    // Generate positions for nodes in a circle around the center
    const centerX = 300;
    const centerY = 200;
    const radius = 120;
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full min-h-[450px] flex flex-col"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Citation Map</h3>
            </div>

            <div className="flex-1 relative w-full flex items-center justify-center overflow-hidden bg-slate-50 rounded-lg border border-slate-200">
                <svg width="600" height="400" viewBox="0 0 600 400" className="w-full h-auto max-w-full">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                        </marker>
                    </defs>

                    {/* Draw edges first so they are behind nodes */}
                    {cases.map((c, i) => {
                        const angle = (i / cases.length) * 2 * Math.PI - Math.PI / 2;
                        const x = centerX + radius * Math.cos(angle);
                        const y = centerY + radius * Math.sin(angle);
                        
                        let strokeColor = "#94a3b8"; // slate-400
                        if (c.verdict === "Approved") strokeColor = "#22c55e"; // green-500
                        if (c.verdict === "Dissenting") strokeColor = "#f97316"; // orange-500
                        if (c.verdict === "Rejected") strokeColor = "#ef4444"; // red-500

                        return (
                            <line 
                                key={`edge-${i}`} 
                                x1={centerX} 
                                y1={centerY} 
                                x2={x} 
                                y2={y} 
                                stroke={strokeColor} 
                                strokeWidth="2"
                                strokeDasharray={c.verdict === "Rejected" ? "4 4" : "none"}
                                markerEnd="url(#arrowhead)"
                                className="opacity-60"
                            />
                        );
                    })}

                    {/* Center Node (Query) */}
                    <circle cx={centerX} cy={centerY} r="30" fill="#1e293b" />
                    <text x={centerX} y={centerY + 5} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">QUERY</text>

                    {/* Case Nodes */}
                    {cases.map((c, i) => {
                        const angle = (i / cases.length) * 2 * Math.PI - Math.PI / 2;
                        const x = centerX + radius * Math.cos(angle);
                        const y = centerY + radius * Math.sin(angle);

                        let fill = "#f1f5f9"; // slate-100
                        let stroke = "#cbd5e1"; // slate-300
                        if (c.verdict === "Approved") { fill = "#dcfce7"; stroke = "#22c55e"; }
                        if (c.verdict === "Dissenting") { fill = "#ffedd5"; stroke = "#f97316"; }
                        if (c.verdict === "Rejected") { fill = "#fee2e2"; stroke = "#ef4444"; }

                        return (
                            <g key={`node-${i}`} className="cursor-pointer transition-transform hover:scale-110" style={{ transformOrigin: `${x}px ${y}px` }}>
                                <circle cx={x} cy={y} r="25" fill={fill} stroke={stroke} strokeWidth="3" />
                                <text x={x} y={y + 5} textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">#{i + 1}</text>
                                
                                {/* Fake Tooltip on Hover */}
                                <title>{c.filename} - {c.verdict} ({c.confidence_score}%)</title>
                            </g>
                        );
                    })}
                </svg>
            </div>
            
            <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 block"></span> Approved</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 block"></span> Dissenting</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 block"></span> Rejected</div>
            </div>
        </motion.div>
    );
};

export default CitationGraph;
