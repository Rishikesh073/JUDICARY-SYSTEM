import React, { useState } from 'react';
import { Shield, ChevronDown, Sparkles, Database, FileText, Search, History, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen((s) => !s)}
            aria-expanded={isMobileOpen}
            aria-label="Open menu"
            className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Links (desktop) */}
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

      {/* Mobile menu panel */}
      <div className="md:hidden">
        {isMobileOpen && (
          <div className="mt-3 mx-4 bg-white/95 border border-slate-200 rounded-2xl shadow-md p-4">
            <div className="flex flex-col gap-3">
              <Link to="/how-it-works" className="py-2 px-3 rounded-md hover:bg-slate-50">How it works</Link>
              <Link to="/explorer" className="py-2 px-3 rounded-md hover:bg-slate-50">Research</Link>
              <Link to="/vault" className="py-2 px-3 rounded-md hover:bg-slate-50 font-semibold text-orange-600">VAULT</Link>
              <Link to="/dashboard" className="py-2 px-3 rounded-md hover:bg-slate-50">Sign in</Link>
              <Link to="/dashboard" className="py-2 px-3 rounded-md bg-orange-600 text-white text-center rounded-lg">Get started free</Link>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <div className="text-sm font-semibold text-slate-800 mb-2">Features</div>
                <div className="grid grid-cols-1 gap-2">
                  {features.map((f) => (
                    <Link key={f.name} to="/explorer" className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50">
                      <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                        <f.icon size={16} />
                      </div>
                      <div>
                        <div className="text-slate-900 font-medium text-sm">{f.name}</div>
                        <div className="text-slate-500 text-xs">{f.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
