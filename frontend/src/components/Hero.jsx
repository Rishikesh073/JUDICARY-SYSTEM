import React from 'react';
import { motion } from 'framer-motion';
import { FADE_IN } from '../utils/DesignTokens';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-orange-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          {...FADE_IN}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          India's first agentic legal research system
        </motion.div>

        <motion.h1 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif mb-6 leading-[1.1]"
        >
          Your autonomous <br />
          <span className="text-orange-500 italic">junior legal clerk</span>, <br />
          available 24/7
        </motion.h1>

        <motion.p 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Ask a complex legal question. Get a court-ready 2-page memo with verified precedents in under 2 minutes — not 14 hours.
        </motion.p>

        <motion.div 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button className="bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-900/30 transition-all hover:scale-105 active:scale-95">
            Start researching — it's free
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
            See how it works
          </button>
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          {...FADE_IN}
          transition={{ ...FADE_IN.transition, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-serif text-white">70%</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Research time saved</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-white/5">
            <span className="text-3xl font-serif text-white">90%</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Citation accuracy</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-white/5">
            <span className="text-3xl font-serif text-white">50+</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Cases per query</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-white/5">
            <span className="text-3xl font-serif text-white">&lt;2min</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Memo delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
