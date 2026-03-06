import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const FALLBACK_SCREENSHOT = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';

const normalizeProject = (project) => {
  const screenshots = Array.isArray(project?.screenshots) ? project.screenshots.filter(Boolean) : [];
  return {
    ...project,
    screenshots,
    tech: Array.isArray(project?.tech) ? project.tech : []
  };
};

const Projects = ({ isAdmin }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [tempScreenshots, setTempScreenshots] = useState({});
  const [autoPlay, setAutoPlay] = useState(false);

  // slideshow effect
  React.useEffect(() => {
    let interval;
    if (autoPlay && selectedProject && selectedProject.screenshots?.length > 1) {
      interval = setInterval(() => {
        setGalleryIndex(idx => (idx + 1) % selectedProject.screenshots.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, selectedProject]);


  const [projects, setProjects] = useState([]);

  const persistIfLocalSample = async (project, apiService) => {
    if (!project?._localSample) return project;
    const created = await apiService.createProject({
      ...project,
      _localSample: false
    });
    const normalized = normalizeProject({ ...created, _localSample: false });
    setProjects((prev) => prev.map((p) => (p.id === project.id ? normalized : p)));
    setSelectedProject(normalized);
    return normalized;
  };

  // sample fallback data if backend returns empty
  const sampleProjects = [
    {
      id: 1,
      title: "Magellan TCI Project",
      category: "Web Development",
      screenshots: [
        "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80"
      ],
      description: "A high-performance platform built with Next.js. Features real-time Car Loan Application as well as the required documents prior approval.",
      tech: ["Next.js", "REST API","Tailwind","MyPHPAdmin","ifastnet server"],
      link: "#"
    },
    {
      id: 2,
      title: "GSDC Dispatch App",
      category: "Power Application",
      screenshots: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Comprehensive dispatch analytics dashboard allowing the users to track the order as well as the truck used per delivery along with KPI Charts for review.",
      tech: ["Microsoft Application","SQL 2019","Azure Map","Rest API"],
      link: "#"
    },
    {
      id: 3,
      title: "TCI OFW App",
      category: "Web Development",
      screenshots: [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
      ],
      description: "A social platform for travelers to share itineraries and photos. Includes map integration, offline mode, and AI-powered recommendations.",
      tech: ["PHP Laravel","REST API","MyPHPAdmin","ifastnet server"],
      link: "#"
    },
  ];

  // load projects from backend on mount
  React.useEffect(() => {
    import('../services/apiService').then(({ apiService }) => {
      apiService.getProjects().then(data => {
        const existing = Array.isArray(data) ? data : [];
        const existingTitles = new Set(existing.map((p) => String(p.title || '').trim().toLowerCase()));
        const missingSamples = sampleProjects.filter(
          (sp) => !existingTitles.has(String(sp.title || '').trim().toLowerCase())
        );

        if (missingSamples.length === 0) {
          setProjects(existing.map((p) => normalizeProject({ ...p, _localSample: false })));
          return;
        }

        Promise.all(
          missingSamples.map((sp) => {
            const { id, ...payload } = sp; // let backend generate a unique id
            return apiService.createProject(payload);
          })
        ).then((created) => {
          const merged = [...existing, ...created];
          setProjects(merged.map((p) => normalizeProject({ ...p, _localSample: false })));
        }).catch((seedErr) => {
          console.error('failed to seed missing projects', seedErr);
          const fallback = existing.length > 0 ? existing : sampleProjects;
          setProjects(fallback.map((p) => normalizeProject({ ...p, _localSample: existing.length === 0 })));
        });
      }).catch(err => {
        console.error('failed to fetch projects', err);
        setProjects(sampleProjects.map((p) => normalizeProject({ ...p, _localSample: true })));
      });
    });
  }, []);

  return (
    <section id="projects" className="py-20 bg-slate-950 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-brand-secondary">Projects</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A selection of my recent work, ranging from web applications to brand identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              onClick={() => { setGalleryIndex(0); setSelectedProject(project); }}
              className="group cursor-pointer relative rounded-2xl overflow-hidden glass-panel border border-slate-800"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={project.screenshots?.[0] || FALLBACK_SCREENSHOT}
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-80"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <span className="text-brand-accent text-sm font-mono mb-2 block">{project.category}</span>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-secondary transition-colors">
                  {project.title}
                </h3>
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                  {project.tech.map(t => (
                    <span 
                      key={t} 
                      className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showPresentation && selectedProject && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowPresentation(false); setAutoPlay(false); }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-5xl"
            >
              <button
                onClick={() => { setShowPresentation(false); setAutoPlay(false); }}
                className="absolute -top-4 -right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white z-20"
              >
                <X size={20} />
              </button>
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
                <img
                  src={selectedProject.screenshots?.[galleryIndex] || FALLBACK_SCREENSHOT}
                  alt={`${selectedProject.title} presentation`}
                  className="w-full h-[65vh] object-cover"
                />
                <div className="p-4 border-t border-slate-700 flex items-center justify-between gap-3">
                  <p className="text-slate-300 text-sm">{selectedProject.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={!selectedProject.screenshots?.length}
                      onClick={() => setGalleryIndex((idx) => (idx === 0 ? selectedProject.screenshots.length - 1 : idx - 1))}
                      className="px-3 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-sm disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      disabled={!selectedProject.screenshots?.length}
                      onClick={() => setAutoPlay((v) => !v)}
                      className="px-3 py-1 rounded bg-brand-accent text-slate-900 font-semibold hover:bg-cyan-300 text-sm disabled:opacity-50"
                    >
                      {autoPlay ? 'Pause' : 'Auto Play'}
                    </button>
                    <button
                      disabled={!selectedProject.screenshots?.length}
                      onClick={() => setGalleryIndex((idx) => (idx + 1) % selectedProject.screenshots.length)}
                      className="px-3 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedProject(null); setShowPresentation(false); setAutoPlay(false); }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => { setSelectedProject(null); setShowPresentation(false); setAutoPlay(false); }} 
                className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
              >
                <X size={20} />
              </button>
              <div className="w-full h-64 md:h-80 relative">
                <img 
                  src={selectedProject.screenshots?.[galleryIndex] || FALLBACK_SCREENSHOT}
                  className="w-full h-full object-cover rounded-t-2xl" 
                  alt={selectedProject.title}
                />
                {selectedProject.screenshots.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {selectedProject.screenshots.map((_, i) => (
                      <button
                        key={i}
                        className={`w-3 h-3 rounded-full ${galleryIndex === i ? 'bg-brand-accent' : 'bg-slate-700'}`}
                        onClick={() => setGalleryIndex(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h3>
                    <span className="text-brand-accent font-mono">{selectedProject.category}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setGalleryIndex(0);
                      setShowPresentation(true);
                    }}
                    className="px-4 py-2 bg-brand-accent text-slate-900 font-bold rounded-lg hover:bg-cyan-300 transition-colors flex items-center gap-2"
                  >
                    Project Presentation <ExternalLink size={16} />
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                  {selectedProject.description}
                </p>
                {isAdmin && (
                  <div className="mt-6 p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                    <h4 className="text-sm font-bold mb-3">Manage Screenshots</h4>
                    
                    {/* Upload section */}
                    <div className="mb-4">
                      <label className="block text-xs text-slate-400 mb-2">Upload new screenshot</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            const url = reader.result;
                            setTempScreenshots({
                              ...tempScreenshots,
                              [selectedProject.id]: [
                                ...(tempScreenshots[selectedProject.id] || []),
                                url
                              ]
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                      />
                    </div>

                    {/* Preview temporary uploads */}
                    {tempScreenshots[selectedProject.id]?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 mb-2">Pending uploads ({tempScreenshots[selectedProject.id].length})</p>
                        <div className="grid grid-cols-3 gap-2">
                          {tempScreenshots[selectedProject.id].map((img, idx) => (
                            <div key={idx} className="relative">
                              <img src={img} alt={`temp-${idx}`} className="w-full h-20 object-cover rounded border border-slate-700" />
                              <button
                                onClick={() => {
                                  setTempScreenshots({
                                    ...tempScreenshots,
                                    [selectedProject.id]: tempScreenshots[selectedProject.id].filter((_, i) => i !== idx)
                                  });
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Save button */}
                    {tempScreenshots[selectedProject.id]?.length > 0 && (
                      <button
                        onClick={() => {
                          const urls = tempScreenshots[selectedProject.id];
                          import('../services/apiService').then(({ apiService }) => {
                            (async () => {
                              const baseProject = await persistIfLocalSample(selectedProject, apiService);
                              const updated = await apiService.uploadScreenshots(baseProject.id, urls);
                              const normalized = normalizeProject({ ...updated, _localSample: false });
                              setProjects((prev) => prev.map(p => p.id === normalized.id ? normalized : p));
                              setSelectedProject(normalized);
                              setTempScreenshots({
                                ...tempScreenshots,
                                [normalized.id]: []
                              });
                            })().catch((err) => {
                              console.error(err);
                              window.alert(err?.message || 'Failed to upload screenshot.');
                            });
                          });
                        }}
                        className="w-full py-2 bg-brand-accent text-slate-900 font-bold rounded text-sm hover:bg-cyan-300 transition-colors"
                      >
                        Save Screenshots
                      </button>
                    )}

                    {/* Current screenshots */}
                    {selectedProject.screenshots?.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-2 mt-4">Current screenshots ({selectedProject.screenshots.length})</p>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProject.screenshots.map((img, idx) => (
                            <div key={idx} className="relative">
                              <img src={img} alt={`screen-${idx}`} className="w-full h-20 object-cover rounded border border-slate-700" />
                              <button
                                onClick={() => {
                                  const newArr = selectedProject.screenshots.filter((_, i) => i !== idx);
                                  import('../services/apiService').then(({ apiService }) => {
                                    (async () => {
                                      const baseProject = await persistIfLocalSample(selectedProject, apiService);
                                      const updated = await apiService.updateProject(baseProject.id, { screenshots: newArr });
                                      const normalized = normalizeProject({ ...updated, _localSample: false });
                                      setProjects(prev => prev.map(p => p.id === normalized.id ? normalized : p));
                                      setSelectedProject(normalized);
                                      setGalleryIndex(0);
                                    })().catch((err) => {
                                      console.error(err);
                                      window.alert(err?.message || 'Failed to remove screenshot.');
                                    });
                                  });
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-sm font-mono text-slate-500 mb-3 uppercase">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map(t => (
                      <span 
                        key={t} 
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
