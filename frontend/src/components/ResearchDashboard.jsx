import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, BookMarked, Scale, ExternalLink } from 'lucide-react';

const AnalyticCard = ({ title, data, icon: Icon }) => (
  <div className="bg-[#0F0F12] border border-white/5 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-orange-600/10 p-2 rounded-lg text-orange-500">
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">{title}</h3>
    </div>
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i} className="flex items-center justify-between group cursor-default">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-600 bg-white/5 w-5 h-5 flex items-center justify-center rounded">0{i+1}</span>
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{item.label}</span>
          </div>
          <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const ResearchDashboard = () => {
  const trendingTopics = [
    { label: "PMLA Section 45 Validity", value: "+45%" },
    { label: "Digital Personal Data Protection", value: "+32%" },
    { label: "Arbitration Non-Signatory", value: "+28%" },
    { label: "Bail in Economic Offences", value: "+21%" },
  ];

  const mostCited = [
    { label: "Vijay Madanlal vs Union of India", value: "1,240" },
    { label: "Satender Kumar Antil vs CBI", value: "890" },
    { label: "Lalita Kumari vs Govt. of UP", value: "760" },
    { label: "Arnesh Kumar vs State of Bihar", value: "620" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <AnalyticCard title="Trending Legal Topics" data={trendingTopics} icon={TrendingUp} />
      <AnalyticCard title="Most Cited Judgments" data={mostCited} icon={BookMarked} />
      
      <div className="lg:col-span-2 bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex items-center justify-between group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[80px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <h3 className="text-xl font-serif mb-2 text-white">Query Analytics Engine</h3>
          <p className="text-slate-500 text-sm max-w-md">Real-time mapping of judicial trends across all High Courts in India. Predictive outcome analysis coming in Q3.</p>
          <div className="flex gap-4 mt-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">12.8k</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Queries</span>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-orange-500">98.2%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Retrieval Accuracy</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block relative z-10 bg-black/40 border border-white/10 p-4 rounded-xl group-hover:border-orange-500/30 transition-colors">
          <BarChart3 size={40} className="text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};

export default ResearchDashboard;
