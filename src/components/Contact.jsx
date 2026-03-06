import React, { useState } from 'react';


const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    import('../services/apiService').then(({ apiService }) => {
      apiService.sendMessage({ name, email, details })
        .then(() => {
          setStatus('success');
          setName('');
          setEmail('');
          setDetails('');
        })
        .catch(() => setStatus('error'))
        .finally(() => setLoading(false));
    });
  };

  return (
    <section id="contact" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="glass-panel rounded-2xl p-8 md:p-12 border border-slate-800">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              Let's Work <span className="text-brand-accent">Together</span>
            </h2>
            <p className="text-slate-400">Have a project in mind? Fill out the form below.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === 'success' && (
              <div className="p-3 bg-green-600 text-white rounded">Message sent successfully!</div>
            )}
            {status === 'error' && (
              <div className="p-3 bg-red-600 text-white rounded">Failed to send message. Please try again.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-brand-accent outline-none transition-colors" 
                  placeholder="John Doe" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-brand-accent outline-none transition-colors" 
                  placeholder="john@example.com" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Project Details</label>
              <textarea 
                rows="4" 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-brand-accent outline-none transition-colors" 
                placeholder="Tell me about your project..."
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-brand-accent to-brand-secondary text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;