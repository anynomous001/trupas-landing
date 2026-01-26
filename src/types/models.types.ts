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
    member_id: string;
    merchant_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    profile_photo_url?: string;
    role: {
        role_id: string;
        role_name: string;
        role_slug: string;
        scope_level: string;
    };
    scope_level?: string;
    is_active: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    two_factor_enabled: boolean;
    last_login_at?: string;
    login_count: number;
    is_online: boolean;
    created_at: string;
    assigned_locations_count_calculated?: number;
    assigned_devices_count_calculated?: number;
}

export interface MemberShort {
    member_id: string;
    name: string;
    role: string;
}

export interface Role {
    role_id: string;
    role_name: string;
    role_slug: string;
    role_type: 'system' | 'custom';
    description: string;
    capabilities_count: number;
    member_count: number;
    is_active: boolean;
    created_at: string;
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
