export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export const ENDPOINTS = {
    DASHBOARD: {
        SUMMARY: '/api/v1/dashboard/summary',
        LOCATION_PERFORMANCE: '/api/v1/dashboard/location-performance',
        SYSTEM_ALERTS: '/api/v1/dashboard/system-alerts',
        QUICK_STATS: '/api/v1/dashboard/quick-stats',
    },
    LOCATIONS: {
        BASE: '/api/v1/locations',
        BY_ID: (id: string) => `/api/v1/locations/${id}`,
    },
    TERMINALS: {
        BASE: '/api/v1/terminals',
        BY_ID: (id: string) => `/api/v1/terminals/${id}`,
        RESTART: (id: string) => `/api/v1/terminals/${id}/restart`,
    },
    TEAM: {
        INVITATIONS: '/api/v1/team/invitations',
        INVITATION_DETAILS: (token: string) => `/api/v1/team/invitations/${token}`,
        INVITATION_SETUP: (token: string) => `/api/v1/team/invitations/${token}/setup`,
        MEMBERS: '/api/v1/team/members',
        MEMBER_BY_ID: (id: string) => `/api/v1/team/members/${id}`,
        REVOKE_MEMBER: (id: string) => `/api/v1/team/members/${id}/revoke`,
        REACTIVATE_MEMBER: (id: string) => `/api/v1/team/members/${id}/reactivate`,
        RESEND_INVITATION: (id: string) => `/api/v1/team/invitations/${id}/resend`,
        ASSIGN_LOCATIONS: (id: string) => `/api/v1/team/members/${id}/assign-locations`,
        ASSIGN_DEVICES: (id: string) => `/api/v1/team/members/${id}/assign-devices`,
        CHANGE_ROLE: (id: string) => `/api/v1/team/members/${id}/change-role`,
    },
    ROLES: {
        BASE: '/api/v1/roles',
        BY_ID: (id: string) => `/api/v1/roles/${id}`,
        CAPABILITIES: '/api/v1/capabilities',
    },
    ME: {
        CAPABILITIES: '/api/v1/me/capabilities',
        CAN_PERFORM: '/api/v1/me/can-perform',
    },
    ALERTS: {
        BASE: '/api/v1/alerts',
        ACKNOWLEDGE: (id: string) => `/api/v1/alerts/${id}/acknowledge`,
        RESOLVE: (id: string) => `/api/v1/alerts/${id}/resolve`,
    },
    WS: {
        DASHBOARD: '/ws/dashboard',
    },
};
