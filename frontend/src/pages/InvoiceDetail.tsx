import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceApi } from '../api/invoiceApi';
import type { Invoice, CreatePaymentRequest } from '../types';
import { InvoiceStatus } from '../types';
import { ArrowLeft, CreditCard, DollarSign, X, Printer } from 'lucide-react';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<CreatePaymentRequest>({
    amount: 0,
    paymentMethod: 'Bank Transfer',
    reference: '',
    notes: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });
  const [paymentError, setPaymentError] = useState('');
  const [recordingPayment, setRecordingPayment] = useState(false);

  const fetchInvoice = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await invoiceApi.getById(id);
      setInvoice(data);
      setPaymentData((prev) => ({ ...prev, amount: data.balance }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load invoice details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    if (paymentData.amount <= 0) {
      setPaymentError('Payment amount must be greater than zero.');
      return;
    }

    if (paymentData.amount > invoice.balance) {
      setPaymentError(`Payment amount cannot exceed remaining balance of $${invoice.balance.toFixed(2)}.`);
      return;
    }

    setPaymentError('');
    setRecordingPayment(true);

    try {
      const updatedInvoice = await invoiceApi.recordPayment(invoice.id, {
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        reference: paymentData.reference,
        notes: paymentData.notes,
        paymentDate: new Date(paymentData.paymentDate).toISOString()
      });
      setInvoice(updatedInvoice);
      setIsPaymentModalOpen(false);
    } catch (err: any) {
      setPaymentError(err.response?.data?.message || 'Failed to record payment.');
    } finally {
      setRecordingPayment(false);
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Draft: return <span className="badge badge-draft">Draft</span>;
      case InvoiceStatus.Sent: return <span className="badge badge-sent">Sent</span>;
      case InvoiceStatus.PartiallyPaid: return <span className="badge badge-partiallypaid">Partially Paid</span>;
      case InvoiceStatus.Paid: return <span className="badge badge-paid">Paid</span>;
      case InvoiceStatus.Overdue: return <span className="badge badge-overdue">Overdue</span>;
      default: return <span className="badge badge-draft">Unknown</span>;
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading invoice details...</div>;
  if (error || !invoice) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--accent-rose)' }}>{error || 'Invoice not found.'}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/invoices')} className="btn btn-secondary">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>{invoice.invoiceNumber}</h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Billed to: <strong style={{ color: '#fff' }}>{invoice.clientName}</strong></p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={16} />
            <span>Print</span>
          </button>
          {invoice.balance > 0 && (
            <button onClick={() => { setIsPaymentModalOpen(true); setPaymentData(prev => ({ ...prev, amount: invoice.balance })); }} className="btn btn-success">
              <DollarSign size={18} />
              <span>Record Payment</span>
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>OLGAX INVOICE SYSTEM</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tax Invoice & Billing Statement</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
            <p><span style={{ color: 'var(--text-muted)' }}>Invoice Date:</span> <strong style={{ color: '#fff' }}>{new Date(invoice.invoiceDate).toLocaleDateString()}</strong></p>
            <p><span style={{ color: 'var(--text-muted)' }}>Due Date:</span> <strong style={{ color: '#fff' }}>{new Date(invoice.dueDate).toLocaleDateString()}</strong></p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem', backgroundColor: 'var(--bg-main)', padding: '1rem 1.25rem', borderRadius: 'var(--radius)' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Billed Customer</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>{invoice.clientName}</div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Unit Price ($)</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Discount ($)</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Tax (%)</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#fff', fontWeight: 500 }}>{item.description}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>${item.unitPrice.toFixed(2)}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--accent-rose)' }}>-${item.discount.toFixed(2)}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>{item.taxRate}%</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#fff' }}>${(item.total ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '320px', backgroundColor: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Discount:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>-${invoice.discount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tax:</span>
              <span style={{ fontWeight: 600 }}>+${invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
              <span>Grand Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-emerald)' }}>
              <span>Paid Amount:</span>
              <span>-${invoice.paidAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--primary)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 700, color: invoice.balance > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
              <span>Remaining Balance:</span>
              <span>${invoice.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {isPaymentModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '460px',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="var(--accent-emerald)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Record Payment</h2>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {paymentError && (
              <div style={{
                backgroundColor: 'var(--status-overdue-bg)',
                color: 'var(--status-overdue-text)',
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                {paymentError}
              </div>
            )}

            <form onSubmit={handleRecordPaymentSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Payment Amount ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={invoice.balance}
                  required
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Max allowed: ${invoice.balance.toFixed(2)}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Payment Method
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Payment Date
                </label>
                <input
                  type="date"
                  required
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Reference / Transaction ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-998822"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional payment notes..."
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={recordingPayment} className="btn btn-success">
                  {recordingPayment ? 'Recording...' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
