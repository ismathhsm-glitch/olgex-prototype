import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileCheck,
  CreditCard,
  Receipt,
  BarChart3,
  Building2,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Clients', path: '/clients', icon: Users },
    { label: 'Quotations', path: '/quotes', icon: FileSpreadsheet },
    { label: 'Invoices', path: '/invoices', icon: FileCheck },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Organization', path: '/organization', icon: Building2 },
    { label: 'Client Portal', path: '/portal', icon: ExternalLink },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 40
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
        }}>
          <Receipt size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            OLGAX <span style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>INVOICE</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enterprise SaaS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
          padding: '0.5rem 0.75rem 0.25rem'
        }}>
          Main Navigation
        </div>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} style={{ marginBottom: '0.25rem' }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.875rem',
                    borderRadius: 'var(--radius)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.875rem',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer info */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        OLGAX Invoice System v2.0
      </div>
    </aside>
  );
};
