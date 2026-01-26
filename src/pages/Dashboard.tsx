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
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AddDeviceModal } from '../components/device/AddDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { dashboardService } from '../services/dashboard.service';
import { DashboardSummary, LocationPerformance, Alert } from '../types/models.types';

export const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [locations, setLocations] = useState<LocationPerformance[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, performanceRes, alertsRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getLocationPerformance(),
          dashboardService.getSystemAlerts()
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (performanceRes.success) setLocations(performanceRes.data.locations);
        if (alertsRes.success) setAlerts(alertsRes.data.alerts);

        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleInviteMember = () => {
    navigate(`${ROUTES.TEAM_MANAGEMENT}?invite=true`);
  };

  const handleAddLocation = () => {
    navigate(`${ROUTES.LOCATIONS}?add=true`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'offline':
      case 'issues':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'connectivity':
      case 'performance':
      case 'security':
      case 'system':
        return AlertTriangle;
      case 'battery':
        return Battery;
      case 'firmware':
        return Info;
      default:
        return Info;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/50';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/50';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/50';
      default:
        return 'bg-gray-500/10 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Error Loading Dashboard</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto w-full space-y-6">
          {/* Dashboard Overview Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Dashboard Overview</h2>
              <p className="text-sm sm:text-base text-text-secondary mt-1">Real-time operational status as of {summary?.computed_at ? new Date(summary.computed_at).toLocaleString() : 'Now'}</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center gap-2 rounded-full"
                onClick={handleInviteMember}
                disabled={!summary?.quick_actions.can_invite_member}
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
                disabled={!summary?.quick_actions.can_add_device}
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Terminal</span>
                <span className="sm:hidden">Terminal</span>
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-2 rounded-full"
                onClick={handleAddLocation}
                disabled={!summary?.quick_actions.can_add_location}
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
                  <p className="text-2xl font-bold text-text-primary">{summary?.summary.total_check_ins.toLocaleString() ?? '0'}</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (summary?.summary.trends.check_ins_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={14} className={cn((summary?.summary.trends.check_ins_vs_last_week ?? 0) < 0 && "rotate-180")} />
                    <span>{Math.abs(summary?.summary.trends.check_ins_vs_last_week ?? 0)}% vs last week</span>
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
                  <p className="text-2xl font-bold text-text-primary">{summary?.summary.success_rate ?? '0'}%</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (summary?.summary.trends.success_rate_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={14} className={cn((summary?.summary.trends.success_rate_vs_last_week ?? 0) < 0 && "rotate-180")} />
                    <span>{Math.abs(summary?.summary.trends.success_rate_vs_last_week ?? 0)}% vs last week</span>
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
                  <p className="text-2xl font-bold text-text-primary">{summary?.summary.active_terminals ?? '0'} / {summary?.summary.total_terminals ?? '0'}</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (summary?.summary.trends.active_terminals_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    <TrendingUp size={14} className={cn((summary?.summary.trends.active_terminals_vs_last_week ?? 0) < 0 && "rotate-180")} />
                    <span>{Math.abs(summary?.summary.trends.active_terminals_vs_last_week ?? 0)}% vs last week</span>
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
                  <p className="text-2xl font-bold text-text-primary">{summary?.summary.active_locations ?? '0'} / {summary?.summary.total_locations ?? '0'}</p>
                  <div className={cn("flex items-center gap-1 mt-2 text-sm", (summary?.summary.trends.active_locations_vs_last_week ?? 0) >= 0 ? "text-green-500" : "text-text-secondary")}>
                    <TrendingUp size={14} className={cn((summary?.summary.trends.active_locations_vs_last_week ?? 0) < 0 && "rotate-180")} />
                    <span>{Math.abs(summary?.summary.trends.active_locations_vs_last_week ?? 0)}% vs last week</span>
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
                      {locations.map((location) => (
                        <tr
                          key={location.location_id}
                          onClick={() => navigate(ROUTES.LOCATION_DETAILS.replace(':id', location.location_id))}
                          className="border-b border-border hover:bg-gray-100/5 dark:hover:bg-red-300/5 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-lg">
                                📍
                              </div>
                              <span className="text-sm font-medium text-text-primary">
                                {location.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right text-sm text-text-primary">
                            {location.check_ins.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span
                              className={cn('text-sm font-medium', {
                                'text-green-500': location.success_rate >= 95,
                                'text-yellow-500': location.success_rate >= 90 && location.success_rate < 95,
                                'text-red-500': location.success_rate < 90,
                              })}
                            >
                              {location.success_rate}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right text-sm text-text-primary">
                            {location.active_terminals}/{location.total_terminals}
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
                  {alerts.map((alert) => {
                    const Icon = getAlertIcon(alert.type);
                    return (
                      <div
                        key={alert.alert_id}
                        className={cn(
                          'p-4 rounded-lg border hover:bg-gray-100/20 dark:hover:bg-card-hover/20 transition-colors cursor-pointer',
                          getAlertColor(alert.severity)
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Icon
                            className={cn('w-5 h-5 flex-shrink-0 mt-0.5', {
                              'text-red-500': alert.severity === 'critical',
                              'text-yellow-500': alert.severity === 'warning',
                              'text-blue-500': alert.severity === 'info',
                            })}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary mb-1">
                              {alert.title}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {alert.location_name} - {new Date(alert.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
          deviceService.createTerminal({
            location_id: data.locationId,
            terminal_name: data.name,
            serial_number: data.serialNumber,
            device_type: data.type as any,
          }).then(() => setIsAddDeviceModalOpen(false));
        }}
      />
    </DashboardLayout>
  );
};
