import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const skills = [
    { category: "Frontend", items: ["React", "Next.js","PHP Laravel", "Tailwind CSS", "TypeScript", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Firebase", "MongoDB", "PostgreSQL", "GraphQL","MyPHPAdmin"] },
    { category: "Tools", items: ["Git", "Docker", "Figma", "VS Code", "Vercel","ifastNet"] }
  ];

  return (
    <section id="about" className="py-20 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent to-brand-secondary rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-slate-900 rounded-2xl p-2 border border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80" 
                  alt="Workspace" 
                  className="rounded-xl w-full h-auto grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </motion.div>
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-brand-accent">About</span> Us
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We specialize in building scalable web applications with a focus on user experience and modern design principles. With over 2 years of experience, We've helped startups and established businesses establish a strong digital presence.
            </p>
            
            <div className="space-y-6">
              {skills.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-sm font-mono text-slate-500 mb-3 uppercase tracking-wider">
                    {group.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-sm hover:border-brand-accent hover:text-brand-accent transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;