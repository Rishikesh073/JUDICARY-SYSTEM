import React from 'react';
import { Search, Brain, FileText, Star, ShieldCheck, History, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: <Search className="text-orange-500" />,
    title: 'Semantic research engine',
    description: 'Understands legal intent contextually. No boolean operators needed.',
    badge: 'Core'
  },
  {
    icon: <BarChart3 className="text-orange-500" />,
    title: 'Case explorer',
    description: 'Browse the full database by court, year, and act. Filter and explore 50+ years.',
    badge: 'New'
  },
  {
    icon: <History className="text-orange-500" />,
    title: 'Memo history',
    description: 'Every research memo saved to your personal library. Revisit, annotate, and share anytime.',
    badge: 'New'
  },
  {
    icon: <Users className="text-orange-500" />,
    title: 'Team workspace',
    description: 'Share memos across your firm. Add annotations, comments, and collaborate on case strategy.',
    badge: 'New'
  },
  {
    icon: <Star className="text-orange-500" />,
    title: 'Research dashboard',
    description: 'Query analytics, most-cited cases, and trending legal topics across the judiciary.',
    badge: 'New'
  },
  {
    icon: <ShieldCheck className="text-orange-500" />,
    title: 'Zero-hallucination engine',
    description: 'Strict citation grounding — the LLM cannot output a case without a verified link.',
    badge: 'Core'
  }
];

const FeatureGrid = () => {
  return (
    <section className="py-24 px-6 bg-black" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-4 block">Platform Features</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Everything a legal practitioner needs</h2>
          <p className="text-slate-500">Built around how judges and advocates actually research.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div 
              key={feature.title}
              whileHover={{ y: -5 }}
              className="glass-card p-8 bg-[#111111] border-white/5 hover:border-orange-500/20 transition-all group"
            >
              <div className="mb-6 flex justify-between items-start">
                <div className="bg-orange-600/10 p-3 rounded-xl border border-orange-500/10 group-hover:bg-orange-600/20 transition-all">
                  {feature.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                  feature.badge === 'Core' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-xl font-serif mb-3 text-white">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
