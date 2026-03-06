import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Smartphone, Server, Code } from 'lucide-react';

const Services = () => {
  const services = [
    { 
      icon: <Layout size={32} />, 
      title: "Web Development", 
      desc: "Custom websites built with modern frameworks like React and Next.js, optimized for speed and SEO." 
    },
    { 
      icon: <Smartphone size={32} />, 
      title: "Responsive Design", 
      desc: "Mobile-first approach ensuring your site looks perfect on every device, from phones to desktops." 
    },
    { 
      icon: <Server size={32} />, 
      title: "API Integration", 
      desc: "Seamless connection with third-party services, payment gateways, and custom backend solutions." 
    },
    { 
      icon: <Code size={32} />, 
      title: "Maintenance", 
      desc: "Ongoing support, security updates, and performance monitoring to keep your site running 24/7." 
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-brand-accent/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;