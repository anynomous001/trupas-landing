import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  ChevronDown,
  MapPin,
  MoreVertical,
  TrendingUp,
  Building2,
  Smartphone,
  FileCheck,
  Wifi,
  BarChart3,
  Settings,
  RotateCw,
  Search,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AddLocationModal } from '../components/location/AddLocationModal';
import { cn } from '../lib/utils';
import { locationService } from '../services/location.service';
import { dashboardService } from '../services/dashboard.service';
import { LocationPerformance, DashboardSummary } from '../types/models.types';

export const Locations = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [locations, setLocations] = useState<LocationPerformance[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const locationsPerPage = 6;

  // Check for add location trigger from URL
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsAddLocationModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchLocationsData = async () => {
      try {
        setLoading(true);
        const [performanceRes, summaryRes] = await Promise.all([
          dashboardService.getLocationPerformance({
            limit: locationsPerPage,
            offset: (currentPage - 1) * locationsPerPage
          }),
          dashboardService.getSummary()
        ]);

        if (performanceRes.success) setLocations(performanceRes.data.locations);
        if (summaryRes.success) setSummary(summaryRes.data);

        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to load locations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationsData();
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'online':
        return { border: 'border-green-500', bg: 'bg-green-500', dot: 'bg-green-500', text: 'text-green-500' };
      case 'maintenance':
        return { border: 'border-yellow-500', bg: 'bg-yellow-500', dot: 'bg-yellow-500', text: 'text-yellow-500' };
      case 'inactive':
      case 'offline':
        return { border: 'border-gray-500', bg: 'bg-gray-500', dot: 'bg-gray-500', text: 'text-gray-500' };
      default:
        return { border: 'border-gray-500', bg: 'bg-gray-500', dot: 'bg-gray-500', text: 'text-gray-500' };
    }
  };

  if (loading && locations.length === 0) {
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
        <div className="space-y-6">
          {/* Title Section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Locations Overview</h2>
              <p className="text-text-secondary mt-2">
                Manage and monitor all your physical business locations.
              </p>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/50">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Locations</p>
                  <p className="text-3xl font-bold text-text-primary">{summary?.summary.total_locations ?? '0'}</p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>{summary?.summary.trends.active_locations_vs_last_week ?? 0}%</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Active Terminals</p>
                  <p className="text-3xl font-bold text-text-primary">{summary?.summary.active_terminals ?? '0'}</p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>{summary?.summary.trends.active_terminals_vs_last_week ?? 0}%</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-purple-500" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Check-ins Today</p>
                  <p className="text-3xl font-bold text-text-primary">{summary?.summary.total_check_ins.toLocaleString() ?? '0'}</p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>{summary?.summary.trends.check_ins_vs_last_week ?? 0}%</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <FileCheck className="w-7 h-7 text-green-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <Input
                  placeholder="Search by location name or ID..."
                  className="pl-10 bg-card"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="flex items-center gap-2 rounded-full"
                onClick={() => setIsAddLocationModalOpen(true)}
              >
                <Plus size={16} />
                Add Location
              </Button>
            </div>
          </div>

          {/* Location Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => {
              const statusColors = getStatusColor(location.status);
              const glassShades = [
                'bg-black/20 backdrop-blur-md border-white/10',
                'bg-black/25 backdrop-blur-md border-white/15',
                'bg-black/30 backdrop-blur-md border-white/20',
              ];
              const glassClass = glassShades[index % glassShades.length];
              return (
                <Link
                  key={location.location_id}
                  to={`/locations/${location.location_id}`}
                  className="block"
                >
                  <Card
                    className={cn(
                      'relative cursor-pointer transition-all duration-300 overflow-hidden h-full',
                      '!bg-transparent backdrop-blur-md',
                      glassClass,
                      'hover:!bg-black/35 hover:border-white/25 hover:shadow-xl hover:shadow-black/20',
                      'dark:!bg-black/40 dark:border-white/10 dark:hover:!bg-black/50 dark:hover:border-white/20'
                    )}
                  >
                    <div className={cn('absolute left-0 top-0 bottom-0 w-1', statusColors.bg)}></div>

                    <button
                      className="absolute top-4 right-4 p-1 text-text-secondary hover:text-text-primary z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('w-2 h-2 rounded-full', statusColors.dot)}></span>
                          <span className={cn('text-sm font-medium capitalize', statusColors.text)}>
                            {location.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary">{location.name}</h3>
                        <p className="text-xs text-text-secondary font-mono">{location.location_id}</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-text-secondary">{location.city}, {location.state}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 dark:border-white/20">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Wifi className="w-4 h-4 text-text-secondary" />
                            <span className="text-xs text-text-secondary">Terms</span>
                          </div>
                          <p className="text-lg font-semibold text-text-primary text-center md:text-left">{location.active_terminals}/{location.total_terminals}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <span className="text-xs text-text-secondary">Check-ins</span>
                          </div>
                          <p className="text-lg font-semibold text-text-primary text-center md:text-left">
                            {location.check_ins.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-text-secondary block mb-1">Success</span>
                          <p
                            className={cn('text-lg font-semibold text-center md:text-left', {
                              'text-green-500': location.success_rate >= 95,
                              'text-yellow-500': location.success_rate >= 90 && location.success_rate < 95,
                              'text-red-500': location.success_rate < 90,
                            })}
                          >
                            {location.success_rate}%
                          </p>
                        </div>
                      </div>

                      <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" className="w-full">
                          Manage Details →
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <p className="text-sm text-text-secondary">
              Showing {locations.length} locations on this page
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={locations.length < locationsPerPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddLocationModal
        open={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSubmit={(data) => {
          locationService.createLocation({
            name: data.name,
            city: data.city,
            state_province: data.state,
            address_line1: data.address,
            location_type: data.type as any,
          }).then(() => {
            setIsAddLocationModalOpen(false);
            window.location.reload();
          });
        }}
      />
    </DashboardLayout>
  );
};
