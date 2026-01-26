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
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { InviteMemberModal } from '../components/team/InviteMemberModal';
import { InviteSuccessModal } from '../components/team/InviteSuccessModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/authStore';

type TabType = 'core' | 'staffs' | 'pending';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  locations: string[];
  avatar?: string;
  initials?: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  expiresIn: string;
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

  // Check for invite trigger from URL
  useEffect(() => {
    if (searchParams.get('invite') === 'true') {
      setIsInviteModalOpen(true);
      // Remove the query parameter
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    {
      id: '1',
      email: 'new.member@company.com',
      role: 'Manager',
      expiresIn: '2 days',
    },
    {
      id: '2',
      email: 'finance@company.com',
      role: 'Staff',
      expiresIn: '5 days',
    },
    {
      id: '3',
      email: 'audit.team@external.com',
      role: 'Admin',
      expiresIn: '12 hours',
    },
  ]);

  const user = useAuthStore((state) => state.user);

  const coreMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Marcus Chen',
      email: 'marcus.chen@truepas.com',
      role: 'Admin',
      locations: ['HQ - New York', 'London Branch'],
      avatar: 'MC',
    },
    {
      id: '2',
      name: 'Sarah Miller',
      email: 'sarah.m@truepas.com',
      role: 'Manager',
      locations: ['West Coast Region'],
      avatar: 'SM',
    },
    {
      id: '3',
      name: 'Elena Lou',
      email: 'elena.lou@truepas.com',
      role: 'Admin',
      locations: ['Singapore Office', 'Jakarta'],
      initials: 'EL',
    },
    {
      id: user?.member_id || 'root',
      name: user ? `${user.first_name} ${user.last_name}` : 'Michael Ross',
      email: user?.email || 'michael.r@truepas.com',
      role: user?.role?.role_name || 'Root User',
      locations: ['Global Access'],
      avatar: user ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}` : 'MR',
    },
  ];

  const staffs: TeamMember[] = [
    {
      id: '5',
      name: 'David Kim',
      email: 'david.k@truepas.com',
      role: 'Staff',
      locations: ['Warehouse A'],
      avatar: 'DK',
    },
    {
      id: '6',
      name: 'Jessica Pearson',
      email: 'j.pearson@truepas.com',
      role: 'Staff',
      locations: ['Warehouse B'],
      avatar: 'JP',
    },
  ];

  const handleInviteMember = (data: {
    email: string;
    role: 'Admin' | 'Manager' | 'Staff';
    locations: string[];
  }) => {
    // Add new invitation to the list (in real app, this would be an API call)
    const newInvitation: PendingInvitation = {
      id: Date.now().toString(),
      email: data.email,
      role: data.role,
      expiresIn: '7 days', // Default expiration
    };
    setPendingInvitations([...pendingInvitations, newInvitation]);
  };

  const handleInviteSuccess = (data: {
    email: string;
    role: 'Admin' | 'Manager' | 'Staff';
    locations: string[];
  }) => {
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'Manager':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'Staff':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const filteredCoreMembers = coreMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPendingInvitations = pendingInvitations.filter((invitation) =>
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                      key={member.id}
                      to={`${ROUTES.TEAM_MANAGEMENT}/${member.id}`}
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
                              {member.avatar || member.initials || member.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">
                                {member.name}
                              </p>
                              <p className="text-xs text-text-secondary truncate">{member.email}</p>
                            </div>
                          </div>
                          <div>
                            <span
                              className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                                getRoleBadgeColor(member.role)
                              )}
                            >
                              {member.role}
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
                      key={staff.id}
                      to={`${ROUTES.TEAM_MANAGEMENT}/${staff.id}`}
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
                              {staff.avatar || staff.initials || staff.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">
                                {staff.name}
                              </p>
                              <p className="text-xs text-text-secondary truncate">{staff.email}</p>
                            </div>
                          </div>
                          <div>
                            <span
                              className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                                getRoleBadgeColor(staff.role)
                              )}
                            >
                              {staff.role}
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
                            Expires in {invitation.expiresIn}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-gray-800 transition-colors">
                            <Send size={16} />
                            <span className="text-sm">Resend</span>
                          </button>
                          <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-red-500 hover:bg-red-500/20 transition-colors">
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

