import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, PenTool, Search, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const features = [
  {
    id: 'research',
    icon: <Search className="w-5 h-5" />,
    title: "Instant Case Synthesis",
    subtitle: "Stop drowning in 50+ tabs of AIRs.",
    description: "Type your query in natural language. LexAgent's Multi-Agent Engine scans 37,000+ Supreme Court precedents in seconds and synthesizes the exact principles you need.",
    visual: (
      <div className="h-full w-full flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-xl font-mono text-sm relative overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-1 bg-orange-500 absolute top-0 left-0" />
        <div className="flex items-center gap-2 mb-4 text-slate-400">
          <Search className="w-4 h-4" />
          <span>Searching 37,000+ Supreme Court precedents...</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 * i }}
              className="bg-slate-800/50 p-3 rounded border border-slate-700/50 flex flex-col gap-2"
            >
              <div className="w-2/3 h-2 bg-slate-600 rounded" />
              <div className="w-full h-2 bg-slate-700 rounded" />
              <div className="w-4/5 h-2 bg-slate-700 rounded" />
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-auto bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg text-orange-400 flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-xs leading-relaxed">Found 3 landmark Supreme Court judgments directly addressing the specific nuance of your query.</p>
        </motion.div>
      </div>
    )
  },
  {
    id: 'verify',
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Critic Agent Verification",
    subtitle: "Never cite bad law again.",
    description: "Every citation is instantly cross-checked. Our autonomous Critic Agent acts as a final quality gate, assigning an explicit Verdict and confidence score to protect your arguments.",
    visual: (
      <div className="h-full w-full flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-xl text-sm relative overflow-hidden justify-center gap-4">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800 p-4 rounded-lg border-l-4 border-emerald-500 flex justify-between items-center"
        >
          <div>
            <div className="font-semibold text-slate-200">Kesavananda Bharati v. State of Kerala</div>
            <div className="text-slate-500 text-xs">Critic Verdict: Approved • 98% Confidence</div>
          </div>
          <CheckCircle2 className="text-emerald-500 w-5 h-5" />
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-slate-800 p-4 rounded-lg border-l-4 border-red-500 flex justify-between items-center relative overflow-hidden"
        >
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.1, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-red-500 pointer-events-none"
          />
          <div>
            <div className="font-semibold text-slate-200 line-through decoration-red-500">ADM Jabalpur v. Shivakant Shukla</div>
            <div className="text-red-400 text-xs flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> Critic Verdict: Dissenting (Overruled)
            </div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 'draft',
    icon: <PenTool className="w-5 h-5" />,
    title: "Partner-Ready Memos & LexVault",
    subtitle: "From blank page to first draft.",
    description: "LexAgent generates a perfectly structured, foundational legal memo based on the Multi-Agent telemetry, which you can then securely store using our IPFS-backed LexVault.",
    visual: (
      <div className="h-full w-full bg-white rounded-xl shadow-2xl p-6 overflow-hidden relative border border-slate-200 flex flex-col">
        <div className="flex gap-2 mb-6 border-b border-slate-100 pb-4">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex-1 space-y-4"
        >
          <div className="text-center font-serif font-bold text-slate-800 text-lg border-b-2 border-slate-800 pb-2 mb-4 uppercase tracking-widest">Memorandum of Law</div>
          <div className="flex gap-4">
            <span className="text-slate-500 font-semibold text-xs uppercase w-12">To:</span>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }} className="h-4 bg-slate-100 rounded" />
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500 font-semibold text-xs uppercase w-12">From:</span>
            <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 0.5, delay: 0.2 }} className="h-4 bg-slate-100 rounded" />
          </div>
          <div className="flex gap-4 mb-6">
            <span className="text-slate-500 font-semibold text-xs uppercase w-12">Issue:</span>
            <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} transition={{ duration: 0.5, delay: 0.4 }} className="h-4 bg-slate-100 rounded" />
          </div>
          <div className="space-y-2 mt-4">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.6 }} className="h-2 bg-slate-200 rounded" />
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5, delay: 0.7 }} className="h-2 bg-slate-200 rounded" />
            <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 0.5, delay: 0.8 }} className="h-2 bg-slate-200 rounded" />
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
            className="absolute bottom-6 right-6 bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Save to LexVault (IPFS)
          </motion.div>
        </motion.div>
      </div>
    )
  }
];

const JuniorClerkSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-32 px-6 bg-slate-50 text-slate-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold mb-6 tracking-widest uppercase"
          >
            For Junior Associates & Clerks
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-slate-900"
          >
            Level up your litigation game. <br/>
            <span className="text-orange-600 italic">Work smarter, not harder.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            We know the pressure of the first few years. LexAgent acts as your tireless co-pilot, helping you build confidence, speed, and absolute accuracy from day one.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
          
          {/* Interactive Navigation (Left) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {features.map((feature, index) => {
              const isActive = activeFeature === index;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(index)}
                  className={`text-left p-6 rounded-2xl transition-all duration-300 relative group overflow-hidden ${isActive ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 hover:bg-slate-100 text-slate-500'}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeFeatureBg" 
                      className="absolute inset-0 bg-slate-900 rounded-2xl pointer-events-none"
                    />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center gap-3 ${isActive ? 'text-orange-400' : 'text-slate-700'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-200 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600'}`}>
                          {feature.icon}
                        </div>
                        <h3 className={`text-xl font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                      </div>
                      {isActive && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}><ArrowRight className="w-5 h-5 text-orange-400" /></motion.div>}
                    </div>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="font-medium text-slate-300 mt-4 mb-2">{feature.subtitle}</p>
                          <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Visuals (Right) */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px] bg-slate-100 rounded-2xl p-4 md:p-8 relative overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-200/50 z-0" />
            
            <div className="relative z-10 w-full h-full max-w-md mx-auto drop-shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-200"
                >
                  {features[activeFeature].visual}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-400/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 blur-3xl rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default JuniorClerkSection;
