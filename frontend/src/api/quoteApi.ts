import { api } from './axios';
import type { Quote, CreateQuoteRequest, Invoice } from '../types';

export const quoteApi = {
  getAll: async (): Promise<Quote[]> => {
    const response = await api.get<Quote[]>('/quote');
    return response.data;
  },

  getById: async (id: string): Promise<Quote> => {
    const response = await api.get<Quote>(`/quote/${id}`);
    return response.data;
  },

  create: async (payload: CreateQuoteRequest): Promise<Quote> => {
    const response = await api.post<Quote>('/quote', payload);
    return response.data;
  },

  update: async (id: string, payload: CreateQuoteRequest): Promise<Quote> => {
    const response = await api.put<Quote>(`/quote/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/quote/${id}`);
  },

  convertToInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.post<Invoice>(`/quote/${id}/convert-to-invoice`);
    return response.data;
  },
};
