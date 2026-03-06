// API service module for frontend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const toJsonOrThrow = async (r, fallbackMessage) => {
  const body = await r.json();
  if (!r.ok) throw new Error(body?.error || fallbackMessage);
  return body;
};

export const apiService = {
  // Invoices
  getInvoices: () => fetch(`${API_URL}/api/invoices`).then(r => r.json()),
  createInvoice: (data) => fetch(`${API_URL}/api/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateInvoice: (id, data) => fetch(`${API_URL}/api/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteInvoice: (id) => fetch(`${API_URL}/api/invoices/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),

  // Projects
  getProjects: () => fetch(`${API_URL}/api/projects`).then(r => r.json()),
  createProject: (data) => fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateProject: (id, data) => fetch(`${API_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then((r) => toJsonOrThrow(r, 'Failed to update project')),
  deleteProject: (id) => fetch(`${API_URL}/api/projects/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),
  uploadScreenshots: (projectId, urls) => fetch(`${API_URL}/api/projects/${projectId}/screenshots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls })
  }).then((r) => toJsonOrThrow(r, 'Failed to upload screenshots')),

  // Subscriptions
  getSubscriptions: () => fetch(`${API_URL}/api/subscriptions`).then(r => r.json()),
  createSubscription: (data) => fetch(`${API_URL}/api/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateSubscription: (id, data) => fetch(`${API_URL}/api/subscriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteSubscription: (id) => fetch(`${API_URL}/api/subscriptions/${id}`, {
    method: 'DELETE'
  }).then(r => r.json()),

  // Payments
  getPayments: () => fetch(`${API_URL}/api/payments`).then(r => r.json()),
  createPayment: (data) => fetch(`${API_URL}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updatePayment: (id, data) => fetch(`${API_URL}/api/payments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Settings
  getSocialLinks: () => fetch(`${API_URL}/api/social-links`).then(r => r.json()),
  updateSocialLinks: (data) => fetch(`${API_URL}/api/social-links`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  adminLogin: (credentials) => fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }).then(async (r) => {
    const body = await r.json();
    if (!r.ok) throw new Error(body?.error || 'Admin login failed');
    return body;
  }),
  updateAdminCredentials: (data) => fetch(`${API_URL}/api/admin/credentials`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(async (r) => {
    const body = await r.json();
    if (!r.ok) throw new Error(body?.error || 'Failed to update admin credentials');
    return body;
  }),
  getPaymentInfo: () => fetch(`${API_URL}/api/payment-info`).then(r => r.json()),
  updatePaymentInfo: (data) => fetch(`${API_URL}/api/payment-info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Messages
  getMessages: () => fetch(`${API_URL}/api/messages`).then(r => r.json()),
  sendMessage: (data) => fetch(`${API_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Health check
  checkHealth: () => fetch(`${API_URL}/api/health`).then(r => r.json())
};
