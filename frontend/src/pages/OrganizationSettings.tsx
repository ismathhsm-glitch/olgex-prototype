import React, { useEffect, useState } from 'react';
import { organizationApi } from '../api/organizationApi';
import type { Organization, UpdateOrganizationRequest } from '../types';
import { Save, CheckCircle } from 'lucide-react';

export const OrganizationSettings: React.FC = () => {
  const [, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateOrganizationRequest>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    taxNumber: '',
    currency: 'USD',
    invoicePrefix: 'INV'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    organizationApi.getCurrent().then((data) => {
      setOrg(data);
      setFormData({
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        website: data.website || '',
        taxNumber: data.taxNumber || '',
        currency: data.currency || 'USD',
        invoicePrefix: data.invoicePrefix || 'INV'
      });
      setLoading(false);
    }).catch((err) => {
      setError(err.response?.data?.message || 'Failed to fetch organization settings.');
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const updated = await organizationApi.updateCurrent(formData);
      setOrg(updated);
      setMessage('Organization settings saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update organization.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading organization settings...</div>;

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Organization Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Configure business branding, currency, tax IDs, and invoice prefixes</p>
      </div>

      {message && (
        <div style={{ backgroundColor: 'var(--status-paid-bg)', color: 'var(--status-paid-text)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: 'var(--status-overdue-bg)', color: 'var(--status-overdue-text)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Organization Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Tax Identification Number</label>
              <input
                type="text"
                value={formData.taxNumber}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Currency</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Invoice Number Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>Business Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Save size={18} />
              <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
