import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, FileText, Shield, ChevronDown, ChevronRight, Scale, Calendar, Gavel, Loader, AlertTriangle, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import axios from 'axios';

export const MemoHistory = () => {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      // Only show full loading spinner on first load
      if (memos.length === 0) setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/history');
        const data = Array.isArray(response.data) ? response.data : [];
        setMemos(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch memo history:', err);
        if (memos.length === 0) {
          setError('Could not load history. Make sure the AI engine is running.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchHistory();

    // Poll every 10 seconds to pick up new research sessions automatically
    const interval = setInterval(fetchHistory, 10000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const filtered = memos.filter(m =>
    m.query?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const caseName = (filename) =>
    (filename || '').replace(/\.(json|PDF|pdf)$/i, '').replace(/_/g, ' ');

  return (
    <PageTransition>
      <div className="bg-[#FDFDFD] min-h-screen pt-32 text-slate-900 pb-20">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-4">
                <Database size={11} /> Research Archive
              </span>
              <h1 className="text-4xl font-serif text-slate-900">Memo History</h1>
              <p className="text-slate-500 mt-2 text-sm">
                Every query run through the AI engine — with its full results preserved.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries..."
                className="bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm w-72 focus:outline-none focus:border-orange-400 transition-all shadow-sm font-serif"
              />
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-orange-100 border-t-orange-600 animate-spin" />
              <p className="text-sm font-serif text-slate-500">Loading your research archive…</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center bg-white border border-slate-100 rounded-[2.5rem]">
              <AlertTriangle size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-serif">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center bg-white border border-slate-100 rounded-[2.5rem]">
              <FileText size={56} className="text-slate-100 mx-auto mb-5" />
              <h3 className="text-2xl font-serif text-slate-900 mb-2">No research history yet</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Run a query on the Research page and it will automatically appear here with all its results.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                {filtered.length} {filtered.length === 1 ? 'session' : 'sessions'} found
              </p>

              {filtered.map((memo, idx) => (
                <motion.div
                  key={memo.id || idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:border-orange-200/60 transition-all shadow-sm"
                >
                  {/* Row header — click to expand */}
                  <button
                    onClick={() => setExpandedId(expandedId === (memo.id || idx) ? null : (memo.id || idx))}
                    className="w-full text-left p-6 flex items-center gap-5 group"
                  >
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all flex-shrink-0">
                      <FileText size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                        {memo.query}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={10} /> {memo.date || 'Unknown date'}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="flex items-center gap-1.5">
                          <Scale size={10} /> {memo.case_count ?? memo.cases?.length ?? 0} cases retrieved
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-slate-300 group-hover:text-orange-500 transition-colors">
                      {expandedId === (memo.id || idx) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </button>

                  {/* Expanded case results */}
                  <AnimatePresence>
                    {expandedId === (memo.id || idx) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                          {memo.cases && memo.cases.length > 0 ? (
                            <>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Cases Retrieved by Engine
                              </p>
                              <div className="grid grid-cols-1 gap-3">
                                {memo.cases.map((c, i) => (
                                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <Gavel size={14} className="text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-serif text-slate-900 leading-snug mb-1 truncate">
                                        {caseName(c.filename)}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-black text-orange-600 uppercase tracking-wider px-2 py-0.5 bg-orange-50 rounded-md">
                                          {c.act || 'IPC'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                          {c.year || '—'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                                          {c.court?.split(' ').slice(0, 2).join(' ') || 'Supreme Court'}
                                        </span>
                                        {c.confidence_score > 0 && (
                                          <>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span className={`text-[9px] font-black uppercase tracking-wider ${c.confidence_score >= 85 ? 'text-green-600' : 'text-amber-500'}`}>
                                              {c.confidence_score}% confidence
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      {c.holding && (
                                        <p className="text-xs text-slate-500 font-serif mt-2 leading-relaxed line-clamp-2">
                                          {c.holding}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-slate-400 font-serif italic py-4 text-center">
                              No case data stored for this session.
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

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
