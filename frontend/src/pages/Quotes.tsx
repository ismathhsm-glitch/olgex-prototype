import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quoteApi } from '../api/quoteApi';
import type { Quote } from '../types';
import { QuoteStatus } from '../types';
import { FileSpreadsheet, Plus, Search, RefreshCw, ArrowRight, Trash2 } from 'lucide-react';

export const Quotes: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchQuotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await quoteApi.getAll();
      setQuotes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quotations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleConvertToInvoice = async (quoteId: string) => {
    if (!window.confirm('Convert this quotation into a formal invoice?')) return;
    setConvertingId(quoteId);
    try {
      const invoice = await quoteApi.convertToInvoice(quoteId);
      navigate(`/invoices/${invoice.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to convert quotation to invoice.');
      setConvertingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this quote?')) return;
    try {
      await quoteApi.delete(id);
      fetchQuotes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete quote.');
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.Draft: return <span className="badge badge-draft">Draft</span>;
      case QuoteStatus.Sent: return <span className="badge badge-sent">Sent</span>;
      case QuoteStatus.Accepted: return <span className="badge badge-accepted">Accepted</span>;
      case QuoteStatus.Rejected: return <span className="badge badge-rejected">Rejected</span>;
      case QuoteStatus.Converted: return <span className="badge badge-converted">Converted</span>;
      default: return <span className="badge badge-draft">Unknown</span>;
    }
  };

  const filteredQuotes = quotes.filter((q) =>
    q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
    q.clientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Quotations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Create, manage, and convert estimates into active invoices</p>
        </div>
        <Link to="/quotes/new" className="btn btn-primary">
          <Plus size={18} />
          <span>Create New Quote</span>
        </Link>
      </div>

      {error && (
        <div style={{ backgroundColor: 'var(--status-overdue-bg)', color: 'var(--status-overdue-text)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by quote # or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading quotations...</div>
      ) : filteredQuotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <FileSpreadsheet size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>No quotations found</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Quote #</th>
                <th style={{ padding: '1rem' }}>Client</th>
                <th style={{ padding: '1rem' }}>Quote Date</th>
                <th style={{ padding: '1rem' }}>Expiry Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Total ($)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((q) => (
                <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{q.quoteNumber}</td>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>{q.clientName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(q.quoteDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(q.expiryDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{getStatusBadge(q.status)}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#fff' }}>${q.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                      {q.status !== QuoteStatus.Converted ? (
                        <button
                          onClick={() => handleConvertToInvoice(q.id)}
                          disabled={convertingId === q.id}
                          className="btn btn-success"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                          title="Convert this quote to an Invoice"
                        >
                          {convertingId === q.id ? (
                            <RefreshCw className="animate-spin" size={14} />
                          ) : (
                            <>
                              <span>Convert to Invoice</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
                          Invoice Generated
                        </span>
                      )}
                      <button onClick={() => handleDelete(q.id)} className="btn btn-danger" style={{ padding: '0.4rem' }} title="Delete">
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
