import React from 'react';
import { Shield, Globe, MessageSquare, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-20 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-orange-600" size={24} />
            <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">LexAgent</span>
          </div>
          <p className="text-slate-600 max-w-sm mb-8 leading-relaxed">
            Empowering legal practitioners with autonomous, verified, and agentic research. 
            Built to redefine the speed of justice.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Globe size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><MessageSquare size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Share2 size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-serif mb-6">Platform</h4>
          <ul className="space-y-4 text-sm text-slate-600">
            <li><a href="#" className="hover:text-orange-600 transition-colors">Case Explorer</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Memo History</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Team Workspace</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-serif mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-slate-600">
            <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-orange-600 transition-colors">Disclaimer</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        <p>© 2026 LexAgent AI. All rights reserved.</p>
        <p>Made for the Indian Judiciary</p>
      </div>
    </footer>
  );
};

export default Footer;
