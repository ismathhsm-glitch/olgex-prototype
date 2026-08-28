import { api } from './axios';
import type { Organization, UpdateOrganizationRequest } from '../types';

export const organizationApi = {
  getCurrent: async (): Promise<Organization> => {
    const response = await api.get<Organization>('/organizations/current');
    return response.data;
  },

  updateCurrent: async (payload: UpdateOrganizationRequest): Promise<Organization> => {
    const response = await api.put<Organization>('/organizations/current', payload);
    return response.data;
  },
};
