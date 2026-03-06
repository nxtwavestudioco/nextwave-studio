const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

const hashPassword = (value) => crypto.createHash('sha256').update(String(value || '')).digest('hex');

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// simple JSON file database
const dataFile = path.join(__dirname, 'data.json');
let db = {
  invoices: [],
  projects: [],
  subscriptions: [],
  payments: [],
  socialLinks: { github: 'https://github.com', email: 'contact@example.com' },
  paymentInfo: { bank: '', account: '', gcash: '' },
  messages: [],
  adminAuth: {
    username: DEFAULT_ADMIN_USERNAME,
    passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    updatedAt: new Date().toISOString()
  }
};

const loadData = () => {
  let shouldSave = false;
  if (fs.existsSync(dataFile)) {
    try {
      db = JSON.parse(fs.readFileSync(dataFile));
    } catch (e) {
      console.error('Failed to parse data file', e);
    }
  }
  // ensure new fields have defaults when upgrading old data
  db.paymentInfo = db.paymentInfo || { bank: '', account: '', gcash: '' };
  if (!db.adminAuth || !db.adminAuth.username || !db.adminAuth.passwordHash) {
    db.adminAuth = {
      username: DEFAULT_ADMIN_USERNAME,
      passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
      updatedAt: new Date().toISOString()
    };
    shouldSave = true;
  }
  if (shouldSave) saveData();
};

const saveData = () => {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
};

loadData();

// =========== INVOICES ===========
app.get('/api/invoices', (req, res) => {
  res.json(db.invoices);
});

app.post('/api/invoices', (req, res) => {
  const newInvoice = {
    id: req.body.id || `INV-${Date.now()}`,
    ...req.body,
    createdAt: new Date()
  };
  db.invoices.push(newInvoice);
  saveData();
  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id', (req, res) => {
  const index = db.invoices.findIndex(inv => inv.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Invoice not found' });
  db.invoices[index] = { ...db.invoices[index], ...req.body };
  saveData();
  res.json(db.invoices[index]);
});

app.delete('/api/invoices/:id', (req, res) => {
  const invoiceToDelete = db.invoices.find(inv => String(inv.id) === String(req.params.id));
  db.invoices = db.invoices.filter(inv => String(inv.id) !== String(req.params.id));

  // Cleanup legacy standalone subscription records when invoice-based monthly subscription is deleted
  if (invoiceToDelete?.monthlySubscription) {
    const subDesc = invoiceToDelete.monthlySubscription.description || 'Monthly Payment';
    const subAmount = Number(invoiceToDelete.monthlySubscription.amount || 0);
    const client = String(invoiceToDelete.client || '').trim();
    db.subscriptions = (db.subscriptions || []).filter((s) => {
      const sameClient = String(s.client || '').trim() === client;
      const sameDesc = String(s.description || 'Monthly Payment') === subDesc;
      const sameAmount = Number(s.amount || 0) === subAmount;
      return !(sameClient && sameDesc && sameAmount);
    });
  }

  saveData();
  res.json({ message: 'Invoice deleted' });
});

// =========== PROJECTS ===========
app.get('/api/projects', (req, res) => {
  res.json(db.projects);
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: req.body.id || Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  db.projects.push(newProject);
  saveData();
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const index = db.projects.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  db.projects[index] = { ...db.projects[index], ...req.body };
  saveData();
  res.json(db.projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
  db.projects = db.projects.filter(p => p.id != req.params.id);
  saveData();
  res.json({ message: 'Project deleted' });
});

// Upload screenshots
app.post('/api/projects/:id/screenshots', (req, res) => {
  const project = db.projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  
  if (!project.screenshots) project.screenshots = [];
  project.screenshots.push(...req.body.urls);
  saveData();
  
  res.json(project);
});

// =========== MONTHLY SUBSCRIPTIONS ===========
app.get('/api/subscriptions', (req, res) => {
  res.json(db.subscriptions);
});

app.post('/api/subscriptions', (req, res) => {
  const newSub = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  db.subscriptions.push(newSub);
  saveData();
  res.status(201).json(newSub);
});

app.put('/api/subscriptions/:id', (req, res) => {
  const index = db.subscriptions.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Subscription not found' });
  db.subscriptions[index] = { ...db.subscriptions[index], ...req.body };
  saveData();
  res.json(db.subscriptions[index]);
});

app.delete('/api/subscriptions/:id', (req, res) => {
  db.subscriptions = db.subscriptions.filter(s => s.id != req.params.id);
  saveData();
  res.json({ message: 'Subscription deleted' });
});

// =========== PAYMENT INFORMATION ===========
app.get('/api/payment-info', (req, res) => {
  res.json(db.paymentInfo);
});

app.put('/api/payment-info', (req, res) => {
  Object.assign(db.paymentInfo, req.body);
  saveData();
  res.json(db.paymentInfo);
});

// =========== SOCIAL LINKS ===========
app.get('/api/social-links', (req, res) => {
  res.json(db.socialLinks);
});

app.put('/api/social-links', (req, res) => {
  Object.assign(db.socialLinks, req.body);
  saveData();
  res.json(db.socialLinks);
});

// =========== ADMIN AUTH ===========
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const validUser = String(username).trim() === db.adminAuth.username;
  const validPassword = hashPassword(password) === db.adminAuth.passwordHash;

  if (!validUser || !validPassword) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  return res.json({ success: true });
});

app.put('/api/admin/credentials', (req, res) => {
  const { currentUsername, currentPassword, newUsername, newPassword } = req.body || {};
  if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
    return res.status(400).json({ error: 'Current and new credentials are required' });
  }

  const validCurrentUser = String(currentUsername).trim() === db.adminAuth.username;
  const validCurrentPassword = hashPassword(currentPassword) === db.adminAuth.passwordHash;
  if (!validCurrentUser || !validCurrentPassword) {
    return res.status(401).json({ error: 'Current admin credentials are invalid' });
  }

  db.adminAuth.username = String(newUsername).trim();
  db.adminAuth.passwordHash = hashPassword(newPassword);
  db.adminAuth.updatedAt = new Date().toISOString();
  saveData();

  return res.json({ success: true });
});

// =========== PAYMENTS ===========
app.get('/api/payments', (req, res) => {
  res.json(db.payments);
});

app.post('/api/payments', (req, res) => {
  const newPayment = {
    id: `PAY-${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    status: 'pending'
  };
  db.payments.push(newPayment);
  saveData();
  res.status(201).json(newPayment);
});

app.put('/api/payments/:id', (req, res) => {
  const index = db.payments.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Payment not found' });
  db.payments[index] = { ...db.payments[index], ...req.body };
  saveData();
  res.json(db.payments[index]);
});

// =========== CONTACT MESSAGES ===========
app.get('/api/messages', (req, res) => {
  res.json(db.messages);
});

app.post('/api/messages', (req, res) => {
  const msg = {
    id: `MSG-${Date.now()}`,
    ...req.body,
    createdAt: new Date()
  };
  db.messages.push(msg);
  saveData();
  res.status(201).json({ success: true });
});

// =========== ROOT ROUTE ===========
app.get('/', (req, res) => {
  res.json({
    message: 'NextWave Studio API Server',
    version: '1.0.0',
    docs: 'See /api/health or check server/README.md',
    endpoints: {
      health: '/api/health',
      invoices: '/api/invoices',
      projects: '/api/projects',
      subscriptions: '/api/subscriptions',
      payments: '/api/payments',
      messages: '/api/messages',
      socialLinks: '/api/social-links',
      paymentInfo: '/api/payment-info',
      adminLogin: '/api/admin/login'
    }
  });
});

// =========== HEALTH CHECK ===========
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Uploaded image is too large. Please use a smaller image.' });
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
