import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, FileText, Download, ExternalLink, ChevronDown, Eye, Scale, Gavel, Users, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';

import CitationGraph from './CitationGraph';

const STEPS = [
  { id: 1, label: 'Intent parsed' },
  { id: 2, label: '50 cases found' },
  { id: 3, label: 'NLP pipeline' },
  { id: 4, label: 'Filtered' },
  { id: 5, label: 'Memo ready' },
];

const verdictConfig = {
  Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500', label: 'Approved' },
  Dissenting: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500', label: 'Dissenting' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500', label: 'Rejected' },
};

const LiveWorkspace = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [memo, setMemo] = useState(null);
  const [cases, setCases] = useState([]);
  const [error, setError] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (idx) => setExpandedCards(prev => ({ ...prev, [idx]: !prev[idx] }));

  const downloadMemo = () => {
    if (!memo) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(217, 119, 6); // Brand Orange
    doc.text("LEXAGENT — LEGAL MEMORANDUM", 10, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Query: ${memo.query}`, 10, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 35);
    doc.line(10, 40, 200, 40);

    // Body
    doc.setFontSize(12);
    doc.setTextColor(0);
    const splitText = doc.splitTextToSize(memo.memo, 180);
    doc.text(splitText, 10, 50);
    
    doc.save(`lexagent_memo_${memo.query.substring(0, 20)}.pdf`);
  };

  const handleResearch = async () => {
    if (!query) return;
    setIsResearching(true);
    setCurrentStep(1);
    setMemo(null);
    setCases([]);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/ask-lexagent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.body) throw new Error("ReadableStream not supported.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let finalMemoContent = "";
      let finalCases = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'error') {
                throw new Error(data.message);
              } else if (data.type === 'status') {
                if (data.status === 'running') {
                    if (data.agent === 'researcher') setCurrentStep(2);
                    if (data.agent === 'summarizer') setCurrentStep(3);
                    if (data.agent === 'critic') setCurrentStep(4);
                }
              } else if (data.type === 'payload' && data.agent === 'critic') {
                const evaluatedCases = data.data;
                finalCases = evaluatedCases;
                finalMemoContent = evaluatedCases.map((c, i) => 
                  `### Case ${i+1}: ${c.filename}\n**Verdict:** ${c.verdict} (Confidence: ${c.confidence_score}%)\n\n**Holding:**\n${c.holding}\n\n**Ratio Decidendi:**\n${c.ratio_decidendi}\n`
                ).join('\n---\n\n');
              }
            } catch (e) {
              console.error("Error parsing stream line:", e);
              if (e.message && e.message !== "Unexpected token d in JSON at position 0" && !e.message.includes("JSON")) {
                throw e; // rethrow business logic errors
              }
            }
          }
        }
      }

      setCurrentStep(5);
      setCases(finalCases);
      setMemo({ query: query, memo: finalMemoContent || "No relevant cases found." });

    } catch (err) {
      setError("Engine connection failed. Please ensure the backend is running.");
      console.error(err);
    } finally {
      setIsResearching(false);
      setTimeout(() => setCurrentStep(0), 3000);
    }
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
            
            <div className="flex gap-2 mt-4">
              {['Supreme Court', '2014-2025', 'PMLA'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-bold">{tag}</span>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          {(isResearching || memo) && (
            <div className="relative flex justify-between items-center mb-16 max-w-3xl mx-auto mt-12">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
              <motion.div 
                className="absolute top-1/2 left-0 h-0.5 bg-orange-600 -z-10 -translate-y-1/2"
                initial={{ width: 0 }}
                animate={{ width: `${(Math.max(0, currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border-2 ${
                    currentStep > idx + 1 ? 'bg-orange-600 border-orange-600 text-white' : 
                    currentStep === idx + 1 ? 'bg-white border-orange-600 text-orange-600 shadow-sm' :
                    'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {currentStep > idx + 1 ? <CheckCircle2 size={14} /> : step.id}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep === idx + 1 ? 'text-orange-500' : 'text-slate-600'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Citation Graph */}
          {cases.length > 0 && (
            <div className="mb-12">
              <CitationGraph cases={cases} query={query} />
            </div>
          )}

          {/* Memo Output — Structured Case Cards */}
          <AnimatePresence>
            {memo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Memo Header */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-600/10 p-2.5 rounded-xl">
                      <FileText className="text-orange-500" size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-slate-900">Legal Memorandum</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">{memo.query.substring(0, 50)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => navigate('/smartview', { state: { cases, query } })}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Eye size={14} /> SmartView
                    </button>
                    <button
                      onClick={downloadMemo}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 transition-all"
                    >
                      <Download size={14} /> PDF
                    </button>
                    <span className="bg-green-50 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  </div>
                </div>

                {/* Synthesis Report (Original Memo) */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText size={14} className="text-orange-500" /> Executive Synthesis
                  </h4>
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
                      {memo.memo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supporting Case Analysis</span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                {/* Individual Case Cards */}
                {cases.map((c, idx) => {
                  const v = verdictConfig[c.verdict] || verdictConfig.Rejected;
                  const isExpanded = expandedCards[idx];
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                    >
                      {/* Verdict Accent Bar */}
                      <div className={`h-1.5 ${v.accent}`} />

                      <div className="p-6">
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${v.bg} ${v.text} ${v.border}`}>
                                {v.label}
                              </span>
                              {c.special_case_flag && c.special_case_flag.startsWith('Yes') && (
                                <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                  <AlertTriangle size={10} /> Special
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif text-xl text-slate-900 leading-tight">
                              {c.filename ? c.filename.replace('.json', '').replace(/_/g, ' ') : `Case ${idx + 1}`}
                            </h4>
                          </div>
                          {/* Confidence Gauge */}
                          <div className="flex flex-col items-center ml-4">
                            <div className="relative w-16 h-16">
                              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke={c.confidence_score >= 70 ? '#ea580c' : c.confidence_score >= 40 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${c.confidence_score}, 100`} strokeLinecap="round" />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">{c.confidence_score}%</span>
                            </div>
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">Confidence</span>
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <Scale size={13} className="text-slate-400" />
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Court</p>
                              <p className="text-xs font-semibold text-slate-700">{c.year || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={13} className="text-slate-400" />
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                              <p className="text-xs font-semibold text-slate-700">{c.date_of_judgment || 'Unknown'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={13} className="text-slate-400" />
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bench</p>
                              <p className="text-xs font-semibold text-slate-700">{c.bench_strength || 'Unknown'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gavel size={13} className="text-slate-400" />
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Charges</p>
                              <p className="text-xs font-semibold text-slate-700 truncate">{c.crime_charges || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Holding */}
                        <div className="mb-4">
                          <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <BookOpen size={11} /> Holding
                          </h5>
                          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                            {c.holding || 'Not available'}
                          </p>
                        </div>

                        {/* Ratio Decidendi */}
                        <div className="mb-4">
                          <h5 className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mb-2">Ratio Decidendi</h5>
                          <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-orange-300 pl-4">
                            {c.ratio_decidendi || 'Not available'}
                          </p>
                        </div>

                        {/* Bottom Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {c.crime_charges && c.crime_charges !== 'N/A' && (
                            <span className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">{c.crime_charges}</span>
                          )}
                          {c.sentence_duration && c.sentence_duration !== 'N/A' && (
                            <span className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-100">{c.sentence_duration}</span>
                          )}
                          {c.coram && c.coram !== 'Unknown' && (
                            <span className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">Coram: {c.coram}</span>
                          )}
                        </div>

                        {/* Expand/Collapse Toggle */}
                        <button
                          onClick={() => toggleCard(idx)}
                          className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors border-t border-slate-100 mt-2"
                        >
                          {isExpanded ? 'Collapse Details' : 'Expand — Obiter Dicta, Dissent, Precedents'}
                          <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Expanded Section */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 space-y-4 border-t border-slate-100 mt-2">
                                {c.obiter_dicta && c.obiter_dicta !== 'Not found' && (
                                  <div>
                                    <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Obiter Dicta</h5>
                                    <p className="text-sm text-slate-500 leading-relaxed">{c.obiter_dicta}</p>
                                  </div>
                                )}
                                {c.dissenting_opinion && c.dissenting_opinion !== 'None' && (
                                  <div>
                                    <h5 className="text-[9px] font-bold text-purple-500 uppercase tracking-widest mb-2">Dissenting Opinion</h5>
                                    <p className="text-sm text-slate-500 leading-relaxed">{c.dissenting_opinion}</p>
                                  </div>
                                )}
                                {c.cited_precedents && c.cited_precedents.length > 0 && (
                                  <div>
                                    <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cited Precedents</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {c.cited_precedents.map((p, pidx) => (
                                        <span key={pidx} className="text-[10px] font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">{p}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
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

export default LiveWorkspace;
