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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 rounded-2xl relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-orange-600/20 p-2 rounded-lg border border-orange-500/30 group-hover:bg-orange-600/30 transition-all">
            <Shield className="text-orange-500" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">LexAgent</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
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
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xl w-[480px] grid grid-cols-2 gap-2">
                    {features.map((f) => (
                      <Link key={f.name} to="/explorer" className="p-3 rounded-xl hover:bg-slate-50 transition-colors flex gap-3 group">
                        <div className="bg-orange-50 p-2 rounded-lg text-orange-600 group-hover:bg-orange-100 transition-colors">
                          <f.icon size={18} />
                        </div>
                        <div>
                          <div className="text-slate-900 font-semibold text-[13px]">{f.name}</div>
                          <div className="text-slate-500 text-[11px] font-normal leading-tight">{f.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/how-it-works" className="hover:text-orange-600 transition-colors">How it works</Link>
          <Link to="/explorer" className="hover:text-orange-600 transition-colors">Research</Link>
          <Link to="/vault" className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-100 font-bold tracking-wide transition-colors">
            <Shield size={14} /> VAULT
          </Link>
          <button className="hover:text-orange-600 flex items-center gap-1 transition-colors">
            More <ChevronDown size={14} />
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
          <Link to="/dashboard" className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
