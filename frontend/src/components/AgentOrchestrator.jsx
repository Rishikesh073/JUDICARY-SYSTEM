import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, Shield, Brain, FileText, Zap, Activity } from 'lucide-react';

const AGENTS = [
  { id: 'intent', label: 'Intent Agent', icon: Search },
  { id: 'researcher', label: 'Research Agent', icon: Zap },
  { id: 'analysis', label: 'Analysis Agent', icon: Brain },
  { id: 'validation', label: 'Validation Agent', icon: Shield },
  { id: 'memorandum', label: 'Memorandum Agent', icon: FileText },

];

const AgentNode = ({ agent, status, isLast }) => {
  const isRunning = status === 'running';
  const isComplete = status === 'complete';
  const isIdle = status === 'idle';

  return (
    <div className="flex items-center group shrink-0">
      <div className="flex flex-col items-center gap-3 relative">
        <motion.div
          animate={isRunning ? { 
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 25px rgba(59, 130, 246, 0.5)", "0 0 0px rgba(59, 130, 246, 0)"]
          } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
            isRunning ? 'bg-blue-50 border-blue-400 text-blue-600' :
            isComplete ? 'bg-emerald-50 border-emerald-400 text-emerald-600' :
            'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          {isComplete ? <CheckCircle2 size={20} /> : <agent.icon size={20} />}
          
          {isRunning && (
             <motion.div 
               layoutId={`pulse-${agent.id}`}
               className="absolute inset-0 rounded-xl bg-blue-500/20"
               animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
               transition={{ repeat: Infinity, duration: 2 }}
             />
          )}
        </motion.div>
        
        <div className="flex flex-col items-center">
            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 whitespace-nowrap ${
            isRunning ? 'text-blue-600' : isComplete ? 'text-emerald-600' : 'text-slate-500'
            }`}>
            {agent.label}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5 whitespace-nowrap">
                {status}
            </span>
        </div>
      </div>

      {!isLast && (
        <div className="w-8 md:w-12 lg:w-16 h-[2px] bg-slate-200 mx-2 mt-[-24px] relative overflow-hidden shrink-0">
          {(isRunning || isComplete) && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: isComplete ? '0%' : '0%' }}
              className={`absolute inset-0 ${isComplete ? 'bg-emerald-400' : 'bg-blue-400'}`}
              transition={{ duration: 0.8 }}
            />
          )}
          {isRunning && (
             <motion.div 
               animate={{ x: ['-100%', '200%'] }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
             />
          )}
        </div>
      )}
    </div>
  );
};

export const AgentOrchestrator = ({ statuses, telemetry }) => {
  return (
    <div className="mt-12 mb-16">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            <h4 className="text-xs uppercase tracking-[0.2em] font-black text-slate-400">Real-Time Agent Telemetry</h4>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase">Orchestration Active</span>
            </div>
         </div>
      </div>

      <div className="flex justify-start md:justify-center items-center mb-16 overflow-x-auto pb-6 pt-2 w-full no-scrollbar">
        {AGENTS.map((agent, idx) => (
          <AgentNode 
            key={agent.id} 
            agent={agent} 
            status={statuses[agent.id]} 
            isLast={idx === AGENTS.length - 1} 
          />
        ))}
      </div>

      <div className="bg-slate-900/5 border border-slate-200/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="bg-slate-900/10 px-4 py-2 border-b border-slate-200/50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Activity Stream</span>
            <span className="text-xs font-mono text-slate-400">v2.0.4-agentic</span>
        </div>
        <div className="p-4 max-h-[160px] overflow-y-auto font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
          <AnimatePresence initial={false}>
            {telemetry.length === 0 ? (
              <div className="text-slate-400 italic">Awaiting query initialization...</div>
            ) : (
              telemetry.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 group"
                >
                  <span className="text-slate-400 shrink-0">[{event.timestamp}]</span>
                  <span className="text-blue-600 font-bold shrink-0 uppercase tracking-tighter w-20">
                    {event.agent}:
                  </span>
                  <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                    {event.message}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
