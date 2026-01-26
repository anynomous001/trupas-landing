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
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AddLocationModal } from '../components/location/AddLocationModal';
import { cn } from '../lib/utils';

interface Location {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'inactive';
  address: string;
  manager: {
    name: string;
    avatar: string;
  };
  terminals: number;
  checkIns: number;
  successRate: number | null;
}

export const Locations = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const locationsPerPage = 6;

  // Check for add location trigger from URL
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsAddLocationModalOpen(true);
      // Remove the query parameter
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const locations: Location[] = [
    {
      id: 'LOC-8821',
      name: 'Downtown Flagship - NY',
      status: 'active',
      address: '123 Broadway Ave, New York, NY 10013',
      manager: { name: 'Sarah Jenkins', avatar: 'SJ' },
      terminals: 5,
      checkIns: 142,
      successRate: 98.5,
    },
    {
      id: 'LOC-9102',
      name: 'Westside Mall Kiosk',
      status: 'active',
      address: '450 W 33rd St, New York, NY 10001',
      manager: { name: 'Mike Ross', avatar: 'MR' },
      terminals: 2,
      checkIns: 89,
      successRate: 94.1,
    },
    {
      id: 'LOC-7743',
      name: 'Brooklyn Heights',
      status: 'maintenance',
      address: '55 Clark St, Brooklyn, NY 11201',
      manager: { name: 'Elena Fisher', avatar: 'EF' },
      terminals: 3,
      checkIns: 12,
      successRate: null,
    },
    {
      id: 'LOC-3392',
      name: 'SoHo Pop-up',
      status: 'active',
      address: '100 Spring St, New York, NY 10012',
      manager: { name: 'David Lee', avatar: 'DL' },
      terminals: 1,
      checkIns: 345,
      successRate: 99.8,
    },
    {
      id: 'LOC-5510',
      name: 'Midtown East',
      status: 'active',
      address: '885 3rd Ave, New York, NY 10022',
      manager: { name: 'Patrice Evra', avatar: 'PE' },
      terminals: 4,
      checkIns: 210,
      successRate: 77.2,
    },
    {
      id: 'LOC-2201',
      name: 'Financial District',
      status: 'inactive',
      address: '11 Wall St, New York, NY 10005',
      manager: { name: 'Jin Soo', avatar: 'JS' },
      terminals: 0,
      checkIns: 0,
      successRate: 0,
    },
  ];

  const totalLocations = 24;
  const startIndex = (currentPage - 1) * locationsPerPage;
  const endIndex = startIndex + locationsPerPage;
  const currentLocations = locations.slice(0, locationsPerPage); // For demo, showing first 6
  const totalPages = Math.ceil(totalLocations / locationsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return {
          border: 'border-green-500',
          bg: 'bg-green-500',
          dot: 'bg-green-500',
          text: 'text-green-500',
        };
      case 'maintenance':
        return {
          border: 'border-yellow-500',
          bg: 'bg-yellow-500',
          dot: 'bg-yellow-500',
          text: 'text-yellow-500',
        };
      case 'inactive':
        return {
          border: 'border-gray-500',
          bg: 'bg-gray-500',
          dot: 'bg-gray-500',
          text: 'text-gray-500',
        };
      default:
        return {
          border: 'border-gray-500',
          bg: 'bg-gray-500',
          dot: 'bg-gray-500',
          text: 'text-gray-500',
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Title Section */}
          <div>
            <h2 className="text-3xl font-bold text-text-primary">Locations Overview</h2>
            <p className="text-text-secondary mt-2">
              Manage and monitor all your physical business locations.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Locations</p>
                  <p className="text-3xl font-bold text-text-primary">12</p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>↑ 2%</span>
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
                  <p className="text-3xl font-bold text-text-primary">45</p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>↑ 5%</span>
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
                  <p className="text-3xl font-bold text-text-primary">1,240</p>
                  <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                    <TrendingUp size={14} />
                    <span>↑ 12%</span>
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
              <div className="relative">
                <select className="h-10 px-4 pr-8 rounded-full border border-border bg-card text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                  <option>All Regions</option>
                  <option>New York</option>
                  <option>California</option>
                  <option>Texas</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
              </div>
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
            {currentLocations.map((location, index) => {
              const statusColors = getStatusColor(location.status);
              // Different glass shades for variety - using different opacity levels
              const glassShades = [
                'bg-black/20 backdrop-blur-md border-white/10',
                'bg-black/25 backdrop-blur-md border-white/15',
                'bg-black/30 backdrop-blur-md border-white/20',
                'bg-black/20 backdrop-blur-md border-white/10',
                'bg-black/25 backdrop-blur-md border-white/15',
                'bg-black/30 backdrop-blur-md border-white/20',
              ];
              const glassClass = glassShades[index % glassShades.length];
              return (
                <Link
                  key={location.id}
                  to={`/locations/${location.id}`}
                  className="block"
                >
                  <Card
                    className={cn(
                      'relative cursor-pointer transition-all duration-300 overflow-hidden',
                      '!bg-transparent backdrop-blur-md',
                      glassClass,
                      'hover:!bg-black/35 hover:border-white/25 hover:shadow-xl hover:shadow-black/20',
                      'dark:!bg-black/40 dark:border-white/10 dark:hover:!bg-black/50 dark:hover:border-white/20'
                    )}
                  >
                    {/* Vertical Accent Bar */}
                    <div className={cn('absolute left-0 top-0 bottom-0 w-1', statusColors.bg)}></div>

                    {/* More Options Button */}
                    <button
                      className="absolute top-4 right-4 p-1 text-text-secondary hover:text-text-primary z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle more options click
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>

                  <div className="space-y-4">
                    {/* Status and Location ID */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('w-2 h-2 rounded-full', statusColors.dot)}></span>
                        <span className={cn('text-sm font-medium capitalize', statusColors.text)}>
                          {location.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">{location.name}</h3>
                      <p className="text-xs text-text-secondary font-mono">{location.id}</p>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-text-secondary">{location.address}</p>
                    </div>

                    {/* Manager */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                        {location.manager.avatar}
                      </div>
                      <span className="text-sm text-text-secondary">{location.manager.name}</span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 dark:border-white/20">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Wifi className="w-4 h-4 text-text-secondary" />
                          <span className="text-xs text-text-secondary">Terminals</span>
                        </div>
                        <p className="text-lg font-semibold text-text-primary">{location.terminals}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {location.checkIns > 0 && (
                            <BarChart3 className="w-4 h-4 text-primary" />
                          )}
                          <span className="text-xs text-text-secondary">Check-ins</span>
                        </div>
                        <p className="text-lg font-semibold text-text-primary">
                          {location.checkIns.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary block mb-1">Success</span>
                        <p
                          className={cn('text-lg font-semibold', {
                            'text-green-500': location.successRate && location.successRate >= 95,
                            'text-yellow-500':
                              location.successRate && location.successRate >= 90 && location.successRate < 95,
                            'text-red-500': location.successRate && location.successRate < 90,
                            'text-text-secondary': !location.successRate || location.successRate === 0,
                          })}
                        >
                          {location.successRate !== null ? `${location.successRate}%` : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                      {location.status === 'maintenance' ? (
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                          <Settings size={16} />
                          Check Status
                        </Button>
                      ) : location.status === 'inactive' ? (
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                          <RotateCw size={16} />
                          Activate
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          Manage Details →
                        </Button>
                      )}
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
              Showing {startIndex + 1}-{Math.min(endIndex, totalLocations)} of {totalLocations} locations
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
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-card text-text-secondary hover:bg-gray-800 hover:text-text-primary'
                  )}
                >
                  {page}
                </button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      <AddLocationModal
        open={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSubmit={(data) => {
          console.log('New location data:', data);
          // TODO: Add location to store/API
        }}
      />
    </DashboardLayout>
  );
};

