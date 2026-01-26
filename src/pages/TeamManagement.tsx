import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter as FilterIcon,
  MoreVertical,
  Mail,
  Send,
  X,
  ChevronDown,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { InviteMemberModal } from '../components/team/InviteMemberModal';
import { InviteSuccessModal } from '../components/team/InviteSuccessModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { teamService } from '../services/team.service';
import { Member } from '../types/models.types';

type TabType = 'core' | 'staffs' | 'pending';

export const TeamManagement = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('core');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const [lastInvitationData, setLastInvitationData] = useState<any | null>(null);

  // Check for invite trigger from URL
  useEffect(() => {
    if (searchParams.get('invite') === 'true') {
      setIsInviteModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await teamService.getMembers({
          search: searchQuery || undefined
        });
        if (response.success) {
          setMembers(response.data.members);
        }
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch team members:', err);
        setError('Failed to load team members.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [searchQuery]);

  const coreMembers = members.filter(m => m.role?.role_name.toLowerCase().includes('admin') || m.role?.role_name.toLowerCase().includes('manager'));
  const staffMembers = members.filter(m => !m.role?.role_name.toLowerCase().includes('admin') && !m.role?.role_name.toLowerCase().includes('manager'));

  const handleInviteMember = (data: any) => {
    teamService.inviteMember({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role_id: data.role,
      assigned_location_ids: data.locations,
      assigned_terminal_ids: [],
      custom_message: `Hi ${data.first_name}, you've been invited to join our team on TruePas.`
    }).then(res => {
      if (res.success) {
        handleInviteSuccess(data);
      }
    });
  };

  const handleInviteSuccess = (data: any) => {
    setLastInvitationData(data);
    setIsSuccessModalOpen(true);
    setActiveTab('pending');
  };

  const handleSuccessDone = () => {
    setIsSuccessModalOpen(false);
    setLastInvitationData(null);
  };

  const handleInviteAnother = () => {
    setIsSuccessModalOpen(false);
    setLastInvitationData(null);
    setIsInviteModalOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('admin')) return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
    if (r.includes('manager')) return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
  };

  if (loading && members.length === 0) {
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
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Team Management</h2>
              <p className="text-text-secondary mt-2">
                Manage access rights, user roles, and invitations for your organization securely.
              </p>
            </div>
            <Button
              className="flex items-center gap-2 rounded-full"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <Plus size={16} />
              Invite Member
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-1 border-b border-border">
              <button
                onClick={() => setActiveTab('core')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'core' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                Core Members
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                  {coreMembers.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('staffs')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'staffs' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                Staffs
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                  {staffMembers.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                Pending Invites
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-10 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="secondary" className="flex items-center gap-2 rounded-full">
                <FilterIcon size={16} />
                Filter
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/50">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-8">
            {activeTab === 'core' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {coreMembers.map((member) => (
                  <Link key={member.member_id} to={`${ROUTES.TEAM_MANAGEMENT}/${member.member_id}`} className="block">
                    <Card className="relative cursor-pointer hover:border-primary/50 transition-colors h-full">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold uppercase">
                            {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{member.first_name} {member.last_name}</p>
                            <p className="text-xs text-text-secondary truncate">{member.email}</p>
                          </div>
                        </div>
                        <div>
                          <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border', getRoleBadgeColor(member.role?.role_name || 'Staff'))}>
                            {member.role?.role_name || 'Staff'}
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary">
                          <p>Locations: {member.assigned_locations_count_calculated || 0}</p>
                          <p>Devices: {member.assigned_devices_count_calculated || 0}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'staffs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {staffMembers.map((staff) => (
                  <Link key={staff.member_id} to={`${ROUTES.TEAM_MANAGEMENT}/${staff.member_id}`} className="block">
                    <Card className="relative cursor-pointer hover:border-primary/50 transition-colors h-full">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold uppercase">
                            {staff.first_name.charAt(0)}{staff.last_name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{staff.first_name} {staff.last_name}</p>
                            <p className="text-xs text-text-secondary truncate">{staff.email}</p>
                          </div>
                        </div>
                        <div>
                          <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border', getRoleBadgeColor(staff.role?.role_name || 'Staff'))}>
                            {staff.role?.role_name || 'Staff'}
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary">
                          <p>Locations: {staff.assigned_locations_count_calculated || 0}</p>
                          <p>Devices: {staff.assigned_devices_count_calculated || 0}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
      />

      {lastInvitationData && (
        <InviteSuccessModal
          open={isSuccessModalOpen}
          onClose={handleSuccessDone}
          onInviteAnother={handleInviteAnother}
          invitationData={lastInvitationData}
        />
      )}
    </DashboardLayout>
  );
};
