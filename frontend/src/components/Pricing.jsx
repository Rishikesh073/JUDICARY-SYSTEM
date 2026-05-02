import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <section className="py-24 px-6 bg-[#0A0A0A]" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-4 block">Pricing Plans</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Invest in your efficiency</h2>
          <p className="text-slate-500">Pick the plan that matches your practice scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Solo */}
          <div className="glass-card p-10 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-serif mb-2">Solo Advocate</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold text-white">₹999</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {['Unlimited research queries', '10 memo exports / mo', 'Standard support', 'Mobile access'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                  <Check size={16} className="text-orange-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full btn-secondary">Get Started</button>
          </div>

          {/* Firm */}
          <div className="glass-card p-10 flex flex-col border-orange-500/30 bg-orange-600/5 relative hover:scale-105 transition-transform">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
            <h3 className="text-xl font-serif mb-2">Law Firm</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold text-white">₹3,499</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {['Everything in Solo', 'Up to 5 team members', 'Unlimited memo exports', 'Team collaborations', 'Priority synthesis'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <Check size={16} className="text-orange-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full btn-primary">Start Firm Trial</button>
          </div>

          {/* Judiciary */}
          <div className="glass-card p-10 flex flex-col hover:border-white/20 transition-all">
            <h3 className="text-xl font-serif mb-2">Judiciary / Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {['On-premise deployment', 'Custom fine-tuning', 'Dedicated account manager', 'SLA guarantees', 'Full API access'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                  <Check size={16} className="text-orange-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full btn-secondary">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
