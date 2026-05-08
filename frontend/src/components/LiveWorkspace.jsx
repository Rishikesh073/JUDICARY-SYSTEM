import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, FileText, Download, Eye, Gavel, AlertTriangle, BookOpen } from 'lucide-react';
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
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-orange-600 font-bold mb-4 block">Live Workspace</span>
          <h2 className="text-4xl font-serif mb-4 text-slate-900">Ask. Analyze. Act.</h2>
          <p className="text-slate-600">Natural language legal queries — no boolean operators, no keyword games.</p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
          <div className="mb-10">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Your Query</label>
            <div className="relative">
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isResearching) handleResearch();
                }}
                placeholder="Find all Supreme Court judgments from the last 10 years where bail was denied for financial fraud..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-6 py-4 text-slate-900 focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-500 italic"
              />
              <button 
                onClick={handleResearch}
                disabled={isResearching}
                className="absolute right-2 top-2 bottom-2 bg-orange-600 hover:bg-orange-700 text-white px-6 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isResearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                Research now
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                {['Supreme Court', '2014-2025', 'PMLA'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-bold">{tag}</span>
                ))}
              </div>
              <p className={`text-[10px] font-medium italic ${query.length > 0 && query.length < 15 ? 'text-orange-500' : 'text-slate-400'}`}>
                {queryTip}
              </p>
            </div>
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
        </div>
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
