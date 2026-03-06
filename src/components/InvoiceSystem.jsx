import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle, Clock, Download, Send, Pencil } from 'lucide-react';
import { jsPDF } from 'jspdf';

const COMPANY_LOGO = '/image/NW-Logo.png';
const toOrdinal = (n) => {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
};

const InvoiceSystem = ({ isAdmin }) => {
  const sampleInvoices = [
    {
      id: 'INV-001',
      client: 'Great Sierra Development Corp',
      items: [
        { desc: 'Power Apps Development', qty: 1, price: 5000 },
        { desc: 'Database Set Up', qty: 1, price: 1000 },
        { desc: 'Process Automation', qty: 1, price: 3000 },
      ],
      tax: 0,
      amount: 9000,
      status: 'Paid',
      date: '2025-02-05'
    },
    {
      id: 'INV-002',
      client: 'STI Students',
      items: [
        { desc: 'Mobile App Development', qty: 1, price: 500 },
        { desc: 'Database Set Up', qty: 1, price: 50 },
        { desc: 'System Documentation', qty: 1, price: 50 },
      ],
      tax: 0,
      amount: 600,
      status: 'Paid',
      date: '2025-09-05'
    },
  ];

  const [invoices, setInvoices] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({ bank: '', account: '', gcash: '' });
  const [showForm, setShowForm] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showMonthlySubscription, setShowMonthlySubscription] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [transparentLogo, setTransparentLogo] = useState(COMPANY_LOGO);

  const [newInvoice, setNewInvoice] = useState({
    client: '',
    items: [{ desc: '', qty: '', price: '' }],
    tax: 0
  });

  const [monthlyPlan, setMonthlyPlan] = useState({
    months: '',
    amount: '',
    description: 'Monthly Payment'
  });

  React.useEffect(() => {
    import('../services/apiService').then(({ apiService }) => {
      apiService.getInvoices().then(data => {
        if (data && data.length > 0) {
          setInvoices(data);
        } else {
          setInvoices(sampleInvoices);
        }
      }).catch(err => {
        console.error('failed to fetch invoices', err);
        setInvoices(sampleInvoices);
      });

      apiService.getPaymentInfo()
        .then(info => setPaymentInfo(info || { bank: '', account: '', gcash: '' }))
        .catch(() => setPaymentInfo({ bank: '', account: '', gcash: '' }));
    });
  }, []);

  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = COMPANY_LOGO;
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
      setTransparentLogo(canvas.toDataURL('image/png'));
    };
  }, []);

  const calculateTotalForItems = (items, tax = 0) => {
    const subtotal = items.reduce((acc, item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      return acc + qty * price;
    }, 0);
    const taxAmount = subtotal * ((parseFloat(tax) || 0) / 100);
    return subtotal + taxAmount;
  };

  const calculateTotal = () => {
    const base = calculateTotalForItems(newInvoice.items, newInvoice.tax);
    const months = Math.max(0, parseInt(monthlyPlan.months, 10) || 0);
    const amount = parseFloat(monthlyPlan.amount) || 0;
    return base + (months * amount);
  };

  const handleAddItem = () => {
    setNewInvoice(prev => ({ ...prev, items: [...prev.items, { desc: '', qty: '', price: '' }] }));
  };

  const handleRemoveItem = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const resetInvoiceForm = () => {
    setNewInvoice({ client: '', items: [{ desc: '', qty: '', price: '' }], tax: 0 });
    setMonthlyPlan({ months: '', amount: '', description: 'Monthly Payment' });
    setShowMonthlySubscription(false);
  };

  const handleGenerateInvoice = () => {
    if (!newInvoice.client.trim()) return;

    const months = Math.max(0, parseInt(monthlyPlan.months, 10) || 0);
    const monthlyAmount = parseFloat(monthlyPlan.amount) || 0;
    const monthlyDescription = (monthlyPlan.description || '').trim() || 'Monthly Payment';
    const hasMonthly = months > 0 && monthlyAmount > 0;

    const monthlyItems = hasMonthly
      ? Array.from({ length: months }, (_, idx) => ({
          desc: `${toOrdinal(idx + 1)} Month - ${monthlyDescription}`,
          qty: 1,
          price: monthlyAmount,
          isSubscription: true
        }))
      : [];

    const items = [...newInvoice.items, ...monthlyItems];
    const totalAmount = calculateTotalForItems(items, newInvoice.tax);

    const payload = {
      client: newInvoice.client,
      items,
      tax: parseFloat(newInvoice.tax) || 0,
      amount: totalAmount,
      monthlySubscription: hasMonthly
        ? { months, amount: monthlyAmount, description: monthlyDescription }
        : null,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    import('../services/apiService').then(({ apiService }) => {
      apiService.createInvoice(payload).then((created) => {
        setInvoices([created, ...invoices]);
        setShowForm(false);
        resetInvoiceForm();
      }).catch(console.error);
    });
  };

  const openEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setEditForm({
      client: invoice.client || '',
      items: (invoice.items || []).map((it) => ({
        desc: it.desc || '',
        qty: it.qty || '',
        price: it.price || '',
        isSubscription: Boolean(it.isSubscription)
      })),
      tax: invoice.tax || 0
    });
  };

  const handleEditAddItem = () => {
    setEditForm((prev) => ({ ...prev, items: [...prev.items, { desc: '', qty: '', price: '' }] }));
  };

  const handleEditRemoveItem = (index) => {
    setEditForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const handleSaveEditedInvoice = () => {
    if (!editingInvoice || !editForm || !editForm.client.trim()) return;
    const amount = calculateTotalForItems(editForm.items, editForm.tax);
    const payload = { ...editingInvoice, ...editForm, amount };
    import('../services/apiService').then(({ apiService }) => {
      apiService.updateInvoice(editingInvoice.id, payload).then((updated) => {
        setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
        if (selectedInvoice?.id === updated.id) setSelectedInvoice(updated);
        setEditingInvoice(null);
        setEditForm(null);
      }).catch(console.error);
    });
  };

  const handleDeleteInvoice = (invoice) => {
    if (!window.confirm(`Delete invoice ${invoice.id}?`)) return;
    import('../services/apiService').then(({ apiService }) => {
      apiService.deleteInvoice(invoice.id).then(() => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
        if (selectedInvoice?.id === invoice.id) setSelectedInvoice(null);
      }).catch(console.error);
    });
  };

  const getTransparentLogoDataUrl = () => new Promise((resolve) => {
    if (transparentLogo && transparentLogo !== COMPANY_LOGO) {
      resolve(transparentLogo);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = COMPANY_LOGO;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
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
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
  });

  const downloadPDF = async (invoice) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const logoDataUrl = await getTransparentLogoDataUrl();

    if (logoDataUrl) {
      pdf.addImage(logoDataUrl, 'PNG', 14, 12, 34, 28);
    }

    pdf.setFontSize(16);
    pdf.setTextColor(30, 30, 30);
    pdf.text('NEXTWAVE STUDIO', 52, 20);
    pdf.setFontSize(9);
    pdf.setTextColor(90, 90, 90);
    pdf.text('Alphabase Building Scout Rallos', 52, 25);
    pdf.text('Diliman Quezon City', 52, 30);

    pdf.setFontSize(24);
    pdf.setTextColor(25, 25, 25);
    pdf.text('INVOICE', pageWidth - 14, 20, { align: 'right' });
    pdf.setFontSize(10);
    pdf.text(`Invoice #: ${invoice.id}`, pageWidth - 14, 27, { align: 'right' });
    pdf.text(`Date: ${invoice.date}`, pageWidth - 14, 33, { align: 'right' });

    let y = 42;
    pdf.setDrawColor(180, 180, 180);
    pdf.line(14, y, pageWidth - 14, y);
    y += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(35, 35, 35);
    pdf.text('Bill To', 14, y);
    pdf.rect(14, y + 2, pageWidth - 28, 10);
    pdf.text(invoice.client || '-', 16, y + 9);
    y += 18;

    pdf.setFillColor(32, 56, 100);
    pdf.rect(14, y, pageWidth - 28, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text('Line Item', 16, y + 5.5);
    pdf.text('Qty', 122, y + 5.5);
    pdf.text('Unit', 144, y + 5.5);
    pdf.text('Amount', pageWidth - 16, y + 5.5, { align: 'right' });
    y += 8;

    pdf.setTextColor(25, 25, 25);
    const items = Array.isArray(invoice.items) ? invoice.items : [];
    items.forEach((item) => {
      const qty = parseFloat(item.qty) || 0;
      const unit = parseFloat(item.price) || 0;
      const lineTotal = qty * unit;
      pdf.rect(14, y, pageWidth - 28, 8);
      pdf.text(String(item.desc || '-'), 16, y + 5.5);
      pdf.text(String(qty), 122, y + 5.5);
      pdf.text(`$${unit.toFixed(2)}`, 144, y + 5.5);
      pdf.text(`$${lineTotal.toFixed(2)}`, pageWidth - 16, y + 5.5, { align: 'right' });
      y += 8;
    });

    if (invoice.monthlySubscription?.months) {
      y += 4;
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      pdf.text(
        `Monthly Subscription: ${invoice.monthlySubscription.months} months @ $${Number(invoice.monthlySubscription.amount || 0).toFixed(2)} (${invoice.monthlySubscription.description || 'Monthly Payment'})`,
        14,
        y
      );
      y += 6;
    }

    const totalAmount = invoice.amount || calculateTotalForItems(items, invoice.tax || 0);
    y += 4;
    pdf.rect(pageWidth - 84, y, 70, 16);
    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    pdf.text('TOTAL', pageWidth - 18, y + 6, { align: 'right' });
    pdf.setFontSize(14);
    pdf.text(`$${Number(totalAmount).toFixed(2)}`, pageWidth - 18, y + 12, { align: 'right' });

    y += 24;
    pdf.setDrawColor(180, 180, 180);
    pdf.rect(14, y, pageWidth - 28, 20);
    pdf.setFontSize(10);
    pdf.setTextColor(35, 35, 35);
    pdf.text('Banking Details', 16, y + 6);
    pdf.setFontSize(9);
    if (paymentInfo.bank) pdf.text(`Bank: ${paymentInfo.bank}`, 16, y + 12);
    if (paymentInfo.account) pdf.text(`Account Number: ${paymentInfo.account}`, 80, y + 12);
    if (paymentInfo.gcash) pdf.text(`GCash/Other: ${paymentInfo.gcash}`, 16, y + 17);

    pdf.save(`${invoice.id}.pdf`);
  };

  return (
    <section id="invoices" className="py-20 bg-slate-950">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <img
              src={transparentLogo}
              alt="NextWave logo"
              className="w-32 h-32 object-contain bg-transparent"
            />
            <div>
              <h2 className="text-3xl font-bold">
                Client <span className="text-brand-highlight">Portal</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {isAdmin ? 'Admin Mode: Manage Invoices' : 'View your invoices and payment status'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            {isAdmin && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-brand-highlight text-white rounded-lg flex items-center gap-2 hover:bg-pink-600 transition-colors"
              >
                <Plus size={18} /> New Invoice
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowPaymentSettings(!showPaymentSettings)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Bank Details
              </button>
            )}
            {!isAdmin && (paymentInfo.bank || paymentInfo.account || paymentInfo.gcash) && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-brand-accent text-slate-900 rounded-lg hover:bg-cyan-300 transition-colors"
              >
                Payment
              </button>
            )}
          </div>
        </div>

        {isAdmin && showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="glass-panel p-6 rounded-xl mb-8 border border-slate-700 relative"
          >
            <button
              onClick={() => { setShowForm(false); resetInvoiceForm(); }}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
            >
              x
            </button>
            <h3 className="text-xl font-bold mb-4">Create New Invoice</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Client Name</label>
                <input
                  type="text"
                  value={newInvoice.client}
                  onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                  placeholder="e.g. Magellan TCI Project"
                />
              </div>

              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-800 text-slate-300 text-sm font-semibold">
                  <div className="col-span-7 p-2 border-r border-slate-700">Line Items</div>
                  <div className="col-span-2 p-2 border-r border-slate-700 text-center">Qty</div>
                  <div className="col-span-2 p-2 border-r border-slate-700 text-center">Amount</div>
                  <div className="col-span-1 p-2 text-center">&nbsp;</div>
                </div>
                {newInvoice.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 border-t border-slate-700">
                    <div className="col-span-7 p-2 border-r border-slate-700">
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => {
                          const items = [...newInvoice.items];
                          items[idx].desc = e.target.value;
                          setNewInvoice({ ...newInvoice, items });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                        placeholder="Description"
                      />
                    </div>
                    <div className="col-span-2 p-2 border-r border-slate-700">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => {
                          const items = [...newInvoice.items];
                          items[idx].qty = e.target.value;
                          setNewInvoice({ ...newInvoice, items });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm text-center"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-2 p-2 border-r border-slate-700">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => {
                          const items = [...newInvoice.items];
                          items[idx].price = e.target.value;
                          setNewInvoice({ ...newInvoice, items });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm text-right"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-1 p-2 flex items-center justify-center">
                      <button onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={handleAddItem} className="text-sm text-brand-accent hover:underline">+ Add Line Item</button>
                <button
                  onClick={() => setShowMonthlySubscription(v => !v)}
                  className="text-sm text-brand-secondary hover:underline"
                >
                  + Monthly Subscription
                </button>
              </div>

              {showMonthlySubscription && (
                <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50 space-y-3">
                  <h4 className="font-semibold">Monthly Subscription</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="number"
                      value={monthlyPlan.months}
                      onChange={(e) => setMonthlyPlan({ ...monthlyPlan, months: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                      placeholder="No. of months (e.g. 12)"
                    />
                    <input
                      type="number"
                      value={monthlyPlan.amount}
                      onChange={(e) => setMonthlyPlan({ ...monthlyPlan, amount: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                      placeholder="Monthly amount"
                    />
                    <input
                      type="text"
                      value={monthlyPlan.description}
                      onChange={(e) => setMonthlyPlan({ ...monthlyPlan, description: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded p-2 text-white"
                      placeholder="Description"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Rows will be generated automatically when you click Generate Invoice.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Tax (%)</span>
                  <input
                    type="number"
                    value={newInvoice.tax}
                    onChange={(e) => setNewInvoice({ ...newInvoice, tax: Number(e.target.value) })}
                    className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-white text-center"
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-white">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>

              <button
                onClick={handleGenerateInvoice}
                className="w-full py-3 bg-brand-accent text-slate-900 font-bold rounded-lg hover:bg-cyan-300 transition-colors"
              >
                Generate Invoice
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => setSelectedInvoice(inv)}
              className="cursor-pointer glass-panel p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${inv.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {inv.status === 'Paid' ? <CheckCircle size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{inv.client}</h4>
                  <p className="text-slate-400 text-sm font-mono">{inv.id} - {inv.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  {isAdmin ? (
                    <p className="text-2xl font-bold text-white">${Number(inv.amount || 0).toLocaleString()}</p>
                  ) : (
                    <p className="text-2xl font-bold text-slate-600">----</p>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {inv.status}
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    {inv.status === 'Pending' && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditInvoice(inv); }}
                          className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit Invoice"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteInvoice(inv); }}
                          className="p-2 bg-red-900/50 rounded-lg hover:bg-red-800 text-red-300 transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadPDF(inv); }}
                      className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Download PDF"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Send Email"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {isAdmin && showPaymentSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="glass-panel p-6 rounded-xl mt-8 border border-slate-700"
          >
            <h3 className="text-xl font-bold mb-4">Bank / Payment Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={paymentInfo.bank}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bank: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={paymentInfo.account}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, account: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">GCash / Other</label>
                <input
                  type="text"
                  value={paymentInfo.gcash}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, gcash: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-brand-accent outline-none"
                />
              </div>
              <button
                onClick={() => {
                  import('../services/apiService').then(({ apiService }) => {
                    apiService.updatePaymentInfo(paymentInfo).catch(console.error);
                  });
                }}
                className="w-full py-2 bg-brand-accent text-slate-900 font-bold rounded-lg hover:bg-cyan-300"
              >
                Save Payment Info
              </button>
            </div>
          </motion.div>
        )}

        {selectedInvoice && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div onClick={() => setSelectedInvoice(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl p-8">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
              >
                x
              </button>

              <div className="mb-6 flex items-center gap-3">
                <img
                  src={transparentLogo}
                  alt="NextWave logo"
                  className="w-40 h-40 object-contain bg-transparent"
                />
                <div>
                  <h2 className="text-xl font-bold">Next Wave Studio</h2>
                  <p className="text-sm text-slate-400">Alphabase Building Scout Rallos Diliman Quezon City</p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4">Invoice {selectedInvoice.id}</h3>
              <p className="text-sm text-slate-400">Date: {selectedInvoice.date}</p>
              <p className="text-sm text-slate-400">Client: {selectedInvoice.client}</p>
              {selectedInvoice.monthlySubscription?.months > 0 && (
                <div className="mt-4 border border-slate-700 rounded-lg p-3 bg-slate-800/50">
                  <p className="font-semibold text-brand-accent">
                    {selectedInvoice.monthlySubscription.months} Months
                  </p>
                  <p className="text-sm text-slate-300 mb-2">
                    {selectedInvoice.monthlySubscription.description || 'Monthly Payment'} - ${Number(selectedInvoice.monthlySubscription.amount || 0).toFixed(2)} / month
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs text-slate-400">
                    {Array.from({ length: selectedInvoice.monthlySubscription.months }, (_, idx) => (
                      <span key={idx}>{toOrdinal(idx + 1)} Month</span>
                    ))}
                  </div>
                </div>
              )}

              <table className="w-full mt-6 text-sm border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="p-2 border border-slate-700">Line Items</th>
                    <th className="p-2 border border-slate-700">Qty</th>
                    <th className="p-2 border border-slate-700">Amount</th>
                    {isAdmin && <th className="p-2 border border-slate-700">Total</th>}
                  </tr>
                </thead>
                <tbody>
                  {(selectedInvoice.items || []).map((it, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-slate-700">{it.desc}</td>
                      <td className="p-2 border border-slate-700">{it.qty}</td>
                      <td className="p-2 border border-slate-700">{it.price}</td>
                      {isAdmin && <td className="p-2 border border-slate-700">${((parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)).toFixed(2)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>

              {isAdmin && (
                <div className="text-right mt-4">
                  <p className="text-xl font-bold">Total: ${Number(selectedInvoice.amount || 0).toFixed(2)}</p>
                </div>
              )}

              {isAdmin && (
                <div className="mt-6 flex gap-2">
                  {selectedInvoice.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => openEditInvoice(selectedInvoice)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(selectedInvoice)}
                        className="px-4 py-2 bg-red-900/50 text-red-200 rounded-lg hover:bg-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => downloadPDF(selectedInvoice)}
                    className="px-4 py-2 bg-brand-accent text-slate-900 rounded-lg hover:bg-cyan-300 transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {isAdmin && editingInvoice && editForm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div onClick={() => { setEditingInvoice(null); setEditForm(null); }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl p-6">
              <button
                onClick={() => { setEditingInvoice(null); setEditForm(null); }}
                className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
              >
                x
              </button>
              <h3 className="text-xl font-bold mb-4">Edit Invoice {editingInvoice.id}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={editForm.client}
                    onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  />
                </div>

                <div className="border border-slate-700 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-800 text-slate-300 text-sm font-semibold">
                    <div className="col-span-7 p-2 border-r border-slate-700">Line Items</div>
                    <div className="col-span-2 p-2 border-r border-slate-700 text-center">Qty</div>
                    <div className="col-span-2 p-2 border-r border-slate-700 text-center">Amount</div>
                    <div className="col-span-1 p-2 text-center">&nbsp;</div>
                  </div>
                  {editForm.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 border-t border-slate-700">
                      <div className="col-span-7 p-2 border-r border-slate-700">
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => {
                            const items = [...editForm.items];
                            items[idx].desc = e.target.value;
                            setEditForm({ ...editForm, items });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm"
                        />
                      </div>
                      <div className="col-span-2 p-2 border-r border-slate-700">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => {
                            const items = [...editForm.items];
                            items[idx].qty = e.target.value;
                            setEditForm({ ...editForm, items });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm text-center"
                        />
                      </div>
                      <div className="col-span-2 p-2 border-r border-slate-700">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const items = [...editForm.items];
                            items[idx].price = e.target.value;
                            setEditForm({ ...editForm, items });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm text-right"
                        />
                      </div>
                      <div className="col-span-1 p-2 flex items-center justify-center">
                        <button onClick={() => handleEditRemoveItem(idx)} className="text-red-400 hover:text-red-300">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleEditAddItem} className="text-sm text-brand-accent hover:underline">+ Add Line Item</button>

                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Tax (%)</span>
                    <input
                      type="number"
                      value={editForm.tax}
                      onChange={(e) => setEditForm({ ...editForm, tax: Number(e.target.value) })}
                      className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-white text-center"
                    />
                  </div>
                  <p className="text-xl font-bold text-white">
                    ${calculateTotalForItems(editForm.items, editForm.tax).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={handleSaveEditedInvoice}
                  className="w-full py-2 bg-brand-accent text-slate-900 font-bold rounded-lg hover:bg-cyan-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div onClick={() => setShowPaymentModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-lg">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-white"
              >
                x
              </button>
              <h3 className="text-xl font-bold mb-4">Payment Details</h3>
              {paymentInfo.bank && <p><strong>Bank:</strong> {paymentInfo.bank}</p>}
              {paymentInfo.account && <p><strong>Account #:</strong> {paymentInfo.account}</p>}
              {paymentInfo.gcash && <p><strong>GCash/Other:</strong> {paymentInfo.gcash}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InvoiceSystem;
