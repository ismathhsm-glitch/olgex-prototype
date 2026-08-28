import React, { useEffect, useState } from 'react';
import { invoiceApi } from '../api/invoiceApi';
import type { Invoice } from '../types';
import { CreditCard, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Payments: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    invoiceApi.getAll().then((data) => {
      setInvoices(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const paidInvoices = invoices.filter((i) => i.paidAmount > 0);
  const filtered = paidInvoices.filter((i) =>
    i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Payments Received</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Audit trail of payments recorded against invoices</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by invoice # or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading payments...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <CreditCard size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>No payment records found</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Invoice #</th>
                <th style={{ padding: '1rem' }}>Client</th>
                <th style={{ padding: '1rem' }}>Invoice Total ($)</th>
                <th style={{ padding: '1rem' }}>Total Paid ($)</th>
                <th style={{ padding: '1rem' }}>Remaining Balance ($)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>{inv.clientName}</td>
                  <td style={{ padding: '1rem', color: '#fff' }}>${inv.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>${inv.paidAmount.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: inv.balance > 0 ? 'var(--accent-amber)' : 'var(--text-muted)', fontWeight: 600 }}>
                    ${inv.balance.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link to={`/invoices/${inv.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                      View Invoice Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
