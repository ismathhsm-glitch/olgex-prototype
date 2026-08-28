import { api } from './axios';
import type { Client, CreateClientRequest } from '../types';

export const clientApi = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/client');
    return response.data;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await api.get<Client>(`/client/${id}`);
    return response.data;
  },

  create: async (payload: CreateClientRequest): Promise<Client> => {
    const response = await api.post<Client>('/client', payload);
    return response.data;
  },

  update: async (id: string, payload: CreateClientRequest): Promise<Client> => {
    const response = await api.put<Client>(`/client/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/client/${id}`);
  },
};
