import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, FileText, Download, Eye, Gavel, AlertTriangle, BookOpen, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

import { useResearch } from '../context/ResearchContext';
import { AgentOrchestrator } from './AgentOrchestrator';
import CitationGraph from './CitationGraph';


const verdictConfig = {
  Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500', label: 'Approved' },
  Dissenting: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500', label: 'Dissenting' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500', label: 'Rejected' },
};

const LiveWorkspace = () => {
  const navigate = useNavigate();

  // All research state lives in the global context — survives navigation
  const {
    query, setQuery,
    isResearching,
    memo,
    cases,
    error,
    agentStatuses,
    telemetry,
    history,
    loadHistoryItem,
    handleResearch,
  } = useResearch();

  const [queryTip, setQueryTip] = useState('Tip: Start with a specific legal question or case type.');

  useEffect(() => {
    if (!query) {
      setQueryTip('Tip: Start with a specific legal question or case type.');
    } else if (query.length < 15) {
      setQueryTip("Query is a bit broad. Try adding a specific Act (e.g., 'IPC') or issue (e.g., 'bail').");
    } else if (!/(supreme|high|court|district)/i.test(query)) {
      setQueryTip('Tip: Mentioning a specific Court helps narrow down jurisdiction.');
    } else if (!/\d{4}/.test(query)) {
      setQueryTip("Tip: Adding a year (e.g. 'after 2020') helps filter recent precedents.");
    } else {
      setQueryTip('Excellent query context. Ready for deep research.');
    }
  }, [query]);

  const downloadMemo = () => {
    if (!memo) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(217, 119, 6);
    doc.text('LEXAGENT — LEGAL MEMORANDUM', 10, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Query: ${memo.query}`, 10, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 35);
    doc.line(10, 40, 200, 40);
    doc.setFontSize(12);
    doc.setTextColor(0);
    const splitText = doc.splitTextToSize(memo.query, 180);
    doc.text(splitText, 10, 50);
    doc.save(`lexagent_memo_${memo.query.substring(0, 20)}.pdf`);
  };

  return (
    <section className="py-24 px-6 bg-slate-100" id="research">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Live Workspace
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif mb-6 text-slate-900 tracking-tight"
          >
            Ask. Analyze. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 italic pr-2">Act.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Natural language legal queries — no boolean operators, no keyword games.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl shadow-slate-200/50 rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="mb-10 relative z-10">
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-4 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
              Your Query
            </label>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-[1.25rem] blur-md opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex flex-col sm:flex-row items-center bg-white border-2 border-slate-200 focus-within:border-orange-400 rounded-2xl p-2 transition-all shadow-sm focus-within:shadow-md gap-2 sm:gap-0">
                <Search className="text-slate-400 ml-4 hidden sm:block shrink-0 transition-colors group-focus-within:text-orange-500" size={22} />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isResearching && query.trim().length > 0) handleResearch();
                  }}
                  placeholder="Find Supreme Court judgments from the last 10 years..."
                  className="w-full bg-transparent border-none px-4 py-3 sm:py-4 text-base sm:text-lg text-slate-900 focus:outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
                />
                <button 
                  onClick={handleResearch}
                  disabled={isResearching || query.trim().length === 0}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-8 py-4 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none whitespace-nowrap shrink-0"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Analyzing</span>
                    </>
                  ) : (
                    <>
                      <span>Research now</span>
                      <Search className="sm:hidden ml-2" size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
              <div className="flex flex-wrap gap-2">
                {['Supreme Court', '2014-2025', 'PMLA'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(prev => prev ? `${prev.trim()} ${tag}` : tag)}
                    className="px-4 py-1.5 rounded-full bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-xs text-slate-600 hover:text-orange-700 font-semibold transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className={`text-xs font-medium italic flex items-center gap-1.5 transition-colors ${query.length > 0 && query.length < 15 ? 'text-orange-500' : 'text-slate-400'}`}>
                {queryTip}
              </p>
            </div>

            {history && history.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border-t border-slate-100 pt-6"
              >
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4 ml-1">
                  <History size={12} className="text-orange-500" />
                  Recent Searches
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {history.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className="text-left px-4 py-3 rounded-xl bg-slate-50/50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 transition-all group flex flex-col justify-center"
                    >
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-orange-700 truncate w-full mb-1">
                        {item.query}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.date} • {item.cases?.length || 0} Cases
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {(isResearching || memo) && (
            <AgentOrchestrator statuses={agentStatuses} telemetry={telemetry} />
          )}

          {cases.length > 0 && (
            <div className="mb-12">
              <CitationGraph cases={cases} query={query} />
            </div>
          )}

          <AnimatePresence>
            {memo && (
              <InteractiveMemo query={memo.query} cases={memo.cases} downloadMemo={downloadMemo} navigate={navigate} />
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const InteractiveMemo = ({ query, cases, downloadMemo, navigate }) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('holding'); // 'holding', 'ratio', 'details'

  if (!cases || cases.length === 0) return (
    <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
      <p className="text-slate-500 italic">No relevant precedents found for this specific query.</p>
    </div>
  );

  const currentCase = cases[activeCaseIdx];
  const v = verdictConfig[currentCase.verdict] || verdictConfig.Rejected;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden mt-8"
    >
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-serif">Legal memorandum — {query.substring(0, 40)}...</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Synthesized by LexAgent Elite</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/smartview', { state: { cases, query } })}
            className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 transition-all"
          >
            <Eye size={14} /> SmartView
          </button>
          <button 
            onClick={downloadMemo}
            className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 transition-all"
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
        <div className="lg:col-span-1 border-r border-slate-100 bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Found Precedents</h4>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {cases.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCaseIdx(idx)}
                className={`w-full text-left p-4 transition-all hover:bg-white flex flex-col gap-1 ${activeCaseIdx === idx ? 'bg-white border-r-4 border-orange-500 shadow-sm' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase ${c.verdict === 'Approved' ? 'text-green-600' : c.verdict === 'Dissenting' ? 'text-orange-600' : 'text-slate-400'}`}>
                    {c.verdict}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">{c.confidence_score}%</span>
                </div>
                <span className="text-xs font-medium text-slate-800 line-clamp-2">{c.filename.replace('.pdf', '').replace(/_/g, ' ')}</span>
                <span className="text-[9px] text-slate-500">{c.year} • {c.court}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col">
          <div className="flex border-b border-slate-100 px-6 bg-slate-50/30">
            {[
              { id: 'holding', label: 'Key Holding' },
              { id: 'ratio', label: 'Legal Logic (Ratio)' },
              { id: 'details', label: 'Deep Context' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1 bg-white">
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge label="Court" value={currentCase.court} />
              <Badge label="Bench" value={currentCase.bench_strength} />
              <Badge label="Coram" value={currentCase.coram} />
              {currentCase.special_case_flag && currentCase.special_case_flag !== 'No' && (
                 <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                    <span className="text-[9px] font-black uppercase text-amber-500 tracking-tighter">Special Case</span>
                    <span className="text-[11px] font-bold text-amber-700">{currentCase.special_case_flag}</span>
                 </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCaseIdx}-${activeTab}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="prose prose-slate max-w-none"
              >
                {activeTab === 'holding' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Gavel size={18} className="text-orange-500" />
                      <h4 className="text-slate-900 font-serif text-lg m-0">Judicial Holding</h4>
                    </div>
                    <div className="bg-orange-50/30 p-6 border-l-4 border-orange-400 rounded-r-xl shadow-sm">
                      <p className="text-slate-800 leading-relaxed italic text-base m-0">
                        "{currentCase.holding}"
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                       <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Charges/Sections</p>
                          <p className="text-sm font-bold text-slate-700">{currentCase.crime_charges || 'N/A'}</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sentence/Penalty</p>
                          <p className="text-sm font-bold text-slate-700">{currentCase.sentence_duration || 'N/A'}</p>
                       </div>
                    </div>
                  </div>
                )}
                {activeTab === 'ratio' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={18} className="text-orange-500" />
                      <h4 className="text-slate-900 font-serif text-lg m-0">Ratio Decidendi</h4>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-xl border border-slate-100">
                      <p className="text-slate-700 leading-relaxed text-base m-0">
                        {currentCase.ratio_decidendi}
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === 'details' && (
                  <div className="space-y-8">
                    {currentCase.obiter_dicta && currentCase.obiter_dicta !== 'Not found' && (
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertTriangle size={14} className="text-slate-400" /> Obiter Dicta
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed">{currentCase.obiter_dicta}</p>
                      </div>
                    )}
                    
                    {currentCase.dissenting_opinion && currentCase.dissenting_opinion !== 'None' && (
                      <div>
                        <h5 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-3">Dissenting Opinion</h5>
                        <p className="text-sm text-slate-600 leading-relaxed p-4 bg-purple-50 border border-purple-100 rounded-xl">{currentCase.dissenting_opinion}</p>
                      </div>
                    )}

                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Cited Precedents</h5>
                      <div className="flex flex-wrap gap-2">
                        {currentCase.cited_precedents && currentCase.cited_precedents.length > 0 ? (
                          currentCase.cited_precedents.map((cite, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                              {cite}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400 text-sm italic">No internal citations extracted.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Badge = ({ label, value }) => (
  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
    <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{label}</span>
    <span className="text-[11px] font-bold text-slate-700">{value}</span>
  </div>
);

export default LiveWorkspace;
