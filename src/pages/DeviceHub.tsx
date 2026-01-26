import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  WifiOff,
  Fingerprint,
  Activity,
  Loader2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AddDeviceModal } from '../components/device/AddDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { deviceService } from '../services/device.service';
import { dashboardService } from '../services/dashboard.service';
import { Terminal, DashboardSummary } from '../types/models.types';

export const DeviceHub = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const devicesPerPage = 8;

  useEffect(() => {
    const fetchDevicesData = async () => {
      try {
        setLoading(true);
        const [terminalsRes, summaryRes] = await Promise.all([
          deviceService.getTerminals({
            limit: devicesPerPage,
            offset: (currentPage - 1) * devicesPerPage
          }),
          dashboardService.getSummary()
        ]);

        if (terminalsRes.success) setTerminals(terminalsRes.data.terminals);
        if (summaryRes.success) setSummary(summaryRes.data);

        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch devices:', err);
        setError('Failed to load devices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevicesData();
  }, [currentPage]);

  const getStatusConfig = (status: Terminal['status']) => {
    switch (status) {
      case 'active':
        return {
          dot: 'bg-green-500',
          text: 'text-green-500',
          icon: Smartphone,
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-500/20',
        };
      case 'offline':
        return {
          dot: 'bg-red-500',
          text: 'text-red-500',
          icon: WifiOff,
          iconColor: 'text-red-500',
          iconBg: 'bg-red-500/20',
        };
      case 'maintenance':
        return {
          dot: 'bg-yellow-500',
          text: 'text-yellow-500',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-500/20',
        };
      case 'inactive':
        return {
          dot: 'bg-gray-500',
          text: 'text-gray-500',
          icon: WifiOff,
          iconColor: 'text-gray-500',
          iconBg: 'bg-gray-500/20',
        };
      default:
        return {
          dot: 'bg-gray-500',
          text: 'text-gray-500',
          icon: Smartphone,
          iconColor: 'text-gray-500',
          iconBg: 'bg-gray-500/20',
        };
    }
  };

  if (loading && terminals.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link to={ROUTES.DASHBOARD} className="hover:text-text-primary transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-text-primary">Kiosk Device Hub</span>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">Kiosk Device Hub</h1>
            <Button className="flex items-center gap-2 rounded-full" onClick={() => setIsAddDeviceModalOpen(true)}>
              <Plus size={16} />
              Add Device
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Devices</p>
                  <p className="text-3xl font-bold text-text-primary">{summary?.summary.total_terminals ?? '0'}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/30 rounded flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Online</p>
                  <p className="text-3xl font-bold text-green-500">{summary?.summary.active_terminals ?? '0'}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Offline</p>
                  <p className="text-3xl font-bold text-red-500">{(summary?.summary.total_terminals ?? 0) - (summary?.summary.active_terminals ?? 0)}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-red-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Today's Check-ins</p>
                  <p className="text-3xl font-bold text-text-primary">{summary?.summary.total_check_ins.toLocaleString() ?? '0'}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Fingerprint className="w-7 h-7 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <Input
                  placeholder="Search by device ID..."
                  className="pl-10 bg-card"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-card">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Device Cards Grid */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {terminals.map((device) => {
                const statusConfig = getStatusConfig(device.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <Link
                    key={device.terminal_id}
                    to={`${ROUTES.DEVICE_DETAILS.replace(':id', device.terminal_id)}`}
                    className="block"
                  >
                    <Card className="relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors h-full">
                      <div className={cn('absolute left-0 top-0 bottom-0 w-1', statusConfig.dot)}></div>

                      <div className="space-y-4 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', statusConfig.iconBg)}>
                              <StatusIcon className={cn('w-5 h-5', statusConfig.iconColor)} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-mono text-text-secondary truncate">{device.serial_number}</p>
                              <p className="text-sm font-semibold text-text-primary truncate">{device.terminal_name}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn('w-2 h-2 rounded-full', statusConfig.dot)}></span>
                          <span className={cn('text-sm font-medium capitalize', statusConfig.text)}>
                            {device.status}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs text-text-secondary mb-1">CHECK-INS</p>
                          <p className="text-lg font-semibold text-text-primary">
                            {device.check_in_count_today.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-text-secondary mb-1">HEARTBEAT</p>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-text-secondary" />
                            <p className="text-sm text-text-primary truncate">{new Date(device.last_heartbeat).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-text-secondary">
              Showing {terminals.length} devices on this page
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={terminals.length < devicesPerPage}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddDeviceModal
        open={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onSubmit={(data) => {
          deviceService.createTerminal({
            location_id: data.locationId,
            terminal_name: data.name,
            serial_number: data.serialNumber,
            device_type: data.type as any,
          }).then(() => {
            setIsAddDeviceModalOpen(false);
            window.location.reload();
          });
        }}
      />
    </DashboardLayout>
  );
};
