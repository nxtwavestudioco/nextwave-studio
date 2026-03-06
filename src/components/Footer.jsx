import React from 'react';
import { Github, Mail } from 'lucide-react';

const Footer = ({ isAdmin, setShowSocialSettings, socialLinks }) => {
  return (
    <footer className="py-12 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} NextWave Studio. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            {socialLinks?.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-accent transition-colors" title="GitHub">
                <Github size={20} />
              </a>
            )}
            {socialLinks?.email && (
              <a href={`mailto:${socialLinks.email}`} className="text-slate-400 hover:text-brand-accent transition-colors" title="Email">
                <Mail size={20} />
              </a>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowSocialSettings(true)}
                className="text-slate-400 hover:text-brand-accent transition-colors text-xs px-2 py-1 border border-slate-700 rounded"
              >
                Edit Links
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;