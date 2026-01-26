import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Terminal } from '../types/models.types';

export const deviceService = {
    createTerminal: async (data: Partial<Terminal>): Promise<ApiResponse<Terminal>> => {
        const response = await api.post(ENDPOINTS.TERMINALS.BASE, data);
        return response.data;
    },

    getTerminals: async (params?: {
        location_id?: string;
        status?: string;
        search?: string;
        sort_by?: string;
        order?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Terminal>> => {
        const response = await api.get(ENDPOINTS.TERMINALS.BASE, { params });
        return response.data;
    },

    updateTerminal: async (id: string, data: Partial<Terminal>): Promise<ApiResponse<Terminal>> => {
        const response = await api.put(ENDPOINTS.TERMINALS.BY_ID(id), data);
        return response.data;
    },

    restartTerminal: async (id: string, data?: { reason: string }): Promise<ApiResponse<{
        terminal_id: string;
        restart_initiated_at: string;
        estimated_downtime: string;
        status: string;
    }>> => {
        const response = await api.post(ENDPOINTS.TERMINALS.RESTART(id), data);
        return response.data;
    },
};
