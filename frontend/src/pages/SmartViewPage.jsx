import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  ArrowLeft, Filter, ShieldCheck, Gavel, 
  AlertCircle, ChevronRight, Download, ExternalLink,
  Scale, FileText, Clock, Search, Users, AlertTriangle, BookOpen
} from 'lucide-react';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

const SmartViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cases = [], query = "" } = location.state || {};
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedCase, setExpandedCase] = useState(null);

  // Filter categories
  const filters = [
    { name: 'All', icon: <Scale size={14} /> },
    { name: 'High Confidence', icon: <ShieldCheck size={14} /> },
    { name: 'Convictions', icon: <Gavel size={14} /> },
    { name: 'Acquittals', icon: <AlertCircle size={14} /> },
    { name: 'Landmark', icon: <FileText size={14} /> }
  ];

  const filteredCases = useMemo(() => {
    switch (activeFilter) {
      case 'High Confidence':
        return cases.filter(c => (c.confidence_score || 0) >= 80);
      case 'Convictions':
        return cases.filter(c => c.holding?.toLowerCase().includes('convict') || c.holding?.toLowerCase().includes('dismissed'));
      case 'Acquittals':
        return cases.filter(c => c.holding?.toLowerCase().includes('acquitted') || c.holding?.toLowerCase().includes('allowed'));
      case 'Landmark':
        return cases.filter(c => c.special_case_flag?.toLowerCase().includes('yes'));
      default:
        return cases;
    }
  }, [cases, activeFilter]);

  if (!cases || cases.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6">
              <Search size={32} />
            </div>
            <h2 className="text-2xl font-serif text-slate-900 mb-4">No Research Data Found</h2>
            <p className="text-slate-500 mb-8">SmartView requires an active research session. Please start a new query to visualize your precedents.</p>
            <Link to="/research" className="block w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold transition-all">
              Start Research
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 pb-20">
        <Navbar />
        
        {/* Top Header & Filters */}
        <div className="bg-white border-b border-slate-200 pt-32 pb-8 px-6 lg:px-12 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-3xl font-serif text-slate-900">SmartView Explorer</h1>
                  <p className="text-slate-500 text-sm mt-1 truncate max-w-xl">Visual comparison for: <span className="font-medium text-orange-600 italic">"{query}"</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">{filteredCases.length} Results</span>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFilter(f.name)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border-2 ${
                    activeFilter === f.name 
                    ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/20' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-orange-200 hover:text-orange-600'
                  }`}
                >
                  {f.icon}
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Case Gallery */}
        <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <LayoutGroup>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredCases.map((caseItem, idx) => {
                  const isExpanded = expandedCase === caseItem.filename;
                  
                  return (
                    <motion.div
                      key={caseItem.filename}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className={`bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full ${isExpanded ? 'ring-2 ring-orange-500/20 shadow-orange-100 shadow-2xl' : 'hover:shadow-slate-200/50'}`}
                    >
                      {/* Card Header: Gauges */}
                      <div className="p-8 pb-4 flex justify-between items-start">
                        <div className="relative w-20 h-20">
                           <svg className="w-full h-full transform -rotate-90">
                             <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                             <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" 
                               strokeDasharray={2 * Math.PI * 34}
                               strokeDashoffset={2 * Math.PI * 34 * (1 - (caseItem.confidence_score || 0)/100)}
                               className="text-orange-500 transition-all duration-1000 ease-out" 
                             />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-sm font-black text-slate-900">{caseItem.confidence_score || 0}%</span>
                             <span className="text-[7px] font-bold uppercase text-slate-400">Match</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                            caseItem.holding?.toLowerCase().includes('dismissed') || caseItem.holding?.toLowerCase().includes('convict')
                            ? 'bg-red-50 text-red-600 border border-red-100'
                            : caseItem.holding?.toLowerCase().includes('acquitted') || caseItem.holding?.toLowerCase().includes('allowed')
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {caseItem.holding?.toLowerCase().includes('dismissed') ? 'Conviction' : 
                             caseItem.holding?.toLowerCase().includes('acquitted') ? 'Acquittal' : 'Judgment'}
                          </div>
                          {caseItem.special_case_flag?.toLowerCase().includes('yes') && (
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                              <AlertTriangle size={10} /> Landmark
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="px-8 pb-8 flex-1 flex flex-col">
                        <h3 className="text-xl font-serif text-slate-900 mb-6 line-clamp-3 group-hover:text-orange-600 transition-colors leading-snug">
                          {caseItem.filename.replace('.json', '').replace('.PDF', '').replace(/_/g, ' ')}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Clock size={14} /></div>
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Judgment Date</p>
                              <span className="text-xs text-slate-700 font-bold">{caseItem.date_of_judgment || 'Recent'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Users size={14} /></div>
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bench</p>
                              <span className="text-xs text-slate-700 font-bold truncate block max-w-[80px]">{caseItem.bench_strength || 'Supreme Court'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Scale size={14} /></div>
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Year</p>
                              <span className="text-xs text-slate-700 font-bold">{caseItem.year || '2025'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Gavel size={14} /></div>
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Charges</p>
                              <span className="text-xs text-slate-700 font-bold truncate block max-w-[80px]">{caseItem.crime_charges || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Section */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden space-y-6 pt-2 pb-6"
                            >
                              {caseItem.holding?.includes("Extraction failed") || caseItem.ratio_decidendi === "Analysis Unavailable" ? (
                                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex flex-col items-center text-center">
                                  <AlertTriangle size={32} className="text-amber-500 mb-3" />
                                  <h4 className="text-sm font-bold text-amber-900 mb-1">Detailed Extraction Unavailable</h4>
                                  <p className="text-xs text-amber-700 max-w-md mb-4">
                                    The AI Engine encountered complex formatting in this judgment. Detailed analysis like Ratio Decidendi and Obiter Dicta could not be structured reliably.
                                  </p>
                                  <div className="flex gap-2">
                                    <button 
                                      className="px-4 py-2 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-700 transition-colors"
                                      onClick={() => alert("Re-analysis request sent to backend...")}
                                    >
                                      Request Deep Re-analysis
                                    </button>
                                    <button 
                                      className="px-4 py-2 bg-white text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-100 transition-colors"
                                      onClick={() => window.open(`http://localhost:5001/view/${caseItem.filename}`, '_blank')}
                                    >
                                      View Raw PDF
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                      <BookOpen size={12} className="text-orange-500" /> AI Holding Summary
                                    </h4>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                                      "{caseItem.holding || 'No detailed holding available.'}"
                                    </p>
                                  </div>
  
                                  {caseItem.ratio_decidendi && (
                                    <div>
                                      <h4 className="text-[9px] font-bold text-orange-600 uppercase tracking-widest mb-1">Ratio Decidendi</h4>
                                      <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-orange-200 pl-4">
                                        {caseItem.ratio_decidendi}
                                      </p>
                                    </div>
                                  )}
  
                                  {caseItem.obiter_dicta && caseItem.obiter_dicta !== 'Not found' && (
                                    <div>
                                      <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Obiter Dicta</h4>
                                      <p className="text-xs text-slate-500 leading-relaxed">
                                        {caseItem.obiter_dicta}
                                      </p>
                                    </div>
                                  )}
  
                                  {caseItem.dissenting_opinion && caseItem.dissenting_opinion !== 'None' && (
                                    <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                                      <h4 className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-1">Dissenting Opinion</h4>
                                      <p className="text-xs text-purple-700 leading-relaxed">
                                        {caseItem.dissenting_opinion}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-auto pt-6 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                               {caseItem.cited_precedents?.slice(0, 3).map((_, i) => (
                                 <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 shadow-sm">
                                   P{i+1}
                                 </div>
                               ))}
                               {caseItem.cited_precedents?.length > 3 && (
                                 <div className="w-8 h-8 rounded-full bg-orange-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-orange-600 shadow-sm">
                                   +{caseItem.cited_precedents.length - 3}
                                 </div>
                               )}
                            </div>
                            <button 
                              onClick={() => setExpandedCase(isExpanded ? null : caseItem.filename)}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                isExpanded 
                                ? 'bg-slate-900 text-white' 
                                : 'bg-slate-50 hover:bg-orange-600 hover:text-white text-slate-500'
                              }`}
                            >
                               {isExpanded ? 'Close Analysis' : 'Detailed Analysis'}
                               <ChevronRight size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filteredCases.length === 0 && (
            <div className="py-20 text-center">
               <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
               <h3 className="text-lg font-serif text-slate-400">No cases match the selected filter</h3>
               <button 
                 onClick={() => setActiveFilter('All')}
                 className="text-orange-600 font-bold text-sm mt-2 hover:underline"
                >
                  Clear all filters
               </button>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default SmartViewPage;
