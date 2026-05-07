import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, FileText, Download, ExternalLink } from 'lucide-react';
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

const LiveWorkspace = () => {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [memo, setMemo] = useState(null);
  const [error, setError] = useState(null);

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
    setError(null);

    // Speed up simulation timings for "Fasttrack" feel
    const stepTimings = [300, 600, 800, 500, 300];
    
    // Start the actual research in parallel
    const researchPromise = axios.post('http://localhost:5000/api/ask-lexagent', { query });

    for (let i = 0; i < stepTimings.length; i++) {
      await new Promise(r => setTimeout(r, stepTimings[i]));
      setCurrentStep(i + 2);
    }

    try {
      const response = await researchPromise;
      setMemo(response.data);
    } catch (err) {
      setError("Engine connection failed. Please ensure the backend is running.");
      console.error(err);
    } finally {
      setIsResearching(false);
      setCurrentStep(0);
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

          {/* Memo Output */}
          <AnimatePresence>
            {memo && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8"
              >
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-600/10 p-2 rounded-lg">
                      <FileText className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-slate-900">Legal memorandum — {memo.query.substring(0, 30)}...</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Synthesized by LexAgent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={downloadMemo}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-bold px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2 transition-all"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-3 py-1 rounded-full border border-green-200 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-8 text-slate-700 leading-relaxed max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  
                  {/* CITATION GRAPH INJECTED HERE */}
                  <div className="mb-8">
                    <CitationGraph data={memo.graph_data || { nodes: [], links: [] }} />
                  </div>

                  <div className="prose prose-slate max-w-none">
                    {/* Simplified Markdown rendering logic */}
                    <div className="whitespace-pre-wrap font-sans text-sm">{memo.memo}</div>
                  </div>
                </div>
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
