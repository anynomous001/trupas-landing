import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCw,
  MoreVertical,
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
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { deviceService } from '../services/device.service';
import { Terminal, CheckInLog } from '../types/models.types';

export const DeviceDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<Terminal | null>(null);
  const [activityLogs, setActivityLogs] = useState<CheckInLog[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchDeviceDetails = async () => {
      try {
        setLoading(true);
        const [deviceRes, logsRes] = await Promise.all([
          deviceService.getTerminalById(id),
          deviceService.getTerminalLogs(id)
        ]);

        if (deviceRes.success) setDevice(deviceRes.data);
        if (logsRes.success) setActivityLogs(logsRes.data.logs);

        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch device details:', err);
        setError('Failed to load device details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceDetails();
  }, [id]);

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { dot: 'bg-green-500', text: 'text-green-500', label: 'Active' };
      case 'offline':
        return { dot: 'bg-red-500', text: 'text-red-500', label: 'Offline' };
      case 'maintenance':
        return { dot: 'bg-yellow-500', text: 'text-yellow-500', label: 'Maintenance' };
      default:
        return { dot: 'bg-gray-500', text: 'text-gray-500', label: status };
    }
  };

  const getMethodIcon = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('face')) return <Eye className="w-4 h-4" />;
    if (m.includes('nfc') || m.includes('card')) return <CreditCard className="w-4 h-4" />;
    if (m.includes('qr')) return <QrCode className="w-4 h-4" />;
    if (m.includes('print')) return <Fingerprint className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'granted' || s === 'success') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/50">Granted</span>;
    }
    if (s === 'denied' || s === 'failed') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/50">Denied</span>;
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">Retry</span>;
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

  if (!device) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary">Device Not Found</h2>
          <Button onClick={() => window.history.back()} className="mt-4">Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const statusConfig = getStatusConfig(device.status);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link to={ROUTES.DEVICE_HUB} className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Kiosk Devices</span>
          </Link>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-text-primary">{device.terminal_name}</h2>
            <div className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', statusConfig.dot)}></span>
              <span className={cn('text-sm font-medium', statusConfig.text)}>{statusConfig.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Today's Check-ins</p>
                  <p className="text-3xl font-bold text-text-primary">{device.check_in_count_today.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-text-primary">98.5%</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Last Heartbeat</p>
                  <p className="text-3xl font-bold text-text-primary">{new Date(device.last_heartbeat).toLocaleTimeString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 h-fit">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-text-primary" />
                  <h3 className="text-lg font-semibold text-text-primary">Device Info</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Serial No.</p>
                    <p className="text-sm text-text-primary font-mono">{device.serial_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Device Type</p>
                    <p className="text-sm text-text-primary">{device.device_type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase mb-1">Last Sync</p>
                    <p className="text-sm text-text-primary">{new Date(device.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase">Time</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase">User</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase">Method</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map((log) => (
                        <tr key={log.log_id} className="border-b border-border hover:bg-card/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-text-primary">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                                {log.full_name?.charAt(0) || 'U'}
                              </div>
                              <span className="text-sm text-text-primary">{log.full_name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getMethodIcon(log.method_name)}
                              <span className="text-sm text-text-primary">{log.method_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(log.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
