import React, { useEffect, useState } from 'react';
import { invoiceApi } from '../api/invoiceApi';
import type { DashboardSummary } from '../types';
import { DollarSign, TrendingDown, Clock, AlertTriangle, Wallet, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await invoiceApi.getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
        <p>Loading real-time financial analytics...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Executive Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real-time business performance overview</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchDashboard} className="btn btn-secondary" title="Refresh data">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <Link to="/quotes/new" className="btn btn-primary">
            <Plus size={16} />
            <span>New Quote</span>
          </Link>
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

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Revenue</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#fff' }}>
            {formatCurrency(summary?.totalRevenue ?? 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ArrowUpRight size={14} color="var(--accent-emerald)" />
            <span>Invoiced & Received</span>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Expenses</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#fff' }}>
            {formatCurrency(summary?.totalExpenses ?? 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Recorded operational costs
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Outstanding</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#fff' }}>
            {formatCurrency(summary?.outstandingInvoices ?? 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Unpaid invoice balances
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Overdue</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#fff' }}>
            {formatCurrency(summary?.overdueInvoices ?? 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Past due date balance
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Net Profit</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <Wallet size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: (summary?.netProfit ?? 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
            {formatCurrency(summary?.netProfit ?? 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Total Revenue - Total Expenses
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1.25rem' }}>
            Financial Overview
          </h3>
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '1rem 0' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '60px',
                backgroundColor: 'var(--primary)',
                borderRadius: '6px 6px 0 0',
                height: `${Math.min(100, Math.max(15, ((summary?.totalRevenue ?? 0) / Math.max(1, (summary?.totalRevenue ?? 0) + (summary?.totalExpenses ?? 0))) * 100))}%`,
                transition: 'height 0.5s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
                Revenue ({formatCurrency(summary?.totalRevenue ?? 0)})
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '60px',
                backgroundColor: 'var(--accent-rose)',
                borderRadius: '6px 6px 0 0',
                height: `${Math.min(100, Math.max(15, ((summary?.totalExpenses ?? 0) / Math.max(1, (summary?.totalRevenue ?? 0) + (summary?.totalExpenses ?? 0))) * 100))}%`,
                transition: 'height 0.5s ease',
                boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)'
              }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
                Expenses ({formatCurrency(summary?.totalExpenses ?? 0)})
              </span>
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/clients" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Plus size={16} />
              <span>Add New Client</span>
            </Link>
            <Link to="/quotes/new" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Plus size={16} />
              <span>Create Quote</span>
            </Link>
            <Link to="/expenses" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Plus size={16} />
              <span>Record Expense</span>
            </Link>
            <Link to="/invoices" className="btn btn-primary" style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}>
              <span>View All Invoices</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
