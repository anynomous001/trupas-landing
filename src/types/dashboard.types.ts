/**
 * Dashboard TypeScript Types
 * Matches backend Pydantic schemas exactly for type safety
 */

// ============================================================================
// Core Dashboard Types
// ============================================================================

export interface DashboardTrends {
    check_ins_vs_last_week: number;
    success_rate_vs_last_week: number;
    active_devices_vs_last_week: number;
    active_locations_vs_last_week: number;
}

export interface DashboardSummary {
    total_check_ins: number;
    success_rate: number;
    active_devices: number;
    total_devices: number;
    active_locations: number;
    total_locations: number;
    trends: DashboardTrends;
}

export interface QuickActions {
    can_add_location: boolean;
    can_add_device: boolean;
    can_invite_member: boolean;
}

export interface ScopeInfo {
    level: 'global' | 'location' | 'terminal';
    assignment_scope: 'location' | 'terminal' | 'both' | 'none';
}

export interface DashboardSummaryData {
    summary: DashboardSummary;
    quick_actions: QuickActions;
    scope: ScopeInfo;
    computed_at: string; // ISO 8601 datetime
}

export interface DashboardSummaryResponse {
    success: boolean;
    data: DashboardSummaryData;
}

// ============================================================================
// Location Performance Types
// ============================================================================

export interface LocationPerformanceItem {
    location_id: string;
    name: string;
    city: string;
    state: string | null;
    country: string;
    check_ins: number;
    success_rate: number;
    active_devices: number;
    total_devices: number;
    status: 'active' | 'inactive' | 'maintenance';
    alert_count: number;
    last_check_in_at: string | null; // ISO 8601 datetime
}

export interface PaginationInfo {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

export interface LocationPerformanceData {
    locations: LocationPerformanceItem[];
    pagination: PaginationInfo;
}

export interface LocationPerformanceResponse {
    success: boolean;
    data: LocationPerformanceData;
}

export interface LocationPerformanceParams {
    limit?: number;
    offset?: number;
    sort_by?: 'name' | 'check_ins' | 'success_rate' | 'active_devices';
    order?: 'asc' | 'desc';
    status?: 'active' | 'inactive' | 'maintenance';
    search?: string;
}

// ============================================================================
// System Alerts Types
// ============================================================================

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertItem {
    alert_id: string;
    severity: AlertSeverity;
    title: string;
    message: string; // XSS-sanitized
    source: string;
    location_id: string | null;
    device_id: string | null;
    acknowledged: boolean;
    acknowledged_by: string | null;
    acknowledged_at: string | null; // ISO 8601 datetime
    created_at: string; // ISO 8601 datetime
}

export interface AlertSummary {
    total: number;
    critical: number;
    warning: number;
    info: number;
    unacknowledged: number;
}

export interface SystemAlertsData {
    alerts: AlertItem[];
    summary: AlertSummary;
    pagination: PaginationInfo;
}

export interface SystemAlertsResponse {
    success: boolean;
    data: SystemAlertsData;
}

export interface SystemAlertsParams {
    limit?: number;
    offset?: number;
    severity?: AlertSeverity;
    acknowledged?: boolean;
    location_id?: string;
}

// ============================================================================
// Quick Stats Types
// ============================================================================

export interface DeviceHealth {
    healthy: number;
    warning: number;
    critical: number;
}

export interface QuickStatsData {
    peak_hour: number; // 0-23
    peak_hour_check_ins: number;
    avg_check_in_duration_ms: number;
    p95_check_in_duration_ms: number;
    unique_users_today: number;
    device_health: DeviceHealth;
    uptime_percentage: number;
}

export interface QuickStatsResponse {
    success: boolean;
    data: QuickStatsData;
}

// ============================================================================
// WebSocket Message Types
// ============================================================================

export type WebSocketMessageType =
    | 'ping'
    | 'pong'
    | 'subscribe'
    | 'unsubscribe'
    | 'update'
    | 'alert'
    | 'acknowledge'
    | 'error'
    | 'connected';

export interface WebSocketMessage {
    type: WebSocketMessageType;
    token?: string;
    data?: any;
    message?: string;
    timestamp?: string;
}

export interface DashboardUpdateMessage extends WebSocketMessage {
    type: 'update';
    data: {
        summary?: Partial<DashboardSummary>;
        location_id?: string;
        alert_id?: string;
    };
}

export interface AlertWebSocketMessage extends WebSocketMessage {
    type: 'alert';
    data: AlertItem;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface APIError {
    detail: string | { error: string;[key: string]: any };
    status?: number;
}

export interface RateLimitError extends APIError {
    detail: {
        error: string;
        retry_after: number;
        limit: number;
        window: number;
    };
}

// ============================================================================
// Utility Types
// ============================================================================

export type SortOrder = 'asc' | 'desc';

export interface DateRangeFilter {
    start_date?: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD
    timezone?: string;
}

// ============================================================================
// User Capabilities
// ============================================================================

export type DashboardCapability =
    | 'dashboard:view'
    | 'dashboard:export'
    | 'locations:view'
    | 'locations:create'
    | 'locations:edit'
    | 'locations:delete'
    | 'devices:view'
    | 'devices:create'
    | 'devices:edit'
    | 'devices:delete'
    | 'team:view'
    | 'team:invite'
    | 'team:edit'
    | 'alerts:view'
    | 'alerts:acknowledge'
    | 'alerts:resolve';

export interface UserCapabilities {
    capabilities: DashboardCapability[];
}
