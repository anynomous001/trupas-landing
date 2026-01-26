import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  Loader2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { EditLocationModal } from '../components/location/EditLocationModal';
import { AddDeviceModal } from '../components/device/AddDeviceModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { locationService } from '../services/location.service';
import { deviceService } from '../services/device.service';
import { Location, Terminal } from '../types/models.types';

export const LocationDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [terminalFilter, setTerminalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [terminals, setTerminals] = useState<Terminal[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchLocationDetails = async () => {
      try {
        setLoading(true);
        const [locationRes, terminalsRes] = await Promise.all([
          locationService.getLocationById(id),
          deviceService.getTerminals({ location_id: id })
        ]);

        if (locationRes.success) setLocation(locationRes.data);
        if (terminalsRes.success) setTerminals(terminalsRes.data.terminals);

        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch location details:', err);
        setError('Failed to load location details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'active':
      case 'online':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/50 uppercase">
            {s}
          </span>
        );
      case 'offline':
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/50 uppercase">
            {s}
          </span>
        );
      case 'maintenance':
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 uppercase">
            {s}
          </span>
        );
      default:
        return null;
    }
  };

  const getTerminalIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Smartphone className="w-5 h-5 text-text-secondary" />;
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

  if (!location) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-text-primary">Location Not Found</h2>
          <Button onClick={() => navigate(ROUTES.LOCATIONS)} className="mt-4">Back to Locations</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            to={ROUTES.LOCATIONS}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Locations</span>
            <span className="text-text-secondary">/</span>
            <span className="text-text-primary">{location.name}</span>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-text-primary">{location.name}</h1>
                {getStatusBadge(location.status)}
              </div>
              <p className="text-text-secondary">
                Location ID: <span className="font-mono text-text-primary">{location.location_id}</span> •{' '}
                {location.location_type}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase">ADDRESS</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-primary">{location.address_line1}, {location.city}, {location.state_province}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase">META</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-primary">Country: {location.country_code}</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase">LAST UPDATED</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <p className="text-sm text-text-primary">{new Date(location.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="space-y-4 flex flex-col h-[600px]">
              <div className="flex items-center justify-between flex-shrink-0">
                <h3 className="text-lg font-semibold text-text-primary">Installed Devices</h3>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
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

              <div className="overflow-y-auto overflow-x-auto flex-1 min-h-0">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">Device</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">Last Activity</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">Check-ins</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-text-secondary uppercase bg-card">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {terminals.map((terminal) => (
                      <tr
                        key={terminal.terminal_id}
                        onClick={() => navigate(`${ROUTES.DEVICE_DETAILS.replace(':id', terminal.terminal_id)}`)}
                        className="border-b border-border hover:bg-card/50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                              {getTerminalIcon(terminal.status)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">{terminal.terminal_name}</p>
                              <p className="text-xs text-text-secondary">{terminal.serial_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(terminal.status)}</td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-text-secondary">{new Date(terminal.last_heartbeat).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-medium text-text-primary">{terminal.check_in_count_today.toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
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

      <EditLocationModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => {
          locationService.updateLocation(location.location_id, {
            name: data.name,
            address_line1: data.address,
            city: data.city,
            state_province: data.state,
          }).then(() => {
            setIsEditModalOpen(false);
            window.location.reload();
          });
        }}
        onDisable={() => {
          locationService.deleteLocation(location.location_id).then(() => {
            navigate(ROUTES.LOCATIONS);
          });
        }}
        location={{
          name: location.name,
          address: location.address_line1,
          city: location.city,
          state: location.state_province,
          postalCode: '',
          country: location.country_code,
          expectedDailyVolume: 0,
          operatingHours: '',
        }}
      />

      <AddDeviceModal
        open={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onSubmit={(data) => {
          deviceService.createTerminal({
            location_id: location.location_id,
            terminal_name: data.name,
            serial_number: data.serialNumber,
            device_type: data.type as any,
          }).then(() => {
            setIsAddDeviceModalOpen(false);
            window.location.reload();
          });
        }}
        preselectedLocation={location.name}
      />
    </DashboardLayout>
  );
};
