import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock, Unlock } from 'lucide-react';

const Navbar = ({ isAdmin, onAdminToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/image/NW-Logo.png');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/image/NW-Logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const isNearWhite = r > 220 && g > 220 && b > 220;
        const isGrayish = Math.abs(r - g) < 18 && Math.abs(g - b) < 18;
        if (isNearWhite || (isGrayish && r > 205)) data[i + 3] = 0;
      }
      ctx.putImageData(image, 0, 0);
      setLogoSrc(canvas.toDataURL('image/png'));
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Services', href: '#services' },
    { name: isAdmin ? 'Invoices' : 'Client Portal', href: '#invoices' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-3 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold font-mono tracking-tighter flex items-center gap-2">
          <img
            src={logoSrc}
            alt="NextWave logo"
            className="w-28 h-28 object-contain bg-transparent"
          />
          <span className="text-brand-accent">&lt;</span>
          NextWave
          <span className="text-brand-highlight">/&gt;</span>
        </a>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-300 hover:text-brand-accent transition-colors uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onAdminToggle}
            className={`p-2 rounded-full transition-all ${isAdmin ? 'bg-brand-highlight text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            title="Toggle Admin Mode"
          >
            {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={onAdminToggle}
            className={`p-2 rounded-full transition-all ${isAdmin ? 'bg-brand-highlight text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-200">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-slate-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-brand-accent"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
