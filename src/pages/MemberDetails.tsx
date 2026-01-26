import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  XCircle,
  Mail,
  Clock,
  Fingerprint,
  Shield,
  Key,
  UserPlus,
  FileText,
  Check,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { EditMemberModal } from '../components/team/EditMemberModal';
import { DeactivateMemberModal } from '../components/team/DeactivateMemberModal';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';
import { useAuthStore } from '../stores/authStore';

interface Capability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export const MemberDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Determine member data based on ID
  const getMemberData = (memberId?: string) => {
    if (memberId === 'root' || memberId === user?.member_id) {
      if (user) {
        return {
          id: user.member_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role.role_slug.toUpperCase(),
          title: user.role.role_name,
          avatar: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
          addedDate: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          lastLogin: new Date(user.last_login_at).toLocaleString(),
          userId: user.member_id,
          locations: ['All Locations'],
          twoFactorEnabled: user.two_factor_enabled,
          lastIpAddress: 'Session IP',
        };
      }
      return {
        id: 'root',
        name: 'Admin User',
        email: 'admin@truepas.com',
        role: 'ROOT_USER',
        title: 'Root User',
        avatar: 'AU',
        addedDate: 'Jan 15, 2023',
        lastLogin: 'Today, 10:15 AM',
        userId: 'usr_root_001',
        locations: ['All Locations'],
        twoFactorEnabled: true,
        lastIpAddress: '192.168.1.1',
      };
    }
    // Default member data
    return {
      id: memberId || '1',
      name: 'Sarah Jenkins',
      email: 'sarah@company.com',
      role: 'ADMIN',
      title: 'Head of Operations',
      avatar: 'SJ',
      addedDate: 'Oct 24, 2023',
      lastLogin: 'Today, 9:42 AM',
      userId: 'usr_83920_abX92',
      locations: ['Orlando HQ', 'Miami Terminal B', 'New York Office', 'Chicago Branch'],
      twoFactorEnabled: true,
      lastIpAddress: '192.168.1.42',
    };
  };

  const [memberData, setMemberData] = useState(() => getMemberData(id));

  // Update member data when ID changes
  useEffect(() => {
    setMemberData(getMemberData(id));
  }, [id]);

  // Mock data - in real app, this would come from API based on id
  const member = memberData;

  const capabilities: Capability[] = [
    {
      id: '1',
      name: 'Manage Billing',
      description: 'Can view invoices and update payment methods.',
      enabled: true,
    },
    {
      id: '2',
      name: 'Invite Members',
      description: 'Can add new users to the team.',
      enabled: true,
    },
    {
      id: '3',
      name: 'View API Keys',
      description: 'Read-only access to production keys.',
      enabled: true,
    },
    {
      id: '4',
      name: 'Manage Webhooks',
      description: 'Configure endpoint URLs.',
      enabled: true,
    },
    {
      id: '5',
      name: 'Delete Account',
      description: 'Root capability only.',
      enabled: false,
    },
  ];

  const recentActivities = [
    {
      id: '1',
      icon: Key,
      iconColor: 'text-blue-500',
      action: 'Updated API Key configuration',
      time: '2h ago',
    },
    {
      id: '2',
      icon: UserPlus,
      iconColor: 'text-green-500',
      action: 'Invited new member **John Doe**',
      time: '5h ago',
    },
    {
      id: '3',
      icon: FileText,
      iconColor: 'text-purple-500',
      action: 'Downloaded invoice #INV-2023-001',
      time: '1d ago',
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'Admin':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'Manager':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'Staff':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const handleSaveMember = (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Staff';
    locations: string[];
  }) => {
    // Update local state (in real app, this would be an API call)
    setMemberData({
      ...memberData,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: data.role,
      locations: data.locations,
    });
  };

  const handleDeactivateMember = () => {
    // Deactivate member (in real app, this would be an API call)
    // For now, we'll just show a success message or update state
    console.log('Member deactivated:', memberData.name);
    // You could update memberData to include a status field if needed
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <Link
            to={ROUTES.TEAM_MANAGEMENT}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Team</span>
            <span className="text-text-secondary">/</span>
            <span className="text-text-primary">Member Details</span>
          </Link>

          {/* Header with Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Member Details</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-red-500/50 text-red-500 hover:bg-red-500/20 flex items-center gap-2 rounded-full"
                onClick={() => setIsDeactivateModalOpen(true)}
              >
                <XCircle size={16} />
                Revoke Access
              </Button>
              <Button
                className="flex items-center gap-2 rounded-full"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit size={16} />
                Edit Member
              </Button>
            </div>
          </div>

          {/* User Profile Card - Full Width */}
          <Card>
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {member.avatar}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-card"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-text-primary">{member.name}</h3>
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
                      getRoleBadgeColor(member.role)
                    )}
                  >
                    {member.role}
                  </span>
                </div>
                <p className="text-text-secondary mb-4">{member.title}</p>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-text-secondary">
                    <Mail size={14} />
                    <span>{member.email}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-text-secondary">
                    <Clock size={14} />
                    <span>Added {member.addedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Identity & Security (with Recent Activity) */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  {/* Identity & Security Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Fingerprint className="w-5 h-5 text-text-secondary" />
                      <h3 className="text-lg font-semibold text-text-primary">Identity & Security</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            USER ID
                          </p>
                          <p className="text-sm font-mono text-text-primary">{member.userId}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            LAST LOGIN
                          </p>
                          <p className="text-sm text-text-primary">{member.lastLogin}</p>
                        </div>
                      </div>
                      {/* Right Column */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            ROLE
                          </p>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-text-primary">Organization Admin</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-2">
                            ASSIGNED LOCATIONS
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {member.locations.map((location, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full bg-card border border-border text-xs text-text-secondary"
                              >
                                {location}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Section */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', {
                              'bg-blue-500/20': activity.iconColor === 'text-blue-500',
                              'bg-green-500/20': activity.iconColor === 'text-green-500',
                              'bg-purple-500/20': activity.iconColor === 'text-purple-500',
                            })}>
                              <activity.icon className={cn('w-5 h-5', activity.iconColor)} />
                            </div>
                            <p className="text-sm text-text-primary">{activity.action}</p>
                          </div>
                          <p className="text-xs text-text-secondary">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Capabilities */}
            <div>
              <Card className="h-full flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-text-secondary" />
                    <h3 className="text-lg font-semibold text-text-primary">Capabilities</h3>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Effective permissions based on <span className="font-semibold text-text-primary">Admin</span> role.
                  </p>
                  <div className="space-y-4">
                    {capabilities.map((capability) => (
                      <div key={capability.id} className="space-y-1">
                        <div className="flex items-start gap-2">
                          {capability.enabled ? (
                            <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">
                              {capability.name}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              {capability.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button variant="secondary" className="w-full rounded-full">
                      View Full Policy
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Member Modal */}
      <EditMemberModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={{
          id: member.id,
          name: member.name,
          email: member.email,
          role: member.role === 'ADMIN' ? 'Admin' : (member.role as 'Admin' | 'Manager' | 'Staff'),
          locations: member.locations,
          avatar: member.avatar,
        }}
        onSave={handleSaveMember}
      />

      {/* Deactivate Member Modal */}
      <DeactivateMemberModal
        open={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        memberName={member.name}
        onDeactivate={handleDeactivateMember}
      />
    </DashboardLayout>
  );
};

