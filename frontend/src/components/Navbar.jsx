import React, { useState } from 'react';
import { Shield, ChevronDown, Sparkles, Database, FileText, Search, History, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  const features = [
    { name: 'Agentic Reasoning', desc: '5-step autonomous legal pipeline', icon: Sparkles },
    { name: 'Semantic Search', desc: 'Context-aware precedent retrieval', icon: Search },
    { name: 'Case Explorer', desc: 'Browse database by court and act', icon: Database },
    { name: 'Memo History', desc: 'Your saved research library', icon: History },
    { name: 'Team Workspace', desc: 'Collaborative firm environment', icon: Users },
    { name: 'Smart Citations', desc: 'Verified Cloudinary sources', icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 glass-card bg-black/40 border-white/10 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-orange-600/20 p-2 rounded-lg border border-orange-500/30 group-hover:bg-orange-600/30 transition-all">
            <Shield className="text-orange-500" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-serif">LexAgent</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <div className="relative">
            <button 
              onMouseEnter={() => setIsFeaturesOpen(true)}
              onMouseLeave={() => setIsFeaturesOpen(false)}
              className="hover:text-orange-400 flex items-center gap-1 transition-colors py-2"
            >
              Features <ChevronDown size={14} className={`transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isFeaturesOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  onMouseEnter={() => setIsFeaturesOpen(true)}
                  onMouseLeave={() => setIsFeaturesOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                >
                  <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-2xl w-[480px] grid grid-cols-2 gap-2">
                    {features.map((f) => (
                      <Link key={f.name} to="/explorer" className="p-3 rounded-xl hover:bg-white/5 transition-colors flex gap-3 group">
                        <div className="bg-orange-600/10 p-2 rounded-lg text-orange-500 group-hover:bg-orange-600/20 transition-colors">
                          <f.icon size={18} />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-[13px]">{f.name}</div>
                          <div className="text-slate-500 text-[11px] font-normal leading-tight">{f.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/how-it-works" className="hover:text-orange-400 transition-colors">How it works</Link>
          <Link to="/explorer" className="hover:text-orange-400 transition-colors">Research</Link>
          <button className="hover:text-orange-400 flex items-center gap-1 transition-colors">
            More <ChevronDown size={14} />
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign in</Link>
          <Link to="/dashboard" className="bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-900/20">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
