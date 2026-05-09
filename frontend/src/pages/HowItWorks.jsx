import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, UploadCloud, Scissors, Database, 
  MessageSquare, BrainCircuit, Search, FileCheck, 
  ArrowRight, ShieldCheck, ArrowDown, Bot, Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

const FlowStep = ({ icon: Icon, title, desc, delay, active }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }} 
    transition={{ delay }}
    className="relative flex flex-col items-center text-center w-full md:w-56 shrink-0 group"
  >
    <div className={`w-20 h-20 bg-white border rounded-2xl shadow-sm flex items-center justify-center mb-6 relative z-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md ${active ? 'border-orange-500 text-orange-600 ring-4 ring-orange-50' : 'border-slate-200 text-slate-600'}`}>
      <Icon size={32} />
      {active && (
        <div className="absolute -inset-1 bg-orange-500/20 rounded-2xl blur-md -z-10 animate-pulse" />
      )}
    </div>
    <h4 className="font-bold text-slate-900 mb-2 text-lg">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed px-2">{desc}</p>
  </motion.div>
);

const FlowConnector = () => (
  <div className="hidden lg:flex flex-1 items-center justify-center -mt-16 px-4 relative z-0 min-w-[60px]">
    <div className="w-full h-[2px] bg-slate-200 relative overflow-hidden rounded-full">
      <motion.div 
        animate={{ x: ["-100%", "300%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-orange-400 to-transparent" 
      />
    </div>
    <ArrowRight className="absolute text-slate-300 right-2 bg-slate-50/80 rounded-full" size={20} />
  </div>
);

const MobileConnector = () => (
  <div className="flex lg:hidden justify-center py-6">
    <ArrowDown className="text-slate-300" size={24} />
  </div>
);

const AgentSwarm = () => {
  const [activeAgent, setActiveAgent] = React.useState(null);

  const agents = {
    researcher: {
      id: 'researcher',
      name: 'Researcher',
      icon: Search,
      desc: 'Retrieves exact legal precedents',
      pos: { top: '30%', left: '20%' },
      colors: {
        bg: 'bg-blue-50', text: 'text-blue-600', 
        border: 'border-blue-400', ring: 'ring-blue-50'
      },
      longDesc: 'Autonomously constructs search queries, interfaces with ChromaDB to retrieve semantically relevant case laws, and extracts pertinent facts.'
    },
    critic: {
      id: 'critic',
      name: 'Critic',
      icon: ShieldCheck,
      desc: 'Challenges & verifies facts',
      pos: { top: '75%', left: '50%' },
      colors: {
        bg: 'bg-red-50', text: 'text-red-600', 
        border: 'border-red-400', ring: 'ring-red-50'
      },
      longDesc: 'Acts as an adversarial verifier. It challenges the Researcher\'s findings, checks for hallucinations, and ensures statutes are cited correctly.'
    },
    summarizer: {
      id: 'summarizer',
      name: 'Summarizer',
      icon: FileText,
      desc: 'Drafts hallucination-free memo',
      pos: { top: '30%', left: '80%' },
      colors: {
        bg: 'bg-green-50', text: 'text-green-600', 
        border: 'border-green-400', ring: 'ring-green-50'
      },
      longDesc: 'Synthesizes the verified facts and arguments into a cohesive, professional legal memorandum with proper markdown formatting.'
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm mb-24 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-orange-500 to-slate-200 opacity-50" />
      <div className="mb-12 text-center lg:text-left">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">3. The Multi-Agent Swarm</h2>
        <p className="text-slate-500 max-w-2xl">Witness the core engine. Hover over an agent to see its exact role in the reasoning loop.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Interactive Canvas */}
        <div className="relative h-[450px] w-full lg:w-3/5 flex-shrink-0 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

          {/* Central Hub */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-white border-2 border-orange-200 rounded-full flex flex-col items-center justify-center z-20 shadow-[0_0_40px_-5px_rgba(249,115,22,0.3)]"
          >
            <Database size={32} className="text-orange-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Context Hub</span>
          </motion.div>

          {/* Connecting Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path 
              d="M 20 30 C 35 40, 40 45, 50 50" 
              stroke="url(#gradient-blue)" strokeWidth={activeAgent === 'researcher' ? "0.8" : "0.4"} strokeDasharray="1,1.5" fill="none"
              animate={{ strokeDashoffset: activeAgent === 'researcher' ? [0, -20] : [0, -10] }} transition={{ repeat: Infinity, duration: activeAgent === 'researcher' ? 1.5 : 3, ease: "linear" }}
              className="transition-all duration-300"
            />
            <motion.path 
              d="M 50 75 C 50 65, 50 60, 50 50" 
              stroke="url(#gradient-red)" strokeWidth={activeAgent === 'critic' ? "0.8" : "0.4"} strokeDasharray="1,1.5" fill="none"
              animate={{ strokeDashoffset: activeAgent === 'critic' ? [-20, 0] : [-10, 0] }} transition={{ repeat: Infinity, duration: activeAgent === 'critic' ? 1.5 : 3, ease: "linear" }}
              className="transition-all duration-300"
            />
            <motion.path 
              d="M 80 30 C 65 40, 60 45, 50 50" 
              stroke="url(#gradient-green)" strokeWidth={activeAgent === 'summarizer' ? "0.8" : "0.4"} strokeDasharray="1,1.5" fill="none"
              animate={{ strokeDashoffset: activeAgent === 'summarizer' ? [0, -20] : [0, -10] }} transition={{ repeat: Infinity, duration: activeAgent === 'summarizer' ? 1.5 : 3, ease: "linear" }}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="gradient-blue"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
              <linearGradient id="gradient-red"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
              <linearGradient id="gradient-green"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
            </defs>
          </svg>

          {/* Agents */}
          {Object.values(agents).map((agent, i) => (
            <div 
              key={agent.id}
              className="absolute w-36 h-32 -translate-x-1/2 -translate-y-1/2 z-30"
              style={{ top: agent.pos.top, left: agent.pos.left }}
              onMouseEnter={() => setActiveAgent(agent.id)}
              onMouseLeave={() => setActiveAgent(null)}
              onTouchStart={() => setActiveAgent(agent.id)}
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4 + (i * 0.5), ease: "easeInOut", delay: i * 0.2 }}
                className={`w-full h-full bg-white border rounded-xl p-3 shadow-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  activeAgent === agent.id ? `scale-105 ${agent.colors.border} ring-4 ${agent.colors.ring}` : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-12 h-12 ${agent.colors.bg} ${agent.colors.text} rounded-full flex items-center justify-center mb-2 transition-transform duration-300 ${activeAgent === agent.id ? 'scale-110' : ''}`}>
                  <agent.icon size={20} />
                </div>
                <span className="text-sm font-bold text-slate-800">{agent.name}</span>
                <span className="text-[10px] text-slate-500 text-center mt-1 leading-tight">{agent.desc}</span>
              </motion.div>
            </div>
          ))}

        </div>

        {/* Info Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8 md:p-10 flex flex-col justify-center min-h-[250px] shadow-sm relative overflow-hidden">
          {activeAgent ? (
            <motion.div
              key={activeAgent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full justify-center relative z-10"
            >
              <div className={`w-14 h-14 ${agents[activeAgent].colors.bg} ${agents[activeAgent].colors.text} rounded-full flex items-center justify-center mb-6`}>
                {React.createElement(agents[activeAgent].icon, { size: 28 })}
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">{agents[activeAgent].name} Agent</h3>
              <p className="text-slate-600 leading-relaxed text-lg">{agents[activeAgent].longDesc}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full justify-center items-center text-center text-slate-400 relative z-10"
            >
              <Bot size={48} className="mb-6 opacity-20" />
              <p className="text-lg max-w-xs">Hover over any agent in the swarm to view its specialized role and responsibilities.</p>
            </motion.div>
          )}

          {/* Decorative background for info panel */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50" />
        </div>

      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-orange-200 font-sans">
        <Navbar />
        
        {/* Subtle Light Background Ambient */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-100/50 blur-[100px] rounded-full pointer-events-none -z-10" />

        <main className="pt-32 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            
            {/* HERO */}
            <div className="text-center mb-24 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-orange-600 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                  <ShieldCheck size={14} /> Transparent Architecture
                </span>
                
                <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif font-bold leading-[1.1] tracking-tight text-slate-900 mb-6">
                  How LexAgent processes data and <span className="text-orange-600">synthesizes answers.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Understand the precise journey of a legal document—from raw PDF ingestion to semantic search and final AI-generated memorandum.
                </p>
              </motion.div>
            </div>

            {/* PIPELINE 1: Data Ingestion (PDF Extraction) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm mb-16 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-orange-400 to-slate-200 opacity-50" />
              
              <div className="mb-12 text-center lg:text-left">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">1. Data Ingestion Pipeline</h2>
                <p className="text-slate-500 max-w-2xl">How raw PDF case files are extracted, cleaned, and transformed into a searchable vector database.</p>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-stretch">
                <FlowStep 
                  icon={FileText} 
                  title="Source PDF" 
                  desc="Raw court judgments and legal documents are selected for upload into the system vault."
                  delay={0.1}
                />
                <MobileConnector />
                <FlowConnector />
                
                <FlowStep 
                  icon={UploadCloud} 
                  title="Cloud OCR" 
                  desc="Documents are uploaded to Cloudinary, securely processed, and raw text is extracted via OCR."
                  delay={0.2}
                />
                <MobileConnector />
                <FlowConnector />
                
                <FlowStep 
                  icon={Scissors} 
                  title="Semantic Chunking" 
                  desc="Text is split into logical, context-aware chunks (e.g., facts vs. rulings) to preserve meaning."
                  delay={0.3}
                />
                <MobileConnector />
                <FlowConnector />
                
                <FlowStep 
                  icon={Database} 
                  title="Vector Storage" 
                  active={true}
                  desc="Chunks are converted to dense embeddings and stored in ChromaDB for high-speed similarity search."
                  delay={0.4}
                />
              </div>
            </motion.div>

            {/* PIPELINE 2: Query Resolution */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm mb-24 relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-orange-500 to-slate-200 opacity-50" />

              <div className="mb-12 text-center lg:text-left">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">2. Query Resolution Workflow</h2>
                <p className="text-slate-500 max-w-2xl">What happens under the hood when a user asks a complex legal question in the Live Workspace.</p>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-stretch">
                <FlowStep 
                  icon={MessageSquare} 
                  title="User Query" 
                  desc="The user enters a natural language legal question regarding specific statutes or precedents."
                  delay={0.1}
                />
                <MobileConnector />
                <FlowConnector />
                
                <FlowStep 
                  icon={Search} 
                  title="Intent & Retrieval" 
                  desc="The query is vectorized. ChromaDB retrieves the top most semantically similar case chunks."
                  delay={0.2}
                />
                <MobileConnector />
                <FlowConnector />
                
                <FlowStep 
                  icon={BrainCircuit} 
                  title="Agentic Reasoning" 
                  active={true}
                  desc="Llama 3.2 Researcher agents cross-reference facts, while Critic agents verify for hallucinations."
                  delay={0.3}
                />
                <MobileConnector />
                <FlowConnector />
                
                <FlowStep 
                  icon={FileCheck} 
                  title="Final Memo" 
                  desc="The system synthesizes a cited, professional markdown memorandum with direct links to sources."
                  delay={0.4}
                />
              </div>
            </motion.div>

            {/* AGENT SWARM VISUALIZATION */}
            <AgentSwarm />

            {/* ACTION FOOTER */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-orange-50 border border-orange-100 rounded-3xl p-12 text-center max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-serif mb-4 text-slate-900">Ready to see it in action?</h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">Experience the multi-agent reasoning engine live in the dashboard.</p>
              <div className="flex justify-center gap-4">
                <Link to="/dashboard" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-2">
                  Launch Workspace <ArrowRight size={18} />
                </Link>
                <Link to="/" className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold border border-slate-200 transition-all flex items-center gap-2 shadow-sm">
                  <Home size={18} /> Back to Home
                </Link>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </PageTransition>
  );
}
