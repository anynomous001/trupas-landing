/**
 * Dashboard Integration Example
 * 
 * This file demonstrates how to integrate the dashboard APIs into your Dashboard component.
 * Replace the hardcoded data in Dashboard.tsx with these hooks.
 */

import { useDashboard, useLocationPerformance, useSystemAlerts, useQuickStats } from '../hooks/useDashboard';

export function DashboardIntegrationExample() {
    // 1. Fetch dashboard summary data
    const {
        summary,           // Contains: total_check_ins, success_rate, active_devices, etc.
        loading: summaryLoading,
        error: summaryError,
        quickActions,      // Contains: can_add_location, can_add_device, can_invite_member
        scope,             // Contains: level, assignment_scope
        refresh: refreshSummary
    } = useDashboard();

    // 2. Fetch location performance data
    const {
        locations: locationData,  // Contains: locations array and pagination info
        loading: locationsLoading,
        error: locationsError,
        refresh: refreshLocations
    } = useLocationPerformance({
        limit: 12,
        sort_by: 'check_ins',
        order: 'desc'
    });

    // 3. Fetch system alerts
    const {
        alerts: alertsData,  // Contains: alerts array, summary, and pagination
        loading: alertsLoading,
        error: alertsError,
        refresh: refreshAlerts
    } = useSystemAlerts({
        limit: 12,
        acknowledged: false  // Only unacknowledged alerts
    });

    // 4. Fetch quick stats (optional)
    const {
        stats,  // Contains: peak_hour, avg_check_in_duration_ms, device_health, etc.
        loading: statsLoading,
        error: statsError,
        refresh: refreshStats
    } = useQuickStats();

    // Handle loading state
    if (summaryLoading || locationsLoading || alertsLoading) {
        return <div>Loading dashboard...</div>;
    }

    // Handle error state
    if (summaryError) {
        return <div>Error loading dashboard: {summaryError}</div>;
    }

    // Access the data
    const dashboardSummary = summary?.summary;
    const locations = locationData?.locations || [];
    const alerts = alertsData?.alerts || [];
    const alertSummary = alertsData?.summary;

    return (
        <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <h3>Total Check-ins</h3>
                    <p>{dashboardSummary?.total_check_ins.toLocaleString()}</p>
                    <span>↑ {dashboardSummary?.trends.check_ins_vs_last_week}% vs last week</span>
                </div>

                <div>
                    <h3>Success Rate</h3>
                    <p>{dashboardSummary?.success_rate.toFixed(1)}%</p>
                    <span>↑ {dashboardSummary?.trends.success_rate_vs_last_week}% vs last week</span>
                </div>

                <div>
                    <h3>Active Devices</h3>
                    <p>{dashboardSummary?.active_devices} / {dashboardSummary?.total_devices}</p>
                    <span>↑ {dashboardSummary?.trends.active_devices_vs_last_week}% vs last week</span>
                </div>

                <div>
                    <h3>Active Locations</h3>
                    <p>{dashboardSummary?.active_locations} / {dashboardSummary?.total_locations}</p>
                    <span>↑ {dashboardSummary?.trends.active_locations_vs_last_week}% vs last week</span>
                </div>
            </div>

            {/* Quick Actions - Based on user capabilities */}
            <div className="quick-actions">
                {quickActions?.can_add_location && (
                    <button>Add Location</button>
                )}
                {quickActions?.can_add_device && (
                    <button>Add Device</button>
                )}
                {quickActions?.can_invite_member && (
                    <button>Invite Member</button>
                )}
            </div>

            {/* Location Performance Table */}
            <div>
                <h2>Location Performance</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Check-ins</th>
                            <th>Success Rate</th>
                            <th>Devices</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((location) => (
                            <tr key={location.location_id}>
                                <td>{location.name}, {location.city}</td>
                                <td>{location.check_ins.toLocaleString()}</td>
                                <td>{location.success_rate.toFixed(1)}%</td>
                                <td>{location.active_devices} / {location.total_devices}</td>
                                <td>{location.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* System Alerts */}
            <div>
                <h2>System Alerts</h2>
                <div>
                    <span>Total: {alertSummary?.total}</span>
                    <span>Critical: {alertSummary?.critical}</span>
                    <span>Warning: {alertSummary?.warning}</span>
                    <span>Info: {alertSummary?.info}</span>
                </div>
                {alerts.map((alert) => (
                    <div key={alert.alert_id} className={`alert-${alert.severity}`}>
                        <h4>{alert.title}</h4>
                        <p>{alert.message}</p>
                        <span>{alert.source} - {new Date(alert.created_at).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* Quick Stats (Optional) */}
            {stats && (
                <div>
                    <h2>Quick Stats</h2>
                    <div>
                        <div>Peak Hour: {stats.peak_hour}:00 ({stats.peak_hour_check_ins} check-ins)</div>
                        <div>Avg Check-in Time: {stats.avg_check_in_duration_ms}ms</div>
                        <div>System Uptime: {stats.uptime_percentage}%</div>
                        <div>
                            Device Health:
                            Healthy: {stats.device_health.healthy},
                            Warning: {stats.device_health.warning},
                            Critical: {stats.device_health.critical}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * INTEGRATION STEPS FOR Dashboard.tsx:
 * 
 * 1. Add imports at the top:
 *    import { useDashboard, useLocationPerformance, useSystemAlerts } from '../hooks/useDashboard';
 * 
 * 2. Add hooks at the beginning of the Dashboard component:
 *    const { summary, loading: summaryLoading, quickActions } = useDashboard();
 *    const { locations: locationData } = useLocationPerformance({ limit: 12, sort_by: 'check_ins', order: 'desc' });
 *    const { alerts: alertsData } = useSystemAlerts({ limit: 12 });
 * 
 * 3. Replace hardcoded data:
 *    - Replace hardcoded `locations` array with: locationData?.locations || []
 *    - Replace hardcoded `alerts` array with: alertsData?.alerts || []
 *    - Use `summary?.summary` for dashboard metrics
 *    - Use `quickActions` for button visibility
 * 
 * 4. Update the summary cards section (lines ~305-372):
 *    - Total Check-ins: summary?.summary.total_check_ins
 *    - Success Rate: summary?.summary.success_rate
 *    - Active Devices: summary?.summary.active_devices / summary?.summary.total_devices
 *    - Active Locations: summary?.summary.active_locations / summary?.summary.total_locations
 *    - Trends: summary?.summary.trends.*
 * 
 * 5. Update Quick Actions buttons (lines ~272-301):
 *    - Show "Invite Member" only if quickActions?.can_invite_member
 *    - Show "Add Terminal" only if quickActions?.can_add_device
 *    - Show "Add Location" only if quickActions?.can_add_location
 * 
 * 6. Add loading states:
 *    if (summaryLoading) return <LoadingSpinner />;
 *    if (summaryError) return <ErrorMessage error={summaryError} />;
 */
