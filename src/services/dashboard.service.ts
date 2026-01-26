import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { DashboardSummary, LocationPerformance, Alert } from '../types/models.types';

export const dashboardService = {
    getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
        const response = await api.get(ENDPOINTS.DASHBOARD.SUMMARY);
        return response.data;
    },

    getLocationPerformance: async (params?: {
        status?: string;
        sort_by?: string;
        order?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<LocationPerformance>> => {
        const response = await api.get(ENDPOINTS.DASHBOARD.LOCATION_PERFORMANCE, { params });
        return response.data;
    },

    getSystemAlerts: async (params?: {
        severity?: string;
        type?: string;
        acknowledged?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Alert>> => {
        const response = await api.get(ENDPOINTS.DASHBOARD.SYSTEM_ALERTS, { params });
        return response.data;
    },
};
