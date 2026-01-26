import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Send,
  X,
  ChevronDown,
} from 'lucide-react';
import { teamService } from '../services/team.service';
import { Member } from '../types/models.types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { InviteMemberModal } from '../components/team/InviteMemberModal';
import { InviteSuccessModal } from '../components/team/InviteSuccessModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

type TabType = 'core' | 'staffs' | 'pending';

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
}

export const TeamManagement = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('core');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastInvitationData, setLastInvitationData] = useState<{
    email: string;
    role: 'Admin' | 'Manager' | 'Staff';
    locations: string[];
  } | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await teamService.getMembers({
        search: searchQuery
      });
      setMembers(response.data.members || []);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      // Corrected URL: api instance already prepends /api/v1
      const response = await api.get<any>('/team/invitations');
      if (response.success) {
        setPendingInvitations(response.data.map((inv: any) => ({
          id: inv.invitation_id,
          email: inv.email,
          role: inv.role?.role_name || 'Staff',
          expiresAt: inv.expires_at
        })));
      }
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
    if (activeTab === 'pending') {
      fetchInvitations();
    }
  }, [activeTab, searchQuery]);

  // Check for invite trigger from URL
  useEffect(() => {
    if (searchParams.get('invite') === 'true') {
      setIsInviteModalOpen(true);
      // Remove the query parameter
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const coreMembers = members.filter(
    (m) => m.role?.roleSlug === 'root_user' || m.role?.roleSlug === 'admin' || m.role?.roleSlug === 'manager'
  );

  const staffs = members.filter(
    (m) => m.role?.roleSlug === 'operator' || m.role?.roleSlug === 'viewer'
  );

  const handleInviteMember = async () => {
    // This is handled by InviteMemberModal.onInvite but we can use it to refresh
    fetchInvitations();
  };

  const handleInviteSuccess = (data: any) => {
    // Store invitation data for success modal
    setLastInvitationData({
      email: data.email,
      role: data.role,
      locations: data.locations,
    });
    setIsSuccessModalOpen(true);
    // Switch to pending tab to show the new invitation
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

  const getRoleBadgeColor = (roleSlug: string) => {
    switch (roleSlug) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'manager':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'operator':
      case 'viewer':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      case 'root_user':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const handleResendInvite = async (id: string) => {
    try {
      await teamService.resendInvitation(id);
      alert('Invitation resent successfully');
    } catch (error) {
      console.error('Failed to resend invitation:', error);
    }
  };

  const handleCancelInvite = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this invitation?')) {
      try {
        await teamService.cancelInvitation(id);
        fetchInvitations();
      } catch (error) {
        console.error('Failed to cancel invitation:', error);
      }
    }
  };

  const filteredCoreMembers = coreMembers;
  const filteredStaffs = staffs;
  const filteredPendingInvitations = pendingInvitations;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
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

          {/* Control Bar */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-border">
              <button
                onClick={() => setActiveTab('core')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'core'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
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
                  activeTab === 'staffs'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                Staffs
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                Pending Invites
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                  {pendingInvitations.length}
                </span>
              </button>
            </div>

            {/* Search and Filter Bar */}
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
                <Filter size={16} />
                Filter
              </Button>
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <MoreVertical size={20} />
              </button>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span>Sort by:</span>
                <button className="flex items-center gap-1 text-text-primary hover:text-primary">
                  Location, Name
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-text-secondary font-medium anim-pulse">Loading team members...</p>
              </div>
            ) : (
              <>
                {/* Core Members Section */}
                {activeTab === 'core' && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-text-primary">Core Members</h3>
                      <span className="px-2 py-1 rounded-full bg-card text-xs text-text-secondary border border-border">
                        Managers, Admins
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredCoreMembers.map((member) => (
                        <Link
                          key={member.memberId}
                          to={`${ROUTES.TEAM_MANAGEMENT}/${member.memberId}`}
                          className="block"
                        >
                          <Card className="relative cursor-pointer hover:border-primary/50 transition-colors">
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
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                                  {member.profilePhotoUrl || member.firstName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">
                                    {member.firstName} {member.lastName}
                                  </p>
                                  <p className="text-xs text-text-secondary truncate">{member.email}</p>
                                </div>
                              </div>
                              <div>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                                    getRoleBadgeColor(member.role.roleSlug)
                                  )}
                                >
                                  {member.role.roleName}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-text-secondary uppercase">
                                  Assigned Locations
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {member.locations.map((location, index) => (
                                    <span
                                      key={index}
                                      className="text-xs text-text-secondary bg-card px-2 py-1 rounded border border-border"
                                    >
                                      {location}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Staffs Section */}
                {activeTab === 'staffs' && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-text-primary">Staffs</h3>
                      <span className="px-2 py-1 rounded-full bg-card text-xs text-text-secondary border border-border">
                        General Access
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredStaffs.map((staff) => (
                        <Link
                          key={staff.memberId}
                          to={`${ROUTES.TEAM_MANAGEMENT}/${staff.memberId}`}
                          className="block"
                        >
                          <Card className="relative cursor-pointer hover:border-primary/50 transition-colors">
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
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                  {staff.profilePhotoUrl || staff.firstName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">
                                    {staff.firstName} {staff.lastName}
                                  </p>
                                  <p className="text-xs text-text-secondary truncate">{staff.email}</p>
                                </div>
                              </div>
                              <div>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                                    getRoleBadgeColor(staff.role.roleSlug)
                                  )}
                                >
                                  {staff.role.roleName}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-text-secondary uppercase">
                                  Assigned Locations
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {staff.locations.map((location, index) => (
                                    <span
                                      key={index}
                                      className="text-xs text-text-secondary bg-card px-2 py-1 rounded border border-border"
                                    >
                                      {location}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Invitations Section */}
                {activeTab === 'pending' && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-text-primary">Pending Invitations</h3>
                      <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {pendingInvitations.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPendingInvitations.map((invitation) => (
                        <Card key={invitation.id}>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                                <Mail className="w-5 h-5 text-text-secondary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                  {invitation.email}
                                </p>
                                <p className="text-xs text-text-secondary">
                                  Invited as {invitation.role}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-orange-500">
                                Expires at {new Date(invitation.expiresAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border">
                              <button
                                onClick={() => handleResendInvite(invitation.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-gray-800 transition-colors"
                              >
                                <Send size={16} />
                                <span className="text-sm">Resend</span>
                              </button>
                              <button
                                onClick={() => handleCancelInvite(invitation.id)}
                                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-red-500 hover:bg-red-500/20 transition-colors"
                              >
                                <X size={16} />
                                <span className="text-sm">Cancel</span>
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
        onSuccess={handleInviteSuccess}
      />

      {/* Invite Success Modal */}
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

