import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Member } from '../types/models.types';

export const teamService = {
    getMembers: async (params?: {
        role_id?: string;
        is_active?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Member>> => {
        const response = await api.get(ENDPOINTS.TEAM.MEMBERS, { params });
        return response.data;
    },

    getMemberById: async (id: string): Promise<ApiResponse<any>> => {
        const response = await api.get(ENDPOINTS.TEAM.MEMBER_BY_ID(id));
        return response.data;
    },

    inviteMember: async (data: {
        email: string;
        first_name: string;
        last_name: string;
        role_id: string;
        custom_message?: string;
        assigned_location_ids: string[];
        assigned_terminal_ids: string[];
    }): Promise<ApiResponse<any>> => {
        const response = await api.post(ENDPOINTS.TEAM.INVITATIONS, data);
        return response.data;
    },

    getInvitationDetails: async (token: string): Promise<ApiResponse<any>> => {
        const response = await api.get(ENDPOINTS.TEAM.INVITATION_DETAILS(token));
        return response.data;
    },

    setupAccount: async (token: string, data: {
        password: string;
        phone?: string;
    }): Promise<ApiResponse<any>> => {
        const response = await api.post(ENDPOINTS.TEAM.INVITATION_SETUP(token), data);
        return response.data;
    },

    acceptInvite: async (data: {
        invitation_token: string;
        password: string;
        password_confirm: string;
        accept_terms: boolean;
    }): Promise<ApiResponse<any>> => {

        return teamService.setupAccount(data.invitation_token, {
            password: data.password
        });
    },

    assignLocations: async (memberId: string, data: {
        location_ids: string[];
        can_manage: boolean;
        replace_existing: boolean;
    }): Promise<ApiResponse<any>> => {
        const response = await api.post(ENDPOINTS.TEAM.ASSIGN_LOCATIONS(memberId), data);
        return response.data;
    },

    assignDevices: async (memberId: string, data: {
        terminal_ids: string[];
        can_manage: boolean;
        replace_existing: boolean;
    }): Promise<ApiResponse<any>> => {
        const response = await api.post(ENDPOINTS.TEAM.ASSIGN_DEVICES(memberId), data);
        return response.data;
    },

    changeRole: async (memberId: string, data: {
        new_role_id: string;
        reason: string;
    }): Promise<ApiResponse<any>> => {
        const response = await api.put(ENDPOINTS.TEAM.CHANGE_ROLE(memberId), data);
        return response.data;
    },

    removeMember: async (memberId: string, data?: { reason: string }): Promise<ApiResponse<any>> => {
        const response = await api.delete(ENDPOINTS.TEAM.MEMBER_BY_ID(memberId), { data });
        return response.data;
    },
};
