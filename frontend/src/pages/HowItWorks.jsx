import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Search, MessageSquare, ShieldCheck, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

const StepCard = ({ icon: Icon, title, desc, details, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
      <div className="relative bg-[#0F0F12] border border-white/5 p-8 rounded-2xl h-full transition-all duration-300 group-hover:-translate-y-2 group-hover:border-orange-500/30">
        <div className="bg-orange-600/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform duration-300">
          <Icon size={28} />
        </div>
        <h3 className="text-xl font-serif mb-4 text-white">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
        
        <div className="pt-6 border-t border-white/5">
          <ul className="space-y-3">
            {details.map((detail, i) => (
              <li key={i} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <ShieldCheck size={12} className="text-orange-500/50" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Intent Parsing",
      desc: "Our NLP engine decomposes your natural language query into legal vectors, identifying specific Acts, Sections, and intent markers.",
      details: ["Entity Recognition", "Statute Mapping", "Contextual Weighting"]
    },
    {
      icon: Database,
      title: "2. Vector Retrieval",
      desc: "We scan 1M+ case tokens in ChromaDB to find the most semantically relevant precedents, bypassing the limitations of keyword search.",
      details: ["Cosine Similarity", "Dense Vector Search", "Precedent Ranking"]
    },
    {
      icon: Cpu,
      title: "3. Agentic Synthesis",
      desc: "A multi-step agent processes the retrieved text via Llama 3.2, cross-referencing facts and holdings to ensure zero-hallucination.",
      details: ["Reasoning Loops", "Fact Verification", "Holding Extraction"]
    },
    {
      icon: MessageSquare,
      title: "4. Memo Generation",
      desc: "LexAgent drafts a professional memorandum, citing specific case law and providing Cloudinary links for original document verification.",
      details: ["Auto-Drafting", "Citation Integrity", "PDF Serialization"]
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <Navbar />
        
        <main className="pt-32 pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-4 block"
              >
                The Architecture of Justice
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-serif mb-6"
              >
                How LexAgent Works
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-500 max-w-2xl mx-auto"
              >
                We combine state-of-the-art Large Language Models with local Vector Databases to provide a private, high-accuracy legal research assistant.
              </motion.p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
              {steps.map((step, i) => (
                <StepCard key={i} {...step} index={i} />
              ))}
            </div>

            {/* Bottom Callout */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-600/20 to-amber-900/10 border border-orange-500/20 rounded-3xl p-12 text-center"
            >
              <h2 className="text-3xl font-serif mb-4">Ready to fast-track your research?</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join the future of legal intelligence and save up to 70% of your manual research time.</p>
              <div className="flex justify-center gap-4">
                <Link to="/dashboard" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all">
                  Enter Dashboard
                </Link>
                <Link to="/" className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold border border-white/10 transition-all flex items-center gap-2">
                  <Home size={18} /> Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default HowItWorks;
