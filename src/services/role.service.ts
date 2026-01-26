import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse } from '../types/api.types';
import { Role, Capability } from '../types/models.types';

export const roleService = {
    getRoles: async (params?: {
        role_type?: 'system' | 'custom';
        is_active?: boolean;
    }): Promise<ApiResponse<{ roles: Role[]; summary: any }>> => {
        const response = await api.get(ENDPOINTS.ROLES.BASE, { params });
        return response.data;
    },

    createRole: async (data: {
        role_name: string;
        role_slug?: string;
        base_role_id?: string;
        description: string;
        capability_codes: string[];
    }): Promise<ApiResponse<Role>> => {
        const response = await api.post(ENDPOINTS.ROLES.BASE, data);
        return response.data;
    },

    getCapabilities: async (params?: { category?: string }): Promise<ApiResponse<{
        capabilities_by_category: Record<string, Capability[]>;
        total_capabilities: number;
    }>> => {
        const response = await api.get(ENDPOINTS.ROLES.CAPABILITIES, { params });
        return response.data;
    },

    updateRole: async (id: string, data: Partial<{
        role_name: string;
        description: string;
        capability_codes: string[];
    }>): Promise<ApiResponse<Role>> => {
        const response = await api.put(ENDPOINTS.ROLES.BY_ID(id), data);
        return response.data;
    },

    deleteRole: async (id: string): Promise<ApiResponse<{ role_id: string; deleted_at: string }>> => {
        const response = await api.delete(ENDPOINTS.ROLES.BY_ID(id));
        return response.data;
    },

    getMyCapabilities: async (): Promise<ApiResponse<{
        member_id: string;
        role_id: string;
        role_name: string;
        scope_level: string;
        capabilities: string[];
        accessible_resources: any;
        ui_permissions: any;
    }>> => {
        const response = await api.get(ENDPOINTS.ME.CAPABILITIES);
        return response.data;
    },

    canPerform: async (data: {
        capability_code: string;
        resource_id?: string;
    }): Promise<ApiResponse<{
        can_perform: boolean;
        capability_code: string;
        resource_id?: string;
        reason: string;
    }>> => {
        const response = await api.post(ENDPOINTS.ME.CAN_PERFORM, data);
        return response.data;
    },
};
