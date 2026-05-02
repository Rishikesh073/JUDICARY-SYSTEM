import React from 'react';
import { Users, MessageSquare, Share2, FolderOpen, Shield, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';

const TeamWorkspace = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="pt-32 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-serif mb-2">Team Workspace</h1>
              <p className="text-slate-500">Shared intelligence for law firms and judicial teams.</p>
            </div>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Users size={18} /> Invite Colleague
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar info */}
            <div className="space-y-6">
              <div className="bg-[#0F0F12] border border-white/5 p-6 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Active Members</h3>
                <div className="space-y-4">
                  {['Senior Partner', 'Legal Associate', 'Junior Clerk'].map((role, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-500 text-xs font-bold">
                        {role[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{role}</div>
                        <div className="text-[10px] text-slate-500">Active now</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-[#0F0F12] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-orange-600/10 p-6 rounded-full mb-6 text-orange-500">
                  <Lock size={48} />
                </div>
                <h2 className="text-2xl font-serif mb-4">Collaborative Vault Locked</h2>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">This workspace is protected by end-to-end encryption. Your firm's shared annotations and memos are only visible to authorized members.</p>
                <div className="flex gap-4">
                  <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-bold border border-white/10 transition-all">
                    Enable Collaboration
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: MessageSquare, title: "Shared Annotations", desc: "Add comments to live memos for your team to review." },
                  { icon: Share2, title: "Internal Library", desc: "A centralized repository for your firm's research history." }
                ].map((item, i) => (
                  <div key={i} className="bg-[#0F0F12] border border-white/5 p-6 rounded-2xl group hover:border-orange-500/30 transition-all">
                    <item.icon className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamWorkspace;
