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
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AddDeviceModal } from '../components/device/AddDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';

export const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  const handleInviteMember = () => {
    navigate(`${ROUTES.TEAM_MANAGEMENT}?invite=true`);
  };

  const handleAddLocation = () => {
    navigate(`${ROUTES.LOCATIONS}?add=true`);
  };

  const locations = [
    {
      id: 'orlando-theme-park-a',
      name: 'Orlando Theme Park A',
      checkIns: 4281,
      successRate: 88.2,
      terminals: { active: 45, total: 45 },
      status: 'online',
      icon: '🎢',
    },
    {
      id: 'miami-port-terminal-b',
      name: 'Miami Port Terminal B',
      checkIns: 3842,
      successRate: 98.5,
      terminals: { active: 32, total: 32 },
      status: 'online',
      icon: '🚢',
    },
    {
      id: 'vegas-resort-casino',
      name: 'Vegas Resort & Casino',
      checkIns: 2109,
      successRate: 94.1,
      terminals: { active: 28, total: 30 },
      status: 'maintenance',
      icon: '🎰',
    },
    {
      id: 'lax-terminal-4-gate',
      name: 'LAX Terminal 4 Gate',
      checkIns: 1940,
      successRate: 97.8,
      terminals: { active: 15, total: 15 },
      status: 'online',
      icon: '✈️',
    },
    {
      id: 'austin-convention-ctr',
      name: 'Austin Convention Ctr',
      checkIns: 982,
      successRate: 88.5,
      terminals: { active: 10, total: 12 },
      status: 'issues',
      icon: '🏛️',
    },
    {
      id: 'chicago-downtown-plaza',
      name: 'Chicago Downtown Plaza',
      checkIns: 3256,
      successRate: 96.8,
      terminals: { active: 22, total: 22 },
      status: 'online',
      icon: '🏙️',
    },
    {
      id: 'seattle-tech-hub',
      name: 'Seattle Tech Hub',
      checkIns: 2874,
      successRate: 97.2,
      terminals: { active: 18, total: 18 },
      status: 'online',
      icon: '🌆',
    },
    {
      id: 'boston-harbor-terminal',
      name: 'Boston Harbor Terminal',
      checkIns: 2156,
      successRate: 95.5,
      terminals: { active: 14, total: 14 },
      status: 'online',
      icon: '⚓',
    },
    {
      id: 'denver-airport-gate-12',
      name: 'Denver Airport Gate 12',
      checkIns: 1892,
      successRate: 98.1,
      terminals: { active: 12, total: 12 },
      status: 'online',
      icon: '🛫',
    },
    {
      id: 'phoenix-convention-center',
      name: 'Phoenix Convention Center',
      checkIns: 1654,
      successRate: 92.3,
      terminals: { active: 20, total: 22 },
      status: 'maintenance',
      icon: '🏜️',
    },
    {
      id: 'portland-office-complex',
      name: 'Portland Office Complex',
      checkIns: 1423,
      successRate: 96.7,
      terminals: { active: 16, total: 16 },
      status: 'online',
      icon: '🌲',
    },
    {
      id: 'san-diego-beachfront',
      name: 'San Diego Beachfront',
      checkIns: 1234,
      successRate: 94.8,
      terminals: { active: 8, total: 10 },
      status: 'maintenance',
      icon: '🏖️',
    },
  ];

  const alerts = [
    {
      type: 'error',
      icon: AlertTriangle,
      title: 'Terminal #402 Connectivity Lost',
      location: 'Austin Convention Ctr',
      time: '12 mins ago',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Firmware Update Required',
      location: '5 Terminals at Vegas Resort',
      time: '1 hour ago',
    },
    {
      type: 'warning',
      icon: Battery,
      title: 'Low Battery Warning (15%)',
      location: 'Mobile Terminal #22',
      time: '2 hours ago',
    },
    {
      type: 'info',
      icon: Info,
      title: 'Weekly Report Generated',
      location: 'System',
      time: '4 hours ago',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'High Traffic Detected',
      location: 'Orlando Theme Park A',
      time: '5 hours ago',
    },
    {
      type: 'error',
      icon: AlertTriangle,
      title: 'Device Offline',
      location: 'Miami Port Terminal B - Device #12',
      time: '6 hours ago',
    },
    {
      type: 'info',
      icon: Info,
      title: 'Backup Completed Successfully',
      location: 'System',
      time: '7 hours ago',
    },
    {
      type: 'warning',
      icon: Battery,
      title: 'Low Battery Warning (20%)',
      location: 'LAX Terminal 4 - Device #8',
      time: '8 hours ago',
    },
    {
      type: 'error',
      icon: AlertTriangle,
      title: 'Network Timeout',
      location: 'Chicago Downtown Plaza',
      time: '9 hours ago',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Maintenance Window Scheduled',
      location: 'Phoenix Convention Center',
      time: '10 hours ago',
    },
    {
      type: 'info',
      icon: Info,
      title: 'System Update Available',
      location: 'System',
      time: '12 hours ago',
    },
    {
      type: 'warning',
      icon: Battery,
      title: 'Low Battery Warning (18%)',
      location: 'Seattle Tech Hub - Device #5',
      time: '14 hours ago',
    },
  ];

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

  return (
    <DashboardLayout>
      <div className="p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Dashboard Overview Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Dashboard Overview</h2>
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
                    <p className="text-2xl font-bold text-text-primary">15,247</p>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                      <TrendingUp size={14} />
                      <span>↑ 12% vs last week</span>
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
                    <p className="text-2xl font-bold text-text-primary">98.1%</p>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                      <TrendingUp size={14} />
                      <span>↑ 0.5% vs last week</span>
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
                    <p className="text-2xl font-bold text-text-primary">247 /250</p>
                    <div className="flex items-center gap-1 mt-2 text-yellow-500 text-sm">
                      <TrendingUp size={14} className="rotate-180" />
                      <span>↓ -1% vs last week</span>
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
                    <p className="text-2xl font-bold text-text-primary">12 /12</p>
                    <div className="flex items-center gap-1 mt-2 text-text-secondary text-sm">
                      <span>— 0% vs last week</span>
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

