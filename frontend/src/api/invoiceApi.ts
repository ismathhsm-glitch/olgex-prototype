import { api } from './axios';
import type { Invoice, CreateInvoiceRequest, CreatePaymentRequest, DashboardSummary } from '../types';

export const invoiceApi = {
  getAll: async (): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>('/invoice');
    return response.data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoice/${id}`);
    return response.data;
  },

  create: async (payload: CreateInvoiceRequest): Promise<Invoice> => {
    const response = await api.post<Invoice>('/invoice', payload);
    return response.data;
  },

  update: async (id: string, payload: CreateInvoiceRequest): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoice/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/invoice/${id}`);
  },

  recordPayment: async (invoiceId: string, payload: CreatePaymentRequest): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/invoice/${invoiceId}/payments`, payload);
    return response.data;
  },

  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/invoice/dashboard');
    return response.data;
  },
};
