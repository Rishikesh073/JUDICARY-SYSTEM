import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Filter, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CaseExplorer = () => (
  <div className="bg-slate-50 min-h-screen pt-32 text-slate-900">
    <Navbar />
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-4xl font-serif">Case Explorer</h1>
      </div>
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search precedents by keyword, judge, or citation..." className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400" />
        </div>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm"><Filter size={16} /> Filters</button>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm"><Download size={16} /> Export List</button>
      </div>
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-[10px] uppercase tracking-widest text-slate-900 font-bold">
            <tr>
              <th className="px-6 py-4">Citation</th>
              <th className="px-6 py-4">Case Name</th>
              <th className="px-6 py-4">Court</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="even:bg-slate-50 odd:bg-white hover:bg-slate-100 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-mono text-orange-600/80">202{i} SC {120 + i}</td>
                <td className="px-6 py-4 font-serif">State of {['Maharashtra', 'Delhi', 'Karnataka'][i % 3]} v. {['John Doe', 'ABC Corp', 'Reliance'][i % 3]}</td>
                <td className="px-6 py-4">Supreme Court</td>
                <td className="px-6 py-4">202{i}</td>
                <td className="px-6 py-4"><span className="text-green-800 bg-green-100 px-2 py-0.5 rounded text-[10px] font-bold">Valid</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
);

export const MemoHistory = () => (
  <div className="bg-slate-50 min-h-screen pt-32 text-slate-900">
    <Navbar />
    <div className="max-w-4xl mx-auto px-6">
       <h1 className="text-4xl font-serif mb-8">Memo History</h1>
       <div className="space-y-4">
         {[1,2,3].map(i => (
           <div key={i} className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 flex justify-between items-center hover:border-orange-500/50 transition-all cursor-pointer group">
             <div>
               <h3 className="font-serif text-lg mb-1 text-slate-900 group-hover:text-orange-600 transition-colors">Research on PMLA Section 45 Bail</h3>
               <p className="text-xs text-slate-500">Generated on May {i+1}, 2026 • 12 Verified Citations</p>
             </div>
             <button className="text-slate-400 hover:text-slate-900"><Download size={18} /></button>
           </div>
         ))}
       </div>
    </div>
  </div>
);

export const Auth = () => (
  <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center px-6">
    <div className="max-w-md w-full glass-card p-10 bg-black/40">
      <div className="text-center mb-10">
        <div className="inline-flex bg-orange-600/20 p-3 rounded-2xl border border-orange-500/30 mb-4">
          <Shield className="text-orange-500" size={32} />
        </div>
        <h1 className="text-3xl font-serif mb-2">Welcome to LexAgent</h1>
        <p className="text-slate-500 text-sm">Enter your firm email to get started.</p>
      </div>
      <form className="space-y-6" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Firm Email</label>
          <input type="email" placeholder="name@yourfirm.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500/50 outline-none" />
        </div>
        <button className="w-full btn-primary py-4">Continue with SSO</button>
        <div className="text-center">
          <p className="text-xs text-slate-600">By continuing, you agree to our Terms and Privacy Policy.</p>
        </div>
      </form>
    </div>
  </div>
);
import { Shield } from 'lucide-react';
