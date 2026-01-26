import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Alert } from '../types/models.types';

export const alertService = {
    getAlerts: async (params?: {
        severity?: string;
        type?: string;
        acknowledged?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Alert>> => {
        const response = await api.get(ENDPOINTS.ALERTS.BASE, { params });
        return response.data;
    },

    acknowledgeAlert: async (id: string, data?: { note: string }): Promise<ApiResponse<Alert>> => {
        const response = await api.post(ENDPOINTS.ALERTS.ACKNOWLEDGE(id), data);
        return response.data;
    },

    resolveAlert: async (id: string, data?: { resolution: string; auto_resolved: boolean }): Promise<ApiResponse<Alert>> => {
        const response = await api.post(ENDPOINTS.ALERTS.RESOLVE(id), data);
        return response.data;
    },
};
