export interface DashboardSummary {
    summary: {
        total_check_ins: number;
        success_rate: number;
        active_terminals: number;
        total_terminals: number;
        active_locations: number;
        total_locations: number;
        trends: {
            check_ins_vs_last_week: number;
            success_rate_vs_last_week: number;
            active_terminals_vs_last_week: number;
            active_locations_vs_last_week: number;
        };
    };
    quick_actions: {
        can_add_location: boolean;
        can_add_device: boolean;
        can_invite_member: boolean;
    };
    computed_at: string;
}

export interface LocationPerformance {
    location_id: string;
    name: string;
    city: string;
    state: string;
    check_ins: number;
    success_rate: number;
    active_terminals: number;
    total_terminals: number;
    status: 'online' | 'offline' | 'maintenance';
    alert_count: number;
    last_check_in_at: string;
}

export interface Location {
    location_id: string;
    name: string;
    address?: {
        line1: string;
        line2?: string | null;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        latitude: number;
        longitude: number;
    };
    city: string;
    state: string;
    country: string;
    location_status: 'active' | 'inactive' | 'maintenance';
    operating_hours?: {
        open: string;
        close: string;
        timezone: string;
    };
    performance?: {
        today_check_ins: number;
        today_success_rate: number;
        last_7_days_check_ins: number;
        last_30_days_check_ins: number;
    };
    terminals?: {
        total: number;
        active: number;
        offline: number;
        maintenance: number;
    };
    alerts?: {
        active: number;
        critical: number;
        warning: number;
    };
    team_assigned?: MemberShort[];
    created_at: string;
    last_check_in_at?: string;
}

export interface Terminal {
    terminal_id: string;
    terminal_name: string;
    serial_number: string;
    location_id: string;
    location_name: string;
    device_type: 'kiosk' | 'tablet' | 'embedded' | 'camera_only';
    status: 'active' | 'inactive' | 'offline' | 'maintenance';
    last_heartbeat: string;
    firmware_version: string;
    firmware_update_available: boolean;
    battery_level: number | null;
    network_quality: 'excellent' | 'good' | 'fair' | 'poor';
    check_in_count_today: number;
    alert_count_active: number;
    created_at: string;
}

export interface Member {
    memberId: string;
    merchantId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePhotoUrl?: string;
    role: {
        roleId: string;
        roleName: string;
        roleSlug: string;
        scopeLevel: string;
    };
    scopeLevel?: string;
    isActive: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    lastLoginAt?: string;
    loginCount: number;
    isOnline: boolean;
    createdAt: string;
    locations: string[];
    assignedLocationsCountCalculated?: number;
    assignedDevicesCountCalculated?: number;
    capabilities?: string[];
}

export interface MemberShort {
    memberId: string;
    name: string;
    role: string;
}

export interface Role {
    roleId: string;
    roleName: string;
    roleSlug: string;
    roleType: 'system' | 'custom';
    description: string;
    capabilitiesCount: number;
    memberCount: number;
    isActive: boolean;
    createdAt: string;
}

export interface Capability {
    capability_id: string;
    capability_code: string;
    capability_name: string;
    scope_level: string;
    description: string;
}

export interface Alert {
    alert_id: string;
    severity: 'critical' | 'warning' | 'info';
    type: 'connectivity' | 'firmware' | 'battery' | 'performance' | 'security' | 'system';
    title: string;
    message: string;
    location_name: string;
    terminal_name: string;
    action_required: boolean;
    action_url: string;
    created_at: string;
    acknowledged?: boolean;
    acknowledged_by?: string;
    acknowledged_at?: string;
    resolved?: boolean;
    resolved_by?: string;
    resolved_at?: string;
}

export interface Assignment {
    assignmentId: string;
    locationId?: string;
    terminalId?: string;
    canManage: boolean;
}

export interface AuditLogEntry {
    logId: string;
    action: string;
    resourceType: string;
    status: string;
    timestamp: string;
}

export interface MemberDetailed extends Member {
    locationAssignments: Assignment[];
    terminalAssignments: Assignment[];
    recentActivity: AuditLogEntry[];
}
