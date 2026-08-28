import React, { useEffect, useState } from 'react';
import { expenseApi } from '../api/expenseApi';
import type { Expense, CreateExpenseRequest } from '../types';
import { ExpenseCategory } from '../types';
import { Receipt, Plus, Search, Trash2, Edit2, X } from 'lucide-react';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState<CreateExpenseRequest>({
    title: '',
    category: ExpenseCategory.Rent,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    description: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseApi.getAll();
      setExpenses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const openCreateModal = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      category: ExpenseCategory.Rent,
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      description: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setFormData({
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      date: new Date(exp.date).toISOString().split('T')[0],
      paymentMethod: exp.paymentMethod,
      description: exp.description || ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      if (editingExpense) {
        await expenseApi.update(editingExpense.id, {
          ...formData,
          category: Number(formData.category) as ExpenseCategory,
          amount: Number(formData.amount),
          date: new Date(formData.date).toISOString()
        });
      } else {
        await expenseApi.create({
          ...formData,
          category: Number(formData.category) as ExpenseCategory,
          amount: Number(formData.amount),
          date: new Date(formData.date).toISOString()
        });
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expenseApi.delete(id);
      fetchExpenses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete expense.');
    }
  };

  const getCategoryLabel = (cat: ExpenseCategory) => {
    const labels = ['Rent', 'Salary', 'Utilities', 'Marketing', 'Transport', 'Software', 'Equipment', 'Other'];
    return labels[cat] || 'Other';
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || e.category.toString() === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>Expenses Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Record and categorize operational business expenses</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Expense</span>
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by expense title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ width: '180px' }}>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="ALL">All Categories</option>
            <option value={ExpenseCategory.Rent.toString()}>Rent</option>
            <option value={ExpenseCategory.Salary.toString()}>Salary</option>
            <option value={ExpenseCategory.Utilities.toString()}>Utilities</option>
            <option value={ExpenseCategory.Marketing.toString()}>Marketing</option>
            <option value={ExpenseCategory.Transport.toString()}>Transport</option>
            <option value={ExpenseCategory.Software.toString()}>Software</option>
            <option value={ExpenseCategory.Equipment.toString()}>Equipment</option>
            <option value={ExpenseCategory.Other.toString()}>Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading expenses...</div>
      ) : filteredExpenses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Receipt size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>No expense records found</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Payment Method</th>
                <th style={{ padding: '1rem' }}>Amount ($)</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{exp.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-draft" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
                      {getCategoryLabel(exp.category)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{exp.paymentMethod}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-rose)' }}>-${exp.amount.toFixed(2)}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button onClick={() => openEditModal(exp)} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="btn btn-danger" style={{ padding: '0.35rem 0.6rem' }} title="Delete">
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

      {isModalOpen && (
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ backgroundColor: 'var(--status-overdue-bg)', color: 'var(--status-overdue-text)', padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Expense Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Office Rent"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) as ExpenseCategory })}
                  >
                    <option value={ExpenseCategory.Rent}>Rent</option>
                    <option value={ExpenseCategory.Salary}>Salary</option>
                    <option value={ExpenseCategory.Utilities}>Utilities</option>
                    <option value={ExpenseCategory.Marketing}>Marketing</option>
                    <option value={ExpenseCategory.Transport}>Transport</option>
                    <option value={ExpenseCategory.Software}>Software</option>
                    <option value={ExpenseCategory.Equipment}>Equipment</option>
                    <option value={ExpenseCategory.Other}>Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#cbd5e1' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Create Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
