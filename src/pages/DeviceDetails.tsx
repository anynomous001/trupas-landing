import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  TrendingUp,
  CheckCircle2,
  Heart,
  MapPin,
  Smartphone,
  Link as LinkIcon,
  Clock,
  ArrowRight,
  User,
  Fingerprint,
  CreditCard,
  QrCode,
  Eye,
  Settings,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { EditDeviceModal } from '../components/device/EditDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';

interface ActivityLog {
  time: string;
  user: {
    name: string;
    id: string;
    avatar?: string;
  };
  method: 'Face ID' | 'NFC Badge' | 'QR Code' | 'Fingerprint';
  status: 'Granted' | 'Denied' | 'Retry';
}

export const DeviceDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [activityFilter, setActivityFilter] = useState<'10' | 'all'>('10');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data - in real app, this would come from API based on id
  const device = {
    id: id || 'T-001',
    status: 'online' as 'online' | 'offline' | 'warning' | 'inactive',
    location: 'Main Lobby - North',
    deviceType: 'Biometric Scanner V4',
    serialNo: 'SN-99882211',
    ipAddress: '192.168.1.45',
    firmware: 'v2.4.1',
    firmwareUpdateAvailable: true,
    lastSync: 'Oct 24, 09:41 AM',
    todayCheckIns: 1240,
    checkInsTrend: 12,
    successRate: 98.5,
    lastHeartbeat: '2m ago',
    latency: '24ms',
  };

  const activityLogs: ActivityLog[] = [
    {
      time: '10:42 AM',
      user: { name: 'Sarah Jenkins', id: '8821', avatar: 'SJ' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:38 AM',
      user: { name: 'Michael Chen', id: '4402', avatar: 'MC' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:35 AM',
      user: { name: 'John Smith', id: '5523', avatar: 'JS' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:32 AM',
      user: { name: 'Lisa Anderson', id: '7789', avatar: 'LA' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:28 AM',
      user: { name: 'Robert Taylor', id: '3344', avatar: 'RT' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:25 AM',
      user: { name: 'Maria Garcia', id: '6677', avatar: 'MG' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:22 AM',
      user: { name: 'James Wilson', id: '8899', avatar: 'JW' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:18 AM',
      user: { name: 'Unknown Visitor', id: 'UK' },
      method: 'Face ID',
      status: 'Denied',
    },
    {
      time: '10:15 AM',
      user: { name: 'Unknown Visitor', id: 'UK' },
      method: 'Face ID',
      status: 'Denied',
    },
    {
      time: '10:12 AM',
      user: { name: 'Patricia Brown', id: '1122', avatar: 'PB' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:08 AM',
      user: { name: 'William Davis', id: '4455', avatar: 'WD' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '10:05 AM',
      user: { name: 'Jennifer Martinez', id: '6678', avatar: 'JM' },
      method: 'Face ID',
      status: 'Retry',
    },
    {
      time: '10:02 AM',
      user: { name: 'Richard Lee', id: '9900', avatar: 'RL' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '09:58 AM',
      user: { name: 'Susan White', id: '2233', avatar: 'SW' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '09:55 AM',
      user: { name: 'Emily Wong', id: '1093', avatar: 'EW' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '09:52 AM',
      user: { name: 'Thomas Harris', id: '5566', avatar: 'TH' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '09:50 AM',
      user: { name: 'Nancy Clark', id: '7788', avatar: 'NC' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '09:48 AM',
      user: { name: 'David Kim', id: '3321', avatar: 'DK' },
      method: 'Face ID',
      status: 'Retry',
    },
    {
      time: '09:45 AM',
      user: { name: 'Christopher Lewis', id: '1123', avatar: 'CL' },
      method: 'Face ID',
      status: 'Granted',
    },
    {
      time: '09:42 AM',
      user: { name: 'Karen Walker', id: '4456', avatar: 'KW' },
      method: 'Face ID',
      status: 'Granted',
    },
  ];

  const totalLogsToday = 1240;
  const logsPerPage = 5;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return {
          dot: 'bg-green-500',
          text: 'text-green-500',
          label: 'Online',
        };
      case 'offline':
        return {
          dot: 'bg-red-500',
          text: 'text-red-500',
          label: 'Offline',
        };
      case 'warning':
        return {
          dot: 'bg-yellow-500',
          text: 'text-yellow-500',
          label: 'Warning',
        };
      case 'inactive':
        return {
          dot: 'bg-gray-500',
          text: 'text-gray-500',
          label: 'Inactive',
        };
      default:
        return {
          dot: 'bg-gray-500',
          text: 'text-gray-500',
          label: 'Unknown',
        };
    }
  };

  const getMethodIcon = (method: ActivityLog['method']) => {
    switch (method) {
      case 'Face ID':
        return <Eye className="w-4 h-4" />;
      case 'NFC Badge':
        return <CreditCard className="w-4 h-4" />;
      case 'QR Code':
        return <QrCode className="w-4 h-4" />;
      case 'Fingerprint':
        return <Fingerprint className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: ActivityLog['status']) => {
    switch (status) {
      case 'Granted':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/50">
            Granted
          </span>
        );
      case 'Denied':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/50">
            Denied
          </span>
        );
      case 'Retry':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">
            Retry
          </span>
        );
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(device.status);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <Link
            to={ROUTES.DEVICE_HUB}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Kiosk Devices</span>
          </Link>

          {/* Device Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">{device.id}</h2>
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', statusConfig.dot)}></span>
                <span className={cn('text-sm font-medium', statusConfig.text)}>{statusConfig.label}</span>
              </div>
            </div>
            <Button
              variant="primary"
              className="flex items-center gap-2 rounded-full"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Settings size={16} />
              Settings
            </Button>
          </div>


          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Check-ins */}
            <Card className="relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-5">
                <div className="w-40 h-40 flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    <User className="w-40 h-40 text-gray" />
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-1">Today's Check-ins</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {device.todayCheckIns.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>+{device.checkInsTrend}% vs yesterday</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10">
                  <div className="flex items-center gap-0.5">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Success Rate */}
            <Card className="relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-5">
                <CheckCircle2 className="w-40 h-40 text-gray" />
              </div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-text-primary">{device.successRate}%</p>
                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${device.successRate}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Last Heartbeat */}
            <Card className="relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-5">
                <Heart className="w-40 h-40 text-gray" />
              </div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-1">Last Heartbeat</p>
                  <p className="text-3xl font-bold text-text-primary">{device.lastHeartbeat}</p>
                  <div className="flex items-center gap-1 mt-2 text-text-secondary text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Latency: {device.latency}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Info Card (Left Column) */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-text-primary" />
                    <h3 className="text-lg font-semibold text-text-primary">Device Info</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Location */}
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-text-secondary" />
                        <p className="text-sm text-text-primary">{device.location}</p>
                      </div>
                    </div>

                    {/* Device Type */}
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Device Type</p>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-text-secondary" />
                        <p className="text-sm text-text-primary">{device.deviceType}</p>
                      </div>
                    </div>

                    {/* Serial No. */}
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Serial No.</p>
                      <p className="text-sm text-text-primary font-mono">{device.serialNo}</p>
                    </div>

                    {/* IP Address */}
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase mb-1">IP Address</p>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-text-secondary" />
                        <p className="text-sm text-text-primary font-mono">{device.ipAddress}</p>
                      </div>
                    </div>

                    {/* Firmware */}
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Firmware</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-text-primary font-mono">{device.firmware}</p>
                        {device.firmwareUpdateAvailable && (
                          <button className="text-xs text-primary hover:underline">
                            Update available
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Last Sync */}
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Last Sync</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-text-secondary" />
                        <p className="text-sm text-text-primary">{device.lastSync}</p>
                      </div>
                    </div>

                    {/* Device Image */}
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Device</p>
                      <div className="w-full h-48 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-border flex items-center justify-center overflow-hidden">
                        <div className="text-center space-y-2">
                          <Smartphone className="w-16 h-16 text-primary mx-auto" />
                          <p className="text-xs text-text-secondary">Device Image</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity (Right Column) */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivityFilter('10')}
                          className={cn(
                            'px-3 py-1 rounded text-sm transition-colors',
                            activityFilter === '10'
                              ? 'bg-primary text-white'
                              : 'bg-card text-text-secondary hover:text-text-primary'
                          )}
                        >
                          Last 10
                        </button>
                        <button
                          onClick={() => setActivityFilter('all')}
                          className={cn(
                            'px-3 py-1 rounded text-sm transition-colors',
                            activityFilter === 'all'
                              ? 'bg-primary text-white'
                              : 'bg-card text-text-secondary hover:text-text-primary'
                          )}
                        >
                          All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activity Table */}
                  <div className="overflow-x-auto overflow-y-auto max-h-[500px] border border-border rounded-lg">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-card z-10">
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                            Time
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                            User
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                            Method
                          </th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityLogs.map((log, index) => (
                          <tr key={index} className="border-b border-border hover:bg-card/50 transition-colors">
                            <td className="py-3 px-4 text-sm text-text-primary">{log.time}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                                  {log.user.avatar || log.user.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm text-text-primary">{log.user.name}</p>
                                  <p className="text-xs text-text-secondary">ID: {log.user.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary">
                                  {getMethodIcon(log.method)}
                                </div>
                                <span className="text-sm text-text-primary">{log.method}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-sm text-text-secondary">
                      Showing {1}-{logsPerPage} of {totalLogsToday} logs today
                    </p>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded border border-border text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeft size={16} />
                      </button>
                      <button className="p-2 rounded border border-border text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <EditDeviceModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => {
          console.log('Updating device:', data);
          setIsEditModalOpen(false);
        }}
        onDeactivate={() => {
          console.log('Deactivating device:', device.id);
          setIsEditModalOpen(false);
        }}
        device={{
          id: device.id,
          location: device.location,
          deviceType: 'kiosk', // Default mock type
          serialNumber: device.serialNo,
          notes: 'Mock notes for device details',
        }}
      />
    </DashboardLayout>
  );
};

