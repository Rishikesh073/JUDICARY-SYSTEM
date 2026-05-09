import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronRight, ArrowLeft, FileText, Database,
  AlertTriangle, X, Check, ExternalLink, Scale, BookOpen,
  Lightbulb, Loader, Shield, Gavel, Calendar, Download, Eye
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

const CaseExplorerPage = () => {
  const [query, setQuery] = useState('');
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedCourt, setSelectedCourt] = useState('All');
  const [selectedAct, setSelectedAct] = useState('All');
  const [yearRange, setYearRange] = useState([1950, 2025]);

  // Case detail modal
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const courts = ['All', 'Supreme Court of India', 'High Court'];
  const acts = ['All', 'IPC', 'PMLA', 'BNS', 'Constitution', 'CrPC'];

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/explorer', {
        query,
        filters: { court: selectedCourt, act: selectedAct, year_range: yearRange },
        page: currentPage,
        limit: 12
      });
      setCases(response.data.cases || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      console.error("Explorer error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCaseDetail = async (caseItem) => {
    setSelectedCase(caseItem);
    setCaseDetail(null);
    setIsDetailLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/case-detail', {
        filename: caseItem.filename
      });
      setCaseDetail(response.data);
    } catch (error) {
      console.error("Case detail error:", error);
      setCaseDetail({ error: "Could not load case details." });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedCase(null);
    setCaseDetail(null);
  };

  useEffect(() => {
    const t = setTimeout(() => { fetchCases(); }, 500);
    return () => clearTimeout(t);
  }, [query, selectedCourt, selectedAct, yearRange, currentPage]);

  const clearFilters = () => {
    setSelectedCourt('All');
    setSelectedAct('All');
    setYearRange([1950, 2025]);
    setQuery('');
  };

  const parseInsights = (raw) => {
    if (!raw) return {};
    const extract = (label) => {
      const match = raw.match(new RegExp(`${label}:\\s*(.+?)(?=\\n[A-Z ]+:|$)`, 's'));
      return match ? match[1].trim() : null;
    };
    return {
      holding: extract('HOLDING'),
      keyFacts: extract('KEY FACTS'),
      principle: extract('LEGAL PRINCIPLE'),
      significance: extract('SIGNIFICANCE'),
    };
  };

  const caseName = (filename) =>
    filename.replace(/\.(json|PDF|pdf)$/i, '').replace(/_/g, ' ');

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFDFD]">
        <Navbar hidden={!!selectedCase} />

        {/* ── Search Hero ── */}
        <div className="bg-white border-b border-slate-100 pt-36 pb-12 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">
                <Database size={12} /> 75-Year Judicial Repository
              </span>
              <h1 className="text-5xl font-serif text-slate-900 mb-4 tracking-tight">The Judicial Vault</h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
                Search by keyword, case name, crime type, or law. Powered by semantic AI across 26,688 precedents (1950–2025).
              </p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="flex items-center bg-white border-2 border-slate-200 rounded-[2rem] p-2 shadow-2xl shadow-slate-200/50 focus-within:border-orange-500/50 transition-all">
                <div className="pl-6 pr-4 text-slate-400"><Search size={22} /></div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. 'Murder 1985' or 'PMLA bail' or 'dowry harassment'"
                  className="flex-1 bg-transparent border-none py-5 text-base text-slate-900 focus:outline-none placeholder-slate-300 font-serif"
                />
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all ${isFilterOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <Filter size={15} /> Filter
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {(selectedAct !== 'All' || selectedCourt !== 'All' || yearRange[0] !== 1950 || yearRange[1] !== 2025) && (
                <button onClick={clearFilters} className="px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <X size={12} /> Reset Filters
                </button>
              )}
              {selectedAct !== 'All' && <span className="px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-700 uppercase tracking-widest">{selectedAct}</span>}
              {selectedCourt !== 'All' && <span className="px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-700 uppercase tracking-widest">{selectedCourt}</span>}
              {(yearRange[0] !== 1950 || yearRange[1] !== 2025) && <span className="px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-700 uppercase tracking-widest">{yearRange[0]} – {yearRange[1]}</span>}
            </div>
          </div>
        </div>

        {/* ── Filter Drawer ── */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border-b border-slate-100 overflow-hidden">
              <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Jurisdiction</h4>
                  <div className="space-y-2">
                    {courts.map(c => (
                      <button key={c} onClick={() => setSelectedCourt(c)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedCourt === c ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                        {c} {selectedCourt === c && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Statute / Act</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {acts.map(a => (
                      <button key={a} onClick={() => setSelectedAct(a)} className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedAct === a ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                        {a} {selectedAct === a && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Time Period</h4>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-3 px-1">
                    <span>{yearRange[0]}</span><span>{yearRange[1]}</span>
                  </div>
                  <input type="range" min="1950" max="2025" value={yearRange[1]}
                    onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
                    className="w-full accent-orange-600 mb-4"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => setYearRange([1950, 1980])} className="px-3 py-2 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 hover:bg-slate-50 uppercase">Pre-1980</button>
                    <button onClick={() => setYearRange([2010, 2025])} className="px-3 py-2 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 hover:bg-slate-50 uppercase">Modern</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 pb-24">
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-100">
            <p className="text-sm font-serif text-slate-700">
              Found <span className="font-bold text-orange-600">{totalCount.toLocaleString()}</span> indexed precedents
            </p>
            {isLoading && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 uppercase tracking-widest animate-pulse">
                <Loader size={12} className="animate-spin" /> Scanning vault...
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading && cases.length === 0 ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />)
            ) : cases.length > 0 ? (
              cases.map((caseItem, idx) => (
                <motion.div
                  key={caseItem.filename + idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => fetchCaseDetail(caseItem)}
                  className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col cursor-pointer hover:border-orange-200/60"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em]">{caseItem.act || 'IPC'}</span>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{caseItem.year || '—'}</div>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`http://localhost:5001/api/raw-pdfs/${caseItem.year}/${caseItem.filename}?download=true`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Download Original PDF"
                      >
                        <Download size={17} />
                      </a>
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <FileText size={19} />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif text-slate-900 mb-5 line-clamp-3 group-hover:text-orange-600 transition-colors leading-snug flex-1">
                    {caseName(caseItem.filename)}
                  </h3>
                  <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                      {caseItem.court || 'Supreme Court'}
                    </span>
                    <ChevronRight size={17} className="text-slate-200 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-white border border-slate-100 rounded-[3rem]">
                <AlertTriangle size={56} className="text-slate-100 mx-auto mb-5" />
                <h3 className="text-2xl font-serif text-slate-900 mb-2">No matching precedents found</h3>
                <p className="text-slate-400 text-sm mb-8">Try broader keywords or reset your filters.</p>
                <button onClick={clearFilters} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all">
                  Reset Search
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalCount > 12 && !isLoading && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm">
                <ArrowLeft size={22} />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, Math.ceil(totalCount / 12)))].map((_, i) => (
                  <button key={i+1} onClick={() => setCurrentPage(i+1)}
                    className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${currentPage === i+1 ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
                    {i+1}
                  </button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * 12 >= totalCount}
                className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm">
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </main>

        {/* ── Case Detail Modal (Centered Popup) ── */}
        <AnimatePresence>
          {selectedCase && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40"
              />

              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                  className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="px-10 pt-10 pb-6 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider">
                            <Scale size={11} /> {selectedCase.act || 'IPC'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                            <Calendar size={11} /> {selectedCase.year || '—'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                            <Gavel size={11} /> {selectedCase.court?.split(' ').slice(0, 2).join(' ') || 'Supreme Court'}
                          </span>
                        </div>
                        {/* Title */}
                        <h2 className="text-2xl font-serif text-slate-900 leading-tight">
                          {caseName(selectedCase.filename)}
                        </h2>
                      </div>
                      <button
                        onClick={closeModal}
                        className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto px-10 py-8">
                    {/* Primary Actions */}
                    {!isDetailLoading && (
                      <div className="flex gap-3 mb-8">
                        <a 
                          href={`http://localhost:5001/api/raw-pdfs/${selectedCase.year}/${selectedCase.filename}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
                        >
                          <Eye size={14} /> View Original PDF
                        </a>
                        <a 
                          href={`http://localhost:5001/api/raw-pdfs/${selectedCase.year}/${selectedCase.filename}?download=true`}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <Download size={14} /> Download Copy
                        </a>
                      </div>
                    )}

                    {isDetailLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-5">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
                          <div className="absolute inset-0 rounded-full border-4 border-orange-600 border-t-transparent animate-spin" />
                          <div className="absolute inset-3 rounded-full bg-orange-50 flex items-center justify-center">
                            <FileText size={14} className="text-orange-500" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-serif text-slate-700 mb-1">Analysing judgment…</p>
                          <p className="text-xs text-slate-400">LexAgent AI is reading the full case text and extracting insights</p>
                        </div>
                      </div>
                    ) : caseDetail?.error ? (
                      <div className="py-16 text-center">
                        <AlertTriangle size={48} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-serif">{caseDetail.error}</p>
                      </div>
                    ) : caseDetail ? (() => {
                      const insights = parseInsights(caseDetail.insights);
                      return (
                        <div className="space-y-6">


                          {/* Holding */}
                          {insights.holding && (
                            <div className="bg-slate-900 text-white rounded-2xl p-6">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                                  <Scale size={13} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Court Holding</span>
                              </div>
                              <p className="text-base font-serif leading-relaxed text-slate-100">
                                {insights.holding}
                              </p>
                            </div>
                          )}

                          {/* Key Facts */}
                          {insights.keyFacts && (
                            <div className="border border-slate-100 rounded-2xl p-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                  <BookOpen size={13} className="text-blue-600" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Key Facts</span>
                              </div>
                              <div className="space-y-2">
                                {insights.keyFacts.split('\n').filter(l => l.trim()).map((line, i) => (
                                  <div key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                                    <p className="text-sm text-slate-700 font-serif leading-relaxed">
                                      {line.replace(/^[-•*]\s*/, '')}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Two-col: Principle + Significance */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {insights.principle && (
                              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <Gavel size={13} className="text-white" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Legal Principle</span>
                                </div>
                                <p className="text-sm text-blue-900 font-serif leading-relaxed">
                                  {insights.principle}
                                </p>
                              </div>
                            )}
                            {insights.significance && (
                              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                                    <Lightbulb size={13} className="text-white" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Significance</span>
                                </div>
                                <p className="text-sm text-amber-900 font-serif leading-relaxed">
                                  {insights.significance}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Judgment excerpt */}
                          {caseDetail.content_preview && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                  <Shield size={13} className="text-slate-500" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Judgment Excerpt</span>
                              </div>
                              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 max-h-48 overflow-y-auto">
                                <p className="text-xs text-slate-500 font-mono leading-relaxed whitespace-pre-wrap">
                                  {caseDetail.content_preview}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })() : null}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default CaseExplorerPage;
