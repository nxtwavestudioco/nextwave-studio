import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Services from './components/Services';
import InvoiceSystem from './components/InvoiceSystem';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [showSocialSettings, setShowSocialSettings] = useState(false);
  const [socialLinks, setSocialLinks] = useState({ github: 'https://github.com', email: 'contact@example.com' });

  // fetch persistent social links from backend
  React.useEffect(() => {
    import('./services/apiService').then(({ apiService }) => {
      apiService.getSocialLinks().then(data => {
        if (data) setSocialLinks(data);
      }).catch(console.error);
    });
  }, []);

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      return;
    }
    setAdminUsername('');
    setAdminPassword('');
    setAdminLoginError('');
    setShowAdminLogin(true);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    if (!adminUsername.trim() || !adminPassword) {
      setAdminLoginError('Username and password are required.');
      return;
    }

    setAdminLoginLoading(true);
    try {
      const { apiService } = await import('./services/apiService');
      await apiService.adminLogin({
        username: adminUsername.trim(),
        password: adminPassword
      });
      setIsAdmin(true);
      setShowAdminLogin(false);
    } catch (err) {
      setAdminLoginError(err?.message || 'Invalid credentials.');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-brand-accent selection:text-slate-900">
      <Navbar isAdmin={isAdmin} onAdminToggle={handleAdminToggle} />
      <main>
        <Hero />
        <About />
        <Projects isAdmin={isAdmin} />
        <Services />
        <InvoiceSystem isAdmin={isAdmin} />
        <Contact />
      </main>
      <Footer isAdmin={isAdmin} setShowSocialSettings={setShowSocialSettings} socialLinks={socialLinks} />

      {showSocialSettings && isAdmin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div onClick={() => setShowSocialSettings(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <button
              onClick={() => setShowSocialSettings(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={socialLinks.email}
                  onChange={(e) => setSocialLinks({...socialLinks, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                  placeholder="contact@example.com"
                />
              </div>
              <button
                onClick={() => {
                  import('./services/apiService').then(({ apiService }) => {
                    apiService.updateSocialLinks(socialLinks).then(() => {
                      setShowSocialSettings(false);
                    }).catch((err) => {
                      console.error('Failed to save social links', err);
                    });
                  });
                }}
                className="w-full py-2 bg-brand-accent text-slate-900 font-bold rounded-lg hover:bg-cyan-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div
            onClick={() => setShowAdminLogin(false)}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
          ></div>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
            >
              âœ•
            </button>
            <h3 className="text-xl font-bold mb-2">Admin Login</h3>
            <p className="text-sm text-slate-400 mb-4">Enter admin credentials to access admin modules.</p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                  placeholder="Enter password"
                />
              </div>
              {adminLoginError && (
                <p className="text-sm text-red-400">{adminLoginError}</p>
              )}
              <button
                type="submit"
                disabled={adminLoginLoading}
                className="w-full py-2 bg-brand-accent text-slate-900 font-bold rounded-lg hover:bg-cyan-300 disabled:opacity-60"
              >
                {adminLoginLoading ? 'Signing in...' : 'Sign In as Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
