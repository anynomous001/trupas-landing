/**
 * Dashboard API Client
 * Type-safe API calls with automatic JWT injection and error handling
 */

import type {
    DashboardSummaryResponse,
    LocationPerformanceResponse,
    LocationPerformanceParams,
    SystemAlertsResponse,
    SystemAlertsParams,
    QuickStatsResponse,
    APIError,
} from '../types/dashboard.types';
import { API_BASE_URL } from '../config/endpoints';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get JWT token from storage
 */
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
}

/**
 * Build query string from params object
 */
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Generic API fetch with error handling
 */
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Merge with any existing headers
    if (options.headers) {
        const existingHeaders = options.headers as Record<string, string>;
        Object.assign(headers, existingHeaders);
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle non-JSON responses (like 500 errors)
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Handle error responses
        if (!response.ok) {
            const error: APIError = {
                detail: data.detail || 'An error occurred',
                status: response.status,
            };
            throw error;
        }

        return data as T;
    } catch (error) {
        // Re-throw API errors
        if ((error as APIError).detail) {
            throw error;
        }

        // Wrap network errors
        throw {
            detail: error instanceof Error ? error.message : 'Network error',
            status: 0,
        } as APIError;
    }
}

// ============================================================================
// Dashboard API Functions
// ============================================================================

/**
 * Get dashboard summary with metrics and trends
 */
export async function getDashboardSummary(
    date?: string, // YYYY-MM-DD format
    timezone: string = 'UTC'
): Promise<DashboardSummaryResponse> {
    const params: Record<string, string> = { timezone_str: timezone };
    if (date) params.date = date;

    const queryString = buildQueryString(params);
    return apiFetch<DashboardSummaryResponse>(`/api/v1/dashboard/summary${queryString}`);
}

/**
 * Get location performance data with pagination and filtering
 */
export async function getLocationPerformance(
    params: LocationPerformanceParams = {}
): Promise<LocationPerformanceResponse> {
    const queryString = buildQueryString(params);
    return apiFetch<LocationPerformanceResponse>(`/api/v1/dashboard/location-performance${queryString}`);
}

/**
 * Get system alerts with filtering
 */
export async function getSystemAlerts(
    params: SystemAlertsParams = {}
): Promise<SystemAlertsResponse> {
    const queryString = buildQueryString(params);
    return apiFetch<SystemAlertsResponse>(`/api/v1/dashboard/system-alerts${queryString}`);
}

/**
 * Get quick statistics
 */
export async function getQuickStats(): Promise<QuickStatsResponse> {
    return apiFetch<QuickStatsResponse>('/api/v1/dashboard/quick-stats');
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: APIError): boolean {
    return error.status === 429;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: APIError): boolean {
    return error.status === 401;
}

/**
 * Check if error is a permission error
 */
export function isPermissionError(error: APIError): boolean {
    return error.status === 403;
}

/**
 * Get error message from API error
 */
export function getErrorMessage(error: APIError): string {
    if (typeof error.detail === 'string') {
        return error.detail;
    }

    if (error.detail && typeof error.detail === 'object' && 'error' in error.detail) {
        return error.detail.error;
    }

    return 'An unexpected error occurred';
}

/**
 * Get retry-after time from rate limit error
 */
export function getRetryAfter(error: APIError): number | null {
    if (typeof error.detail === 'object' && 'retry_after' in error.detail) {
        return error.detail.retry_after as number;
    }
    return null;
}

// ============================================================================
// Export all
// ============================================================================

export const dashboardAPI = {
    getSummary: getDashboardSummary,
    getLocationPerformance,
    getSystemAlerts,
    getQuickStats,
};

export default dashboardAPI;
