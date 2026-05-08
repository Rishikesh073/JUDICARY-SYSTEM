import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Filter, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CaseExplorer = () => (
  <div className="bg-slate-50 min-h-screen pt-32 text-slate-900">
    <Navbar />
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-4xl font-serif">Case Explorer</h1>
      </div>
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search precedents by keyword, judge, or citation..." className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400" />
        </div>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm"><Filter size={16} /> Filters</button>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm"><Download size={16} /> Export List</button>
      </div>
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-[10px] uppercase tracking-widest text-slate-900 font-bold">
            <tr>
              <th className="px-6 py-4">Citation</th>
              <th className="px-6 py-4">Case Name</th>
              <th className="px-6 py-4">Court</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="even:bg-slate-50 odd:bg-white hover:bg-slate-100 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-mono text-orange-600/80">202{i} SC {120 + i}</td>
                <td className="px-6 py-4 font-serif">State of {['Maharashtra', 'Delhi', 'Karnataka'][i % 3]} v. {['John Doe', 'ABC Corp', 'Reliance'][i % 3]}</td>
                <td className="px-6 py-4">Supreme Court</td>
                <td className="px-6 py-4">202{i}</td>
                <td className="px-6 py-4"><span className="text-green-800 bg-green-100 px-2 py-0.5 rounded text-[10px] font-bold">Valid</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
);

import { motion } from 'framer-motion';

export const MemoHistory = () => {
  const memos = [
    { id: 1, title: 'Bail in PMLA Section 45 Cases', date: 'May 7, 2026', citations: 12, size: '240 KB', status: 'Verified' },
    { id: 2, title: 'Asset Seizure Precedents', date: 'May 6, 2026', citations: 8, size: '180 KB', status: 'Pending' },
    { id: 3, title: 'Anticipatory Bail under BNS', date: 'May 5, 2026', citations: 15, size: '310 KB', status: 'Verified' },
    { id: 4, title: 'Quashing of FIR - Recent Trends', date: 'May 4, 2026', citations: 6, size: '150 KB', status: 'Verified' },
    { id: 5, title: 'Money Laundering (PMLA) Section 3', date: 'May 3, 2026', citations: 10, size: '210 KB', status: 'Verified' },
    { id: 6, title: 'Interim Protection in Criminal Matters', date: 'May 2, 2026', citations: 9, size: '190 KB', status: 'Pending' },
    { id: 7, title: 'Supreme Court Trends 2025', date: 'May 1, 2026', citations: 22, size: '450 KB', status: 'Verified' },
    { id: 8, title: 'Financial Fraud and Economic Offences', date: 'Apr 30, 2026', citations: 14, size: '280 KB', status: 'Verified' },
    { id: 9, title: 'Default Bail Rights', date: 'Apr 29, 2026', citations: 7, size: '160 KB', status: 'Verified' },
    { id: 10, title: 'Special Court Jurisdiction - PMLA', date: 'Apr 28, 2026', citations: 11, size: '230 KB', status: 'Verified' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-50 min-h-screen pt-32 text-slate-900 pb-20"
    >
      <Navbar />
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif text-slate-900">Memo History</h1>
            <p className="text-slate-500 mt-2">Manage and review your generated legal research memorandums.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:outline-none focus:border-orange-500/50 transition-all shadow-sm"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {memos.map((memo, idx) => (
              <motion.div 
                key={memo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-slate-900 group-hover:text-orange-600 transition-colors mb-0.5">{memo.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <span>{memo.date}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span>{memo.citations} Citations</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span>{memo.size}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className={memo.status === 'Verified' ? 'text-green-600' : 'text-orange-500'}>{memo.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
                    <Download size={18} />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-orange-600 transition-all border border-transparent hover:border-orange-200">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 10 of 42 Memos</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50" disabled>Previous</button>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(n => (
                  <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n === 1 ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{n}</button>
                ))}
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};
import { ExternalLink } from 'lucide-react';


export const Auth = () => (
  <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center px-6">
    <div className="max-w-md w-full glass-card p-10 bg-black/40">
      <div className="text-center mb-10">
        <div className="inline-flex bg-orange-600/20 p-3 rounded-2xl border border-orange-500/30 mb-4">
          <Shield className="text-orange-500" size={32} />
        </div>
        <h1 className="text-3xl font-serif mb-2">Welcome to LexAgent</h1>
        <p className="text-slate-500 text-sm">Enter your firm email to get started.</p>
      </div>
      <form className="space-y-6" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Firm Email</label>
          <input type="email" placeholder="name@yourfirm.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500/50 outline-none" />
        </div>
        <button className="w-full btn-primary py-4">Continue with SSO</button>
        <div className="text-center">
          <p className="text-xs text-slate-600">By continuing, you agree to our Terms and Privacy Policy.</p>
        </div>
      </form>
    </div>
  </div>
);
import { Shield } from 'lucide-react';
