import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FADE_IN } from '../utils/DesignTokens';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-orange-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          {...FADE_IN}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-600 text-xs font-semibold mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          India's first agentic legal research system
        </motion.div>

        <motion.h1 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif text-slate-900 mb-6 leading-[1.1]"
        >
          Your autonomous, <br />
          <span className="text-orange-600 italic">always-available junior legal clerk.</span>
        </motion.h1>

        <motion.p 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Ask a complex legal question. Get a court-ready 2-page memo with verified precedents in under 2 minutes — not 14 hours.
        </motion.p>

        <motion.div 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link to="/research" className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 text-center">
            Start researching — it's free
          </Link>
          <button 
            onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-sm transition-all text-center"
          >
            See how it works
          </button>
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-slate-200"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-serif text-slate-900">70%</span>
            <span className="text-xs uppercase tracking-widest text-slate-600 font-medium">Research time saved</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-slate-200">
            <span className="text-3xl font-serif text-slate-900">90%</span>
            <span className="text-xs uppercase tracking-widest text-slate-600 font-medium">Citation accuracy</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-slate-200">
            <span className="text-3xl font-serif text-slate-900">50+</span>
            <span className="text-xs uppercase tracking-widest text-slate-600 font-medium">Cases per query</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-slate-200">
            <span className="text-3xl font-serif text-slate-900">&lt;2min</span>
            <span className="text-xs uppercase tracking-widest text-slate-600 font-medium">Memo delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
