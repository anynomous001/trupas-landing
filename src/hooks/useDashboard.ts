/**
 * React Hooks for Dashboard
 * Custom hooks for data fetching and capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import type {
    DashboardSummaryResponse,
    LocationPerformanceResponse,
    LocationPerformanceParams,
    SystemAlertsResponse,
    SystemAlertsParams,
    QuickStatsResponse,
    APIError,
    QuickActions,
    ScopeInfo,
    DashboardCapability,
} from '../types/dashboard.types';
import {
    getDashboardSummary,
    getLocationPerformance,
    getSystemAlerts,
    getQuickStats,
    getErrorMessage,
} from '../lib/dashboardAPI';

// ============================================================================
// useDashboard Hook
// ============================================================================

export interface UseDashboardResult {
    summary: DashboardSummaryResponse['data'] | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    quickActions: QuickActions | null;
    scope: ScopeInfo | null;
}

export function useDashboard(date?: string, timezone?: string): UseDashboardResult {
    const [summary, setSummary] = useState<DashboardSummaryResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDashboardSummary(date, timezone);
            setSummary(response.data);
        } catch (err) {
            const apiError = err as APIError;
            setError(getErrorMessage(apiError));
        } finally {
            setLoading(false);
        }
    }, [date, timezone]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return {
        summary,
        loading,
        error,
        refresh: fetchSummary,
        quickActions: summary?.quick_actions || null,
        scope: summary?.scope || null,
    };
}

// ============================================================================
// useLocationPerformance Hook
// ============================================================================

export interface UseLocationPerformanceResult {
    locations: LocationPerformanceResponse['data'] | null;
    loading: boolean;
    error: string | null;
    refresh: (params?: LocationPerformanceParams) => Promise<void>;
}

export function useLocationPerformance(
    initialParams: LocationPerformanceParams = {}
): UseLocationPerformanceResult {
    const [locations, setLocations] = useState<LocationPerformanceResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState(initialParams);

    const fetchLocations = useCallback(async (newParams?: LocationPerformanceParams) => {
        try {
            setLoading(true);
            setError(null);
            const paramsToUse = newParams || params;
            const response = await getLocationPerformance(paramsToUse);
            setLocations(response.data);
            if (newParams) setParams(newParams);
        } catch (err) {
            const apiError = err as APIError;
            setError(getErrorMessage(apiError));
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchLocations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        locations,
        loading,
        error,
        refresh: fetchLocations,
    };
}

// ============================================================================
// useSystemAlerts Hook
// ============================================================================

export interface UseSystemAlertsResult {
    alerts: SystemAlertsResponse['data'] | null;
    loading: boolean;
    error: string | null;
    refresh: (params?: SystemAlertsParams) => Promise<void>;
}

export function useSystemAlerts(
    initialParams: SystemAlertsParams = {}
): UseSystemAlertsResult {
    const [alerts, setAlerts] = useState<SystemAlertsResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState(initialParams);

    const fetchAlerts = useCallback(async (newParams?: SystemAlertsParams) => {
        try {
            setLoading(true);
            setError(null);
            const paramsToUse = newParams || params;
            const response = await getSystemAlerts(paramsToUse);
            setAlerts(response.data);
            if (newParams) setParams(newParams);
        } catch (err) {
            const apiError = err as APIError;
            setError(getErrorMessage(apiError));
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        fetchAlerts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        alerts,
        loading,
        error,
        refresh: fetchAlerts,
    };
}

// ============================================================================
// useQuickStats Hook
// ============================================================================

export interface UseQuickStatsResult {
    stats: QuickStatsResponse['data'] | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useQuickStats(): UseQuickStatsResult {
    const [stats, setStats] = useState<QuickStatsResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getQuickStats();
            setStats(response.data);
        } catch (err) {
            const apiError = err as APIError;
            setError(getErrorMessage(apiError));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refresh: fetchStats,
    };
}

// ============================================================================
// useCapabilities Hook
// ============================================================================

export interface UseCapabilitiesResult {
    can: (capability: DashboardCapability) => boolean;
    capabilities: DashboardCapability[];
    loading: boolean;
}

export function useCapabilities(): UseCapabilitiesResult {
    // This should integrate with your auth context/store
    // For now, returning a mock implementation
    const [capabilities, setCapabilities] = useState<DashboardCapability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch capabilities from auth context or API
        // For now, using localStorage as example
        const storedCapabilities = localStorage.getItem('user_capabilities');
        if (storedCapabilities) {
            setCapabilities(JSON.parse(storedCapabilities));
        }
        setLoading(false);
    }, []);

    const can = useCallback(
        (capability: DashboardCapability): boolean => {
            return capabilities.includes(capability);
        },
        [capabilities]
    );

    return {
        can,
        capabilities,
        loading,
    };
}

// ============================================================================
// useDashboardWebSocket Hook
// ============================================================================

export interface UseDashboardWebSocketResult {
    isConnected: boolean;
    lastUpdate: any | null;
    error: string | null;
    connect: () => void;
    disconnect: () => void;
}

export function useDashboardWebSocket(enabled: boolean = true): UseDashboardWebSocketResult {
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [wsClient, setWsClient] = useState<any | null>(null);

    useEffect(() => {
        if (!enabled) return;

        // Get token from localStorage or sessionStorage
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (!token) {
            setError('No authentication token found');
            return;
        }

        // Dynamically import WebSocket client to avoid SSR issues
        import('../lib/dashboardWebSocket').then(({ DashboardWebSocket }) => {
            const client = new DashboardWebSocket(token);

            // Set up event handlers
            client.onConnected(() => {
                setIsConnected(true);
                setError(null);
            });

            client.onDisconnected(() => {
                setIsConnected(false);
            });

            client.onError((err) => {
                setError(err);
            });

            client.onUpdate((data) => {
                setLastUpdate(data);
            });

            // Connect
            client.connect();
            setWsClient(client);

            // Cleanup on unmount
            return () => {
                client.disconnect();
            };
        });
    }, [enabled]);

    const connect = useCallback(() => {
        wsClient?.connect();
    }, [wsClient]);

    const disconnect = useCallback(() => {
        wsClient?.disconnect();
    }, [wsClient]);

    return {
        isConnected,
        lastUpdate,
        error,
        connect,
        disconnect,
    };
}
