import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  Plus,
  MapPin,
  MapPin as MapPinIcon,
  TrendingUp,
  AlertTriangle,
  Battery,
  Info,
  Filter,
  ArrowRight,
  Users,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AddDeviceModal } from '../components/device/AddDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { useDashboard, useLocationPerformance, useSystemAlerts, useDashboardWebSocket } from '../hooks/useDashboard';

export const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  // Fetch dashboard data from API
  const { summary: apiSummary, loading: summaryLoading, error: summaryError, quickActions } = useDashboard();
  const { locations: apiLocationData, loading: locationsLoading } = useLocationPerformance({
    limit: 12,
    sort_by: 'check_ins',
    order: 'desc'
  });
  const { alerts: apiAlertsData, loading: alertsLoading } = useSystemAlerts({ limit: 12 });

  // Local state for live-updated data
  const [summary, setSummary] = useState(apiSummary);
  const [locationData, setLocationData] = useState(apiLocationData);
  const [alertsData, setAlertsData] = useState(apiAlertsData);

  // Update local state when API data changes
  useEffect(() => {
    if (apiSummary) setSummary(apiSummary);
  }, [apiSummary]);

  useEffect(() => {
    if (apiLocationData) setLocationData(apiLocationData);
  }, [apiLocationData]);

  useEffect(() => {
    if (apiAlertsData) setAlertsData(apiAlertsData);
  }, [apiAlertsData]);

  // WebSocket for real-time updates
  const { isConnected: wsConnected, lastUpdate, error: wsError } = useDashboardWebSocket(true);

  // Merge WebSocket updates with existing data
  useEffect(() => {
    if (!lastUpdate) return;

    if (lastUpdate.type === 'dashboard_update' && lastUpdate.data?.summary) {
      // Update summary metrics in real-time
      setSummary(prev => {
        if (!prev) {
          // Return a skeleton DashboardSummaryData if we don't have one yet
          return {
            summary: lastUpdate.data.summary,
            quick_actions: { can_add_location: true, can_add_device: true, can_invite_member: true },
            scope: { level: 'global', assignment_scope: 'none' },
            computed_at: new Date().toISOString()
          } as any;
        }
        return {
          ...prev,
          summary: {
            ...prev.summary,
            ...lastUpdate.data.summary
          }
        };
      });
    } else if (lastUpdate.type === 'new_alert' && lastUpdate.data) {
      // Add new alert to the top of the list
      setAlertsData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          alerts: [lastUpdate.data, ...prev.alerts].slice(0, 12) // Keep only latest 12
        };
      });
    } else if (lastUpdate.type === 'location_update' && lastUpdate.data) {
      // Update specific location performance
      setLocationData(prev => {
        if (!prev) return prev;
        const updatedLocations = prev.locations.map(loc =>
          loc.location_id === lastUpdate.data.location_id
            ? { ...loc, ...lastUpdate.data }
            : loc
        );
        return { ...prev, locations: updatedLocations };
      });
    }
  }, [lastUpdate]);

  const handleInviteMember = () => {
    navigate(`${ROUTES.TEAM_MANAGEMENT}?invite=true`);
  };

  const handleAddLocation = () => {
    navigate(`${ROUTES.LOCATIONS}?add=true`);
  };

  // Transform API data to component format
  const locations = locationData?.locations.map(loc => ({
    id: loc.location_id,
    name: loc.name,
    checkIns: loc.check_ins,
    successRate: loc.success_rate,
    terminals: { active: loc.active_devices, total: loc.total_devices },
    status: loc.status,
    icon: '📍', // Default icon
  })) || [];

  const alerts = alertsData?.alerts.map(alert => ({
    type: alert.severity === 'critical' ? 'error' as const : alert.severity === 'warning' ? 'warning' as const : 'info' as const,
    icon: alert.severity === 'critical' || alert.severity === 'warning' ? AlertTriangle : Info,
    title: alert.title,
    location: alert.source,
    time: new Date(alert.created_at).toLocaleString(),
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'issues':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/50';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/50';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/50';
      default:
        return 'bg-gray-500/10 border-gray-500/50';
    }
  };

  // Handle loading state
  if (summaryLoading || locationsLoading || alertsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle error state
  if (summaryError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-text-primary font-semibold mb-2">Error loading dashboard</p>
            <p className="text-text-secondary">{summaryError}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboardSummary = summary?.summary;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto w-full space-y-6">
          {/* Dashboard Overview Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Dashboard Overview</h2>
                {/* WebSocket Connection Status */}
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                  wsConnected
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                )}>
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    wsConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  )} />
                  <span className="hidden sm:inline">{wsConnected ? 'Live' : 'Offline'}</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-text-secondary mt-1">Real-time operational status for Oct 24, 2023.</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-2 rounded-full"
                onClick={handleInviteMember}
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Invite Member</span>
                <span className="sm:hidden">Invite</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-2 rounded-full"
                onClick={() => setIsAddDeviceModalOpen(true)}
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Terminal</span>
                <span className="sm:hidden">Terminal</span>
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-2 rounded-full"
                onClick={handleAddLocation}
              >
                <MapPinIcon size={16} />
                <span className="hidden sm:inline">Add Location</span>
                <span className="sm:hidden">Location</span>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Check-ins */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Check-ins</p>
                  <p className="text-2xl font-bold text-text-primary">{dashboardSummary?.total_check_ins.toLocaleString() || '0'}</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (dashboardSummary?.trends.check_ins_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={14} className={(dashboardSummary?.trends.check_ins_vs_last_week ?? 0) < 0 ? "rotate-180" : ""} />
                    <span>{(dashboardSummary?.trends.check_ins_vs_last_week ?? 0) >= 0 ? '↑' : '↓'} {Math.abs(dashboardSummary?.trends.check_ins_vs_last_week || 0).toFixed(1)}% vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </Card>

            {/* Success Rate */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-text-primary">{dashboardSummary?.success_rate.toFixed(1) || '0'}%</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (dashboardSummary?.trends.success_rate_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={14} className={(dashboardSummary?.trends.success_rate_vs_last_week ?? 0) < 0 ? "rotate-180" : ""} />
                    <span>{(dashboardSummary?.trends.success_rate_vs_last_week ?? 0) >= 0 ? '↑' : '↓'} {Math.abs(dashboardSummary?.trends.success_rate_vs_last_week || 0).toFixed(1)}% vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </Card>

            {/* Active Terminals */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Active Terminals</p>
                  <p className="text-2xl font-bold text-text-primary">{dashboardSummary?.active_devices || 0} /{dashboardSummary?.total_devices || 0}</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (dashboardSummary?.trends.active_devices_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={14} className={(dashboardSummary?.trends.active_devices_vs_last_week ?? 0) < 0 ? "rotate-180" : ""} />
                    <span>{(dashboardSummary?.trends.active_devices_vs_last_week ?? 0) >= 0 ? '↑' : '↓'} {Math.abs(dashboardSummary?.trends.active_devices_vs_last_week || 0).toFixed(1)}% vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </Card>

            {/* Active Locations */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Active Locations</p>
                  <p className="text-2xl font-bold text-text-primary">{dashboardSummary?.active_locations || 0} /{dashboardSummary?.total_locations || 0}</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (dashboardSummary?.trends.active_locations_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={14} className={(dashboardSummary?.trends.active_locations_vs_last_week ?? 0) < 0 ? "rotate-180" : ""} />
                    <span>{(dashboardSummary?.trends.active_locations_vs_last_week ?? 0) >= 0 ? '↑' : '↓'} {Math.abs(dashboardSummary?.trends.active_locations_vs_last_week || 0).toFixed(1)}% vs last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Location Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Location Table */}
            <div className="lg:col-span-2">
              <Card className="flex flex-col" style={{ maxHeight: '600px' }}>
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-text-primary">Location Performance</h3>
                  <Link
                    to={ROUTES.LOCATIONS}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View All Locations
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                          Location Name
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                          Check-ins
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                          Success %
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                          Terminals
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations.map((location, index) => (
                        <tr
                          key={index}
                          onClick={() => navigate(ROUTES.LOCATION_DETAILS.replace(':id', location.id))}
                          className="border-b border-border hover:bg-gray-100/5 dark:hover:bg-red-300/5  transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-lg">
                                {location.icon}
                              </div>
                              <span className="text-sm font-medium text-text-primary">
                                {location.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right text-sm text-text-primary">
                            {location.checkIns.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span
                              className={cn('text-sm font-medium', {
                                'text-green-500': location.successRate >= 95,
                                'text-yellow-500': location.successRate >= 90 && location.successRate < 95,
                                'text-red-500': location.successRate < 90,
                              })}
                            >
                              {location.successRate}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-sm text-text-primary">
                            {location.terminals.active}/{location.terminals.total}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span
                              className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                                getStatusColor(location.status)
                              )}
                            >
                              {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* System Alerts Sidebar */}
            <div>
              <Card className="flex flex-col" style={{ maxHeight: '600px' }}>
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h3 className="text-lg font-semibold text-text-primary">System Alerts</h3>
                  <button className="p-1 text-text-secondary hover:text-text-primary">
                    <Filter size={18} />
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-1">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-4 rounded-lg border hover:bg-gray-100/20 dark:hover:bg-card-hover/20 transition-colors cursor-pointer',
                        getAlertColor(alert.type)
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <alert.icon
                          className={cn('w-5 h-5 flex-shrink-0 mt-0.5', {
                            'text-red-500': alert.type === 'error',
                            'text-yellow-500': alert.type === 'warning',
                            'text-blue-500': alert.type === 'info',
                          })}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary mb-1">
                            {alert.title}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {alert.location} - {alert.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Device Modal */}
      <AddDeviceModal
        open={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onSubmit={(data) => {
          console.log('Adding new device:', data);
          // TODO: Add device via API
          setIsAddDeviceModalOpen(false);
        }}
      />
    </DashboardLayout>
  );
};

