import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Mail } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-brand-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-brand-highlight rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-slate-800/50 border border-slate-700 text-brand-accent text-sm font-mono mb-6">
            Available for freelance work
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            Building Digital <br />
            <span className="text-gradient">Experiences</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            We are a creative freelance developer crafting high-performance,
            aesthetic websites and applications for global clients.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="#projects" 
              className="px-8 py-4 bg-brand-accent text-slate-950 font-bold rounded-full hover:bg-cyan-300 transition-all neon-shadow flex items-center justify-center gap-2"
            >
              View Projects <ExternalLink size={18} />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 glass-panel text-white font-bold rounded-full hover:bg-slate-800 transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              Hire Me <Mail size={18} />
            </a>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-slate-500"
      >
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-1">
          <div className="w-1 h-5 bg-slate-400 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;