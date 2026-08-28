import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { invoiceApi } from '../api/invoiceApi';
import type { Invoice } from '../types';
import { InvoiceStatus } from '../types';
import { FileCheck, Search, Eye, Plus, Trash2 } from 'lucide-react';

export const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [error, setError] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await invoiceApi.getAll();
      setInvoices(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await invoiceApi.delete(id);
      fetchInvoices();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete invoice.');
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Draft: return <span className="badge badge-draft">Draft</span>;
      case InvoiceStatus.Sent: return <span className="badge badge-sent">Sent</span>;
      case InvoiceStatus.PartiallyPaid: return <span className="badge badge-partiallypaid">Partially Paid</span>;
      case InvoiceStatus.Paid: return <span className="badge badge-paid">Paid</span>;
      case InvoiceStatus.Overdue: return <span className="badge badge-overdue">Overdue</span>;
      case InvoiceStatus.Cancelled: return <span className="badge badge-draft">Cancelled</span>;
      default: return <span className="badge badge-draft">Unknown</span>;
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || inv.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Invoices Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track accounts receivable, billing, and payment statuses</p>
        </div>
        <Link to="/quotes" className="btn btn-secondary">
          <Plus size={18} />
          <span>New Quote / Invoice</span>
        </Link>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--status-overdue-bg)', color: 'var(--status-overdue-text)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by invoice # or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ width: '180px' }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value={InvoiceStatus.Draft.toString()}>Draft</option>
            <option value={InvoiceStatus.Sent.toString()}>Sent</option>
            <option value={InvoiceStatus.PartiallyPaid.toString()}>Partially Paid</option>
            <option value={InvoiceStatus.Paid.toString()}>Paid</option>
            <option value={InvoiceStatus.Overdue.toString()}>Overdue</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading invoices...</div>
      ) : filteredInvoices.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <FileCheck size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>No invoices found</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Invoice #</th>
                <th style={{ padding: '1rem' }}>Client</th>
                <th style={{ padding: '1rem' }}>Invoice Date</th>
                <th style={{ padding: '1rem' }}>Due Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Total ($)</th>
                <th style={{ padding: '1rem' }}>Paid ($)</th>
                <th style={{ padding: '1rem' }}>Balance ($)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>{inv.clientName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(inv.status)}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#fff' }}>${inv.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>${inv.paidAmount.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: inv.balance > 0 ? 'var(--accent-amber)' : 'var(--text-muted)', fontWeight: 600 }}>
                    ${inv.balance.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => navigate(`/invoices/${inv.id}`)}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                      <button onClick={() => handleDelete(inv.id)} className="btn btn-danger" style={{ padding: '0.4rem' }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
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
