import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings,
  Plus,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Smartphone,
  Search,
  MoreVertical,
  Wifi,
  WifiOff,
  AlertTriangle,
  Fingerprint,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { EditLocationModal } from '../components/location/EditLocationModal';
import { AddDeviceModal } from '../components/device/AddDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';

interface Terminal {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'warning';
  lastActivity: string;
  checkIns: number;
}

export const LocationDetails = (): JSX.Element => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [terminalFilter, setTerminalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API based on id
  const location = {
    id: 'SF-HQ-001',
    name: 'Main Entrance (SF HQ)',
    status: 'active',
    type: 'Corporate Headquarters',
    address: '123 Tech Blvd, Suite 100 San Francisco, CA 94107',
    manager: {
      name: 'Sarah Jenkins',
      avatar: 'SJ',
    },
    timezone: 'Pacific Time (UTC-8)',
    operatingHours: '09:00 AM - 05:00 PM',
    totalScans: 1240,
    scansTrend: 12,
    successRate: 98.5,
    activeTerminals: 4,
    totalTerminals: 4,
    expectedDailyVolume: 500,
  };

  const terminals: Terminal[] = [
    {
      id: 'T-800-Alpha',
      name: 'T-800-Alpha',
      description: 'Front Desk (Left Side)',
      status: 'online',
      lastActivity: '2m ago',
      checkIns: 342,
    },
    {
      id: 'T-800-Beta',
      name: 'T-800-Beta',
      description: 'Front Desk (Right Side)',
      status: 'online',
      lastActivity: '5m ago',
      checkIns: 289,
    },
    {
      id: 'V-Scanner-01',
      name: 'V-Scanner-01',
      description: 'Employee Entrance',
      status: 'offline',
      lastActivity: '4h ago',
      checkIns: 12,
    },
    {
      id: 'Kiosk-Main-02',
      name: 'Kiosk-Main-02',
      description: 'Lobby Waiting Area',
      status: 'warning',
      lastActivity: '15m ago',
      checkIns: 567,
    },
    {
      id: 'T-800-Gamma',
      name: 'T-800-Gamma',
      description: 'Conference Room A',
      status: 'online',
      lastActivity: '10m ago',
      checkIns: 234,
    },
    {
      id: 'Kiosk-Entrance-03',
      name: 'Kiosk-Entrance-03',
      description: 'Main Entrance',
      status: 'online',
      lastActivity: '1m ago',
      checkIns: 456,
    },
    {
      id: 'V-Scanner-02',
      name: 'V-Scanner-02',
      description: 'Parking Garage',
      status: 'online',
      lastActivity: '8m ago',
      checkIns: 189,
    },
    {
      id: 'T-800-Delta',
      name: 'T-800-Delta',
      description: 'Reception Area',
      status: 'warning',
      lastActivity: '20m ago',
      checkIns: 312,
    },
    {
      id: 'Kiosk-Lobby-04',
      name: 'Kiosk-Lobby-04',
      description: 'Second Floor Lobby',
      status: 'online',
      lastActivity: '3m ago',
      checkIns: 278,
    },
    {
      id: 'V-Scanner-03',
      name: 'V-Scanner-03',
      description: 'Back Entrance',
      status: 'offline',
      lastActivity: '2h ago',
      checkIns: 45,
    },
    {
      id: 'T-800-Epsilon',
      name: 'T-800-Epsilon',
      description: 'Cafeteria',
      status: 'online',
      lastActivity: '5m ago',
      checkIns: 523,
    },
    {
      id: 'Kiosk-Office-05',
      name: 'Kiosk-Office-05',
      description: 'Third Floor Office',
      status: 'online',
      lastActivity: '12m ago',
      checkIns: 167,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'online':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/50">
            {status === 'active' ? 'Active' : 'ONLINE'}
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/50">
            OFFLINE
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">
            WARNING
          </span>
        );
      default:
        return null;
    }
  };

  const getTerminalIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Smartphone className="w-5 h-5 text-text-secondary" />;
    }
  };

  // Extract unique terminal descriptions (entry points) for filter
  const uniqueTerminals = Array.from(
    new Set(terminals.map((terminal) => terminal.description))
  ).sort();

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <Link
            to={ROUTES.LOCATIONS}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Locations</span>
            <span className="text-text-secondary">/</span>
            <span className="text-text-primary">Main Entrance</span>
          </Link>

          {/* Page Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-text-primary">{location.name}</h1>
                {getStatusBadge(location.status)}
              </div>
              <p className="text-text-secondary">
                Location ID: <span className="font-mono text-text-primary">{location.id}</span> •{' '}
                {location.type}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="flex items-center gap-2 rounded-full"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Settings size={16} />
                Settings
              </Button>
              <Button 
                className="flex items-center gap-2 rounded-full"
                onClick={() => setIsAddDeviceModalOpen(true)}
              >
                <Plus size={16} />
                Add Device
              </Button>
            </div>
          </div>

          {/* Location Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  ADDRESS
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-primary">{location.address}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  MANAGER
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                    {location.manager.avatar}
                  </div>
                  <span className="text-sm text-text-primary">{location.manager.name}</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  OPERATING HOURS
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <p className="text-sm text-text-primary">
                    {location.operatingHours} 
                    <br></br>
                    ({location.timezone})
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Scans */}
            <Card className="relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-5">
                <Fingerprint className="w-40 h-40 text-gray" />
              </div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-1">Total Scans (Today)</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {location.totalScans.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>↑ {location.scansTrend}% vs yesterday</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10">
                  <Fingerprint className="w-6 h-6 text-white" />
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
                  <p className="text-3xl font-bold text-text-primary">{location.successRate}%</p>
                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${location.successRate}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            {/* Active Devices */}
            <Card className="relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute -top-4 -right-4 opacity-10 dark:opacity-5">
                <Smartphone className="w-40 h-40 text-gray " />
              </div>
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-secondary mb-1">Active Devices</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {location.activeTerminals} /{location.totalTerminals}
                  </p>
                  <p className="text-sm text-green-500 mt-2">All systems operational</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Devices Section */}
          <Card>
            <div className="space-y-4 flex flex-col h-[600px]">
              <div className="flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold text-text-primary">Installed Devices</h3>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Filter Dropdown */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none z-10" />
                  <select
                    value={terminalFilter}
                    onChange={(e) => setTerminalFilter(e.target.value)}
                    className={cn(
                      'h-11 pl-10 pr-10 rounded-lg border border-border bg-background',
                      'text-text-primary text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                      'appearance-none cursor-pointer'
                    )}
                  >
                    <option value="all">All Terminals</option>
                    {uniqueTerminals.map((terminalName) => (
                      <option key={terminalName} value={terminalName}>
                        {terminalName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <Input
                      placeholder="Search by ID or Name..."
                      className="pl-10 bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Devices Table */}
              <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                        Device
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                        Last Activity
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                        Check-ins
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">
                        Options
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {terminals
                      .filter((terminal) => {
                        // Filter by terminal/entry point
                        if (terminalFilter !== 'all' && terminal.description !== terminalFilter) {
                          return false;
                        }
                        // Filter by search query
                        if (searchQuery) {
                          const query = searchQuery.toLowerCase();
                          return (
                            terminal.id.toLowerCase().includes(query) ||
                            terminal.name.toLowerCase().includes(query) ||
                            terminal.description.toLowerCase().includes(query)
                          );
                        }
                        return true;
                      })
                      .map((terminal) => (
                      <tr
                        key={terminal.id}
                        onClick={() => navigate(`${ROUTES.DEVICE_DETAILS.replace(':id', terminal.id)}`)}
                        className="border-b border-border hover:bg-card/50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                              {getTerminalIcon(terminal.status)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">
                                {terminal.name}
                              </p>
                              <p className="text-xs text-text-secondary">{terminal.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(terminal.status)}</td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-text-secondary">{terminal.lastActivity}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-medium text-text-primary">
                            {terminal.checkIns.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Location Modal */}
      <EditLocationModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => {
          console.log('Updated location data:', data);
          // TODO: Update location in store/API
        }}
        onDisable={() => {
          console.log('Disable location');
          // TODO: Handle location disable
          setIsEditModalOpen(false);
        }}
        location={{
          name: location.name,
          address: location.address,
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'US',
          expectedDailyVolume: location.expectedDailyVolume,
          operatingHours: location.operatingHours,
        }}
      />

      {/* Add Device Modal */}
      <AddDeviceModal
        open={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onSubmit={(data) => {
          console.log('Adding new device to location:', data);
          // TODO: Add device to location via API
          setIsAddDeviceModalOpen(false);
        }}
        preselectedLocation={location.name}
      />
    </DashboardLayout>
  );
};

