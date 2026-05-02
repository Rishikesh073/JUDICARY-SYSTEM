import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 glass-card bg-black/40 border-white/10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-orange-600/20 p-2 rounded-lg border border-orange-500/30 group-hover:bg-orange-600/30 transition-all">
            <Shield className="text-orange-500" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-serif">LexAgent</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button className="hover:text-orange-400 flex items-center gap-1 transition-colors">
            Features <ChevronDown size={14} />
          </button>
          <a href="#how-it-works" className="hover:text-orange-400 transition-colors">How it works</a>
          <Link to="/explorer" className="hover:text-orange-400 transition-colors">Research</Link>
          <button className="hover:text-orange-400 flex items-center gap-1 transition-colors">
            More <ChevronDown size={14} />
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign in</Link>
          <Link to="/auth" className="bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-900/20">
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
