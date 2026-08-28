import React, { useEffect, useState } from 'react';
import { invoiceApi } from '../api/invoiceApi';
import type { DashboardSummary } from '../types';
import { RefreshCw } from 'lucide-react';

export const Reports: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState('THIS_MONTH');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await invoiceApi.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatCurrency = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Financial Reports & Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Income, expense summaries, profit margins, and outstanding balances</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select value={filterRange} onChange={(e) => setFilterRange(e.target.value)} style={{ width: '160px' }}>
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_MONTH">Last Month</option>
            <option value="THIS_YEAR">This Year</option>
            <option value="ALL_TIME">All Time</option>
          </select>
          <button onClick={fetchReports} className="btn btn-secondary">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Generating financial report...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Gross Revenue</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                {formatCurrency(summary?.totalRevenue ?? 0)}
              </div>
            </div>

            <div className="card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Operating Expenses</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                {formatCurrency(summary?.totalExpenses ?? 0)}
              </div>
            </div>

            <div className="card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Net Profit</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: (summary?.netProfit ?? 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {formatCurrency(summary?.netProfit ?? 0)}
              </div>
            </div>

            <div className="card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Outstanding Receivables</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                {formatCurrency(summary?.outstandingInvoices ?? 0)}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Profit & Loss Overview</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.875rem', fontWeight: 600, color: '#fff' }}>Total Invoiced & Collected</td>
                  <td style={{ padding: '0.875rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                    {formatCurrency(summary?.totalRevenue ?? 0)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.875rem', fontWeight: 600, color: '#fff' }}>Less Total Expenses</td>
                  <td style={{ padding: '0.875rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-rose)' }}>
                    -{formatCurrency(summary?.totalExpenses ?? 0)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '2px solid var(--primary)', backgroundColor: 'var(--bg-main)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Net Earnings</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: (summary?.netProfit ?? 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {formatCurrency(summary?.netProfit ?? 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
