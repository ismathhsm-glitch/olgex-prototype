import { api } from './axios';
import type { AuthResponse, UserSummary } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  getMe: async (): Promise<UserSummary> => {
    const response = await api.get<UserSummary>('/auth/me');
    return response.data;
  },
};
