import React from 'react';
import { X, Check } from 'lucide-react';

const Comparison = () => {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-4 block">Why LexAgent</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">The old way vs. the right way</h2>
          <p className="text-slate-500">Manupatra, Westlaw, LexisNexis stop at search. LexAgent thinks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Old Way */}
          <div className="glass-card p-10 bg-black/40 border-red-900/10">
            <h3 className="text-2xl font-serif mb-8 text-slate-400">Manual Research</h3>
            <ul className="space-y-6">
              {[
                'Hours spent wrestling with Boolean logic',
                'Manual reading of 50+ IRs/AIRs',
                'Hand-writing summaries and memos',
                'Risk of missing over-ruled precedents',
                'No centralized firm-wide intelligence'
              ].map(item => (
                <li key={item} className="flex items-start gap-4 text-slate-500 text-sm">
                  <X className="text-red-900/50 mt-1 shrink-0" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* LexAgent Way */}
          <div className="glass-card p-10 bg-orange-600/5 border-orange-500/20 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-600/10 blur-3xl rounded-full" />
            <h3 className="text-2xl font-serif mb-8 text-white">LexAgent Autonomous</h3>
            <ul className="space-y-6">
              {[
                'Natural language queries (just ask)',
                'Instant cross-referencing of 1M+ cases',
                'Auto-generated court-ready memos',
                'Over-ruled precedents filtered out',
                'Collaborative firm-wide memory'
              ].map(item => (
                <li key={item} className="flex items-start gap-4 text-white text-sm">
                  <Check className="text-orange-500 mt-1 shrink-0" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
