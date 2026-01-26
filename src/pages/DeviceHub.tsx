import { useState } from 'react';
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
  ScanFace,
  Activity,
  MoreVertical,
  Settings,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AddDeviceModal } from '../components/device/AddDeviceModal';
import { EditDeviceModal } from '../components/device/EditDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';

interface KioskDevice {
  id: string;
  location: string;
  status: 'online' | 'offline' | 'warning' | 'inactive';
  checkIns: number | null;
  heartbeat: string;
}

export const DeviceHub = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<KioskDevice | null>(null);
  const devicesPerPage = 8;

  // Mock data
  const totalDevices = 250;
  const onlineDevices = 245;
  const offlineDevices = 5;
  const todayCheckIns = 15247;

  const devices: KioskDevice[] = [
    {
      id: 'TRM-8842-X',
      location: 'NYC - Lobby A',
      status: 'online',
      checkIns: 432,
      heartbeat: '2m ago',
    },
    {
      id: 'TRM-8843-Y',
      location: 'NYC - Lobby B',
      status: 'online',
      checkIns: 389,
      heartbeat: '1m ago',
    },
    {
      id: 'TRM-9901-Z',
      location: 'SFO - Gate 4',
      status: 'offline',
      checkIns: 12,
      heartbeat: '4h ago',
    },
    {
      id: 'TRM-8850-M',
      location: 'LDN - Warehouse',
      status: 'warning',
      checkIns: 0,
      heartbeat: '15m ago',
    },
    {
      id: 'TRM-7702-X',
      location: 'Storage Room B',
      status: 'inactive',
      checkIns: null,
      heartbeat: '30d ago',
    },
    {
      id: 'TRM-8866-K',
      location: 'NYC - Main Hall',
      status: 'online',
      checkIns: 1240,
      heartbeat: '30s ago',
    },
    {
      id: 'TRM-9915-A',
      location: 'MIA - Front Desk',
      status: 'offline',
      checkIns: 54,
      heartbeat: '2h ago',
    },
    {
      id: 'TRM-8812-P',
      location: 'SFO - Lounge',
      status: 'online',
      checkIns: 892,
      heartbeat: '5m ago',
    },
  ];

  const startIndex = (currentPage - 1) * devicesPerPage;
  const endIndex = startIndex + devicesPerPage;
  const currentDevices = devices.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalDevices / devicesPerPage);

  const getStatusConfig = (status: KioskDevice['status']) => {
    switch (status) {
      case 'online':
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
      case 'warning':
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
            {/* Total Devices */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Devices</p>
                  <p className="text-3xl font-bold text-text-primary">{totalDevices}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/30 rounded flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Online */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Online</p>
                  <p className="text-3xl font-bold text-green-500">{onlineDevices}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
              </div>
            </Card>

            {/* Offline */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Offline</p>
                  <p className="text-3xl font-bold text-red-500">{offlineDevices}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-red-500" />
                </div>
              </div>
            </Card>

            {/* Today's Check-ins */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Today's Check-ins</p>
                  <p className="text-3xl font-bold text-text-primary">{todayCheckIns.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <ScanFace className="w-7 h-7 text-primary" />
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
              {/* Location Filter */}
              <div className="relative">
                <select className="h-10 px-4 pr-8 rounded-lg border border-border bg-card text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                  <option>Location: All</option>
                  <option>NYC</option>
                  <option>SFO</option>
                  <option>MIA</option>
                  <option>LDN</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select className="h-10 px-4 pr-8 rounded-lg border border-border bg-card text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                  <option>Status: All</option>
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Warning</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>

              {/* View Toggle */}
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
              {currentDevices.map((device) => {
                const statusConfig = getStatusConfig(device.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <Link
                    key={device.id}
                    to={`${ROUTES.DEVICE_DETAILS.replace(':id', device.id)}`}
                    className="block"
                  >
                    <Card className="relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                      {/* Vertical Accent Bar */}
                      <div className={cn('absolute left-0 top-0 bottom-0 w-1', statusConfig.dot)}></div>

                      <div className="space-y-4 pl-4">
                        {/* Device Icon and ID */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', statusConfig.iconBg)}>
                              <StatusIcon className={cn('w-5 h-5', statusConfig.iconColor)} />
                            </div>
                            <div>
                              <p className="text-xs font-mono text-text-secondary">{device.id}</p>
                              <p className="text-sm font-semibold text-text-primary">{device.location}</p>
                            </div>
                          </div>

                          <button
                            className="p-1 text-text-secondary hover:text-text-primary transition-colors z-10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingDevice(device);
                            }}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <span className={cn('w-2 h-2 rounded-full', statusConfig.dot)}></span>
                          <span className={cn('text-sm font-medium capitalize', statusConfig.text)}>
                            {device.status}
                          </span>
                        </div>

                        {/* Check-ins */}
                        <div>
                          <p className="text-xs text-text-secondary mb-1">CHECK-INS</p>
                          <p className="text-lg font-semibold text-text-primary">
                            {device.checkIns !== null ? device.checkIns.toLocaleString() : '-'}
                          </p>
                        </div>

                        {/* Heartbeat */}
                        <div>
                          <p className="text-xs text-text-secondary mb-1">HEARTBEAT</p>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-text-secondary" />
                            <p className="text-sm text-text-primary">{device.heartbeat}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* List View (placeholder - can be implemented later) */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {currentDevices.map((device) => {
                const statusConfig = getStatusConfig(device.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <Link
                    key={device.id}
                    to={`${ROUTES.DEVICE_DETAILS.replace(':id', device.id)}`}
                    className="block"
                  >
                    <Card className="relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                      <div className={cn('absolute left-0 top-0 bottom-0 w-1', statusConfig.dot)}></div>
                      <div className="flex items-center justify-between pl-4">
                        <div className="flex items-center gap-4">
                          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', statusConfig.iconBg)}>
                            <StatusIcon className={cn('w-6 h-6', statusConfig.iconColor)} />
                          </div>
                          <div>
                            <p className="text-sm font-mono text-text-secondary">{device.id}</p>
                            <p className="text-base font-semibold text-text-primary">{device.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className={cn('w-2 h-2 rounded-full', statusConfig.dot)}></span>
                            <span className={cn('text-sm font-medium capitalize', statusConfig.text)}>
                              {device.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-text-secondary">CHECK-INS</p>
                            <p className="text-lg font-semibold text-text-primary">
                              {device.checkIns !== null ? device.checkIns.toLocaleString() : '-'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-text-secondary">HEARTBEAT</p>
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-text-secondary" />
                              <p className="text-sm text-text-primary">{device.heartbeat}</p>
                            </div>
                          </div>

                          <button
                            className="p-1 text-text-secondary hover:text-text-primary transition-colors z-10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingDevice(device);
                            }}
                          >
                            <Settings size={18} />
                          </button>
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
              Showing {startIndex + 1}-{Math.min(endIndex, totalDevices)} of {totalDevices} devices
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
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
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
          console.log('Adding new device:', data);
          // In a real app, you'd send this to a backend
          setIsAddDeviceModalOpen(false);
        }}
      />

      {editingDevice && (
        <EditDeviceModal
          open={!!editingDevice}
          onClose={() => setEditingDevice(null)}
          onSubmit={(data) => {
            console.log('Updating device from hub:', data);
            setEditingDevice(null);
          }}
          onDeactivate={() => {
            console.log('Deactivating device from hub:', editingDevice.id);
            setEditingDevice(null);
          }}
          device={{
            id: editingDevice.id,
            location: editingDevice.location,
            deviceType: 'kiosk', // Default mock type
            serialNumber: 'SN-MOCK-123',
            notes: 'Mock notes from device hub',
          }}
        />
      )}
    </DashboardLayout>
  );
};

