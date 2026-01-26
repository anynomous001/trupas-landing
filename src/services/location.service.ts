import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse } from '../types/api.types';
import { Location } from '../types/models.types';

export const locationService = {
    createLocation: async (data: Partial<Location>): Promise<ApiResponse<Location>> => {
        const response = await api.post(ENDPOINTS.LOCATIONS.BASE, data);
        return response.data;
    },

    getLocation: async (id: string): Promise<ApiResponse<Location>> => {
        const response = await api.get(ENDPOINTS.LOCATIONS.BY_ID(id));
        return response.data;
    },

    updateLocation: async (id: string, data: Partial<Location>): Promise<ApiResponse<Location>> => {
        const response = await api.put(ENDPOINTS.LOCATIONS.BY_ID(id), data);
        return response.data;
    },

    deleteLocation: async (id: string): Promise<ApiResponse<{ location_id: string; deleted_at: string }>> => {
        const response = await api.delete(ENDPOINTS.LOCATIONS.BY_ID(id));
        return response.data;
    },
};
