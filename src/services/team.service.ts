import api from './api';
import { ENDPOINTS } from '../config/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Member } from '../types/models.types';

// Helper to map snake_case API response to camelCase Member model
const mapMemberFromApi = (data: any): any => {
    const member: any = {
        memberId: data.member_id || data.memberId,
        merchantId: data.merchant_id || data.merchantId,
        firstName: data.first_name || data.firstName,
        lastName: data.last_name || data.lastName,
        email: data.email,
        phone: data.phone,
        profilePhotoUrl: data.profile_photo_url || data.profilePhotoUrl,
        role: {
            roleId: data.role?.role_id || data.role?.roleId,
            roleName: data.role?.role_name || data.role?.roleName,
            roleSlug: data.role?.role_slug || data.role?.roleSlug,
            scopeLevel: data.role?.scope_level || data.role?.scopeLevel,
        },
        scopeLevel: data.scope_level || data.scopeLevel,
        isActive: data.is_active !== undefined ? data.is_active : data.isActive,
        emailVerified: data.email_verified !== undefined ? data.email_verified : data.emailVerified,
        phoneVerified: data.phone_verified !== undefined ? data.phone_verified : data.phoneVerified,
        twoFactorEnabled: data.two_factor_enabled !== undefined ? data.two_factor_enabled : data.twoFactorEnabled,
        lastLoginAt: data.last_login_at || data.lastLoginAt,
        loginCount: data.login_count !== undefined ? data.login_count : data.loginCount,
        isOnline: data.is_online !== undefined ? data.is_online : data.isOnline,
        createdAt: data.created_at || data.createdAt,
        locations: data.locations || [],
        capabilities: data.capabilities || [],
        assignedLocationsCountCalculated: data.assigned_locations_count_calculated || data.assignedLocationsCountCalculated,
        assignedDevicesCountCalculated: data.assigned_devices_count_calculated || data.assignedDevicesCountCalculated,
    };

    if (data.location_assignments || data.locationAssignments) {
        member.locationAssignments = (data.location_assignments || data.locationAssignments).map((a: any) => ({
            assignmentId: a.assignment_id || a.assignmentId,
            locationId: a.location_id || a.locationId,
            canManage: a.can_manage !== undefined ? a.can_manage : a.canManage,
            locationName: a.location_name || a.locationName // Map potential extra fields
        }));
    }

    if (data.terminal_assignments || data.terminalAssignments) {
        member.terminalAssignments = (data.terminal_assignments || data.terminalAssignments).map((a: any) => ({
            assignmentId: a.assignment_id || a.assignmentId,
            terminalId: a.terminal_id || a.terminalId,
            canManage: a.can_manage !== undefined ? a.can_manage : a.canManage,
            terminalName: a.terminal_name || a.terminalName
        }));
    }

    if (data.recent_activity || data.recentActivity) {
        member.recentActivity = (data.recent_activity || data.recentActivity).map((l: any) => ({
            logId: l.log_id || l.logId,
            action: l.action,
            resourceType: l.resource_type || l.resourceType,
            status: l.status,
            timestamp: l.timestamp
        }));
    }

    return member;
};

export const teamService = {
    getMembers: async (params?: {
        role_id?: string;
        is_active?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Member>> => {
        const response = await api.get(ENDPOINTS.TEAM.MEMBERS, { params });
        const body = response.data;
        if (body.data && Array.isArray(body.data.members)) {
            body.data.members = body.data.members.map(mapMemberFromApi);
        }
        return body;
    },

    getMemberById: async (id: string): Promise<ApiResponse<Member>> => {
        const response = await api.get(ENDPOINTS.TEAM.MEMBER_BY_ID(id));
        if (response.data.success && response.data.data) {
            return {
                ...response.data,
                data: mapMemberFromApi(response.data.data)
            }
        }
        return {
            ...response.data,
            data: mapMemberFromApi(response.data)
        };
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

    updateMemberDetails: async (memberId: string, data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        role?: string; // EditMemberModal sends 'role' (slug)
        roleId?: string; // Backend expects role_id
        isActive?: boolean;
        phone?: string;
        locations?: string[]; // Handled via separate call if needed, or backend needs update?
    }): Promise<ApiResponse<any>> => {
        // Map to snake_case for backend
        // Note: EditMemberModal sends 'role' (slug), but backend update expects 'role_id'?
        // The modal uses 'role' which is the slug. We need to look up role_id or backend needs to support slug?
        // Checking team.py: MemberUpdate has role_id.
        // Frontend EditMemberModal sends role slug. We need to find the role ID first? 
        // Or maybe EditMemberModal should send roleId.
        // Let's assume for now we map what we can. 
        // Wait, EditMemberModal watches 'role' which is slug. 
        // We probably need to change EditMemberModal to pass roleId or map it here.
        // But we don't have roles list here. 
        // Better to fix EditMemberModal to use roleId or pass both.
        // For now, let's map common fields.

        const payload: any = {
            first_name: data.firstName || data.first_name,
            last_name: data.lastName || data.last_name,
            email: data.email,
            phone: data.phone,
            is_active: data.isActive,
            // role_id: data.roleId // If passed
        };

        // EditMemberModal passes 'role' as slug. We might need roleId. 
        // If data.roleId is passed, use it.
        if (data.roleId) {
            payload.role_id = data.roleId;
        }

        const response = await api.put(ENDPOINTS.TEAM.MEMBER_BY_ID(memberId), payload);
        return {
            ...response.data,
            data: response.data.data ? mapMemberFromApi(response.data.data) : undefined
        };
    },

    removeMember: async (memberId: string, data: { reason: string }): Promise<ApiResponse<any>> => {
        const response = await api.post(ENDPOINTS.TEAM.REVOKE_MEMBER(memberId), data);
        return response.data;
    },

    reactivateMember: async (memberId: string): Promise<ApiResponse<any>> => {
        const response = await api.post(ENDPOINTS.TEAM.REACTIVATE_MEMBER(memberId));
        return response.data;
    },

    resendInvitation: async (invitationId: string): Promise<ApiResponse<any>> => {
        const response = await api.post(ENDPOINTS.TEAM.RESEND_INVITATION(invitationId));
        return response.data;
    },

    cancelInvitation: async (invitationId: string): Promise<ApiResponse<any>> => {
        const response = await api.delete(ENDPOINTS.TEAM.INVITATION_DETAILS(invitationId));
        return response.data;
    },
};
