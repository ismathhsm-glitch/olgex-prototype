import React, { useEffect, useState } from 'react';
import { invoiceApi } from '../api/invoiceApi';
import { quoteApi } from '../api/quoteApi';
import type { Invoice, Quote } from '../types';
import { ExternalLink, FileCheck, FileSpreadsheet, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientPortal: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([invoiceApi.getAll(), quoteApi.getAll()])
      .then(([invData, qData]) => {
        setInvoices(invData);
        setQuotes(qData);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <ExternalLink size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Client Self-Service View</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>Client Portal Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Client interface preview for reviewing quotes, invoice balances, and payment statuses</p>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading client portal view...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <FileCheck size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>My Invoices</h2>
            </div>
            {invoices.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No active invoices.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {invoices.map((inv) => (
                  <div key={inv.id} style={{ backgroundColor: 'var(--bg-main)', padding: '0.875rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{inv.invoiceNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Balance: <strong style={{ color: inv.balance > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>${inv.balance.toFixed(2)}</strong>
                      </div>
                    </div>
                    <Link to={`/invoices/${inv.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                      <Eye size={14} />
                      <span>View</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <FileSpreadsheet size={20} color="var(--accent-purple)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>My Quotations</h2>
            </div>
            {quotes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No quotations available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {quotes.map((q) => (
                  <div key={q.id} style={{ backgroundColor: 'var(--bg-main)', padding: '0.875rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{q.quoteNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Total: <strong style={{ color: '#fff' }}>${q.total.toFixed(2)}</strong>
                      </div>
                    </div>
                    <span className="badge badge-draft">
                      {q.status === 4 ? 'Converted' : q.status === 2 ? 'Accepted' : 'Sent'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
