import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientApi } from '../api/clientApi';
import { quoteApi } from '../api/quoteApi';
import type { Client, QuoteItem, QuoteStatus } from '../types';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

export const CreateQuote: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [clientId, setClientId] = useState('');
  const [quoteNumber, setQuoteNumber] = useState(`QT-${Date.now().toString().slice(-6)}`);
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  const [status, setStatus] = useState<QuoteStatus>(0 as QuoteStatus);

  const [items, setItems] = useState<QuoteItem[]>([
    { description: 'Software Consulting', quantity: 1, unitPrice: 1500, discount: 0, taxRate: 10 }
  ]);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    clientApi.getAll().then((data) => {
      setClients(data);
      if (data.length > 0) setClientId(data[0].id);
      setLoadingClients(false);
    }).catch(() => setLoadingClients(false));
  }, []);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    let taxAmount = 0;

    items.forEach((item) => {
      const lineSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      const lineDiscount = item.discount || 0;
      const lineTaxable = Math.max(0, lineSubtotal - lineDiscount);
      const lineTax = (lineTaxable * (item.taxRate || 0)) / 100;

      subtotal += lineSubtotal;
      discount += lineDiscount;
      taxAmount += lineTax;
    });

    const total = subtotal - discount + taxAmount;
    return { subtotal, discount, taxAmount, total };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await quoteApi.create({
        clientId,
        quoteNumber,
        quoteDate: new Date(quoteDate).toISOString(),
        expiryDate: new Date(expiryDate).toISOString(),
        status: Number(status) as QuoteStatus,
        items: items.map(i => ({
          description: i.description,
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
          discount: Number(i.discount),
          taxRate: Number(i.taxRate)
        }))
      });
      navigate('/quotes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/quotes')} className="btn btn-secondary">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Create New Quotation</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Draft a formal business estimate</p>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--status-overdue-bg)',
          color: 'var(--status-overdue-text)',
          padding: '1rem',
          borderRadius: 'var(--radius)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1.25rem' }}>Quote Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Client *</label>
              {loadingClients ? (
                <div>Loading clients...</div>
              ) : (
                <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} {c.companyName ? `(${c.companyName})` : ''}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Quote Number *</label>
              <input type="text" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Quote Date</label>
              <input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Expiry Date</label>
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Status</label>
              <select value={status} onChange={(e) => setStatus(Number(e.target.value) as QuoteStatus)}>
                <option value={0}>Draft</option>
                <option value={1}>Sent</option>
                <option value={2}>Accepted</option>
                <option value={3}>Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>Line Items</h3>
            <button type="button" onClick={handleAddItem} className="btn btn-secondary">
              <Plus size={16} />
              <span>Add Line Item</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', width: '40%' }}>Description</th>
                  <th style={{ padding: '0.75rem', width: '12%' }}>Qty</th>
                  <th style={{ padding: '0.75rem', width: '15%' }}>Unit Price ($)</th>
                  <th style={{ padding: '0.75rem', width: '12%' }}>Discount ($)</th>
                  <th style={{ padding: '0.75rem', width: '12%' }}>Tax (%)</th>
                  <th style={{ padding: '0.75rem', width: '9%', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.5rem' }}>
                      <input
                        type="text"
                        required
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.taxRate}
                        onChange={(e) => handleItemChange(idx, 'taxRate', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.6rem' }}
                        disabled={items.length === 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <div style={{ width: '280px', backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Discount:</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>-${totals.discount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax Amount:</span>
                <span style={{ fontWeight: 600 }}>+${totals.taxAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                <span>Grand Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" onClick={() => navigate('/quotes')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Save size={18} />
            <span>{submitting ? 'Saving Quotation...' : 'Save Quotation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
