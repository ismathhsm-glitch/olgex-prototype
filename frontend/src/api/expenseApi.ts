import { api } from './axios';
import type { Expense, CreateExpenseRequest } from '../types';

export const expenseApi = {
  getAll: async (): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expense');
    return response.data;
  },

  getById: async (id: string): Promise<Expense> => {
    const response = await api.get<Expense>(`/expense/${id}`);
    return response.data;
  },

  create: async (payload: CreateExpenseRequest): Promise<Expense> => {
    const response = await api.post<Expense>('/expense', payload);
    return response.data;
  },

  update: async (id: string, payload: CreateExpenseRequest): Promise<Expense> => {
    const response = await api.put<Expense>(`/expense/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/expense/${id}`);
  },
};
