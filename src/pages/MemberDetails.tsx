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
import { Member } from '../types/models.types';
import { teamService } from '../services/team.service';
import { Loader2, AlertCircle } from 'lucide-react';

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
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await teamService.getMemberById(id);
        if (response.success) {
          setMember(response.data);
        } else {
          setError(response.message || 'Failed to fetch member details');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const getRoleBadgeColor = (roleSlug: string) => {
    switch (roleSlug?.toLowerCase()) {
      case 'root_user':
      case 'admin':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'manager':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'staff':
      case 'operator':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const handleSaveMember = (data: any) => {
    // Refresh data after save
    window.location.reload();
  };

  const handleDeactivateMember = () => {
    // For now, just log or refresh
    console.log('Member deactivated:', member?.memberId);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !member) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="bg-red-500/10 border-red-500/50">
            <div className="flex items-center gap-3 text-red-500">
              <AlertCircle size={24} />
              <div>
                <h3 className="font-bold">Error Loading Member</h3>
                <p className="text-sm">{error || 'Member not found'}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 border-red-500/50 text-red-500" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const avatar = `${member.firstName?.charAt(0) || ''}${member.lastName?.charAt(0) || ''}`;
  const addedDate = new Date(member.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const lastLogin = member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString() : 'Never';

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
                  {avatar}
                </div>
                <div className={cn("absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-card", member.isOnline ? "bg-green-500" : "bg-gray-400")}></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-text-primary">{member.firstName} {member.lastName}</h3>
                  <span
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
                      getRoleBadgeColor(member.role?.roleSlug)
                    )}
                  >
                    {member.role?.roleName}
                  </span>
                </div>
                <p className="text-text-secondary mb-4">{member.role?.description}</p>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-text-secondary">
                    <Mail size={14} />
                    <span>{member.email}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-text-secondary">
                    <Clock size={14} />
                    <span>Added {addedDate}</span>
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
                          <p className="text-sm font-mono text-text-primary">{member.memberId}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            LAST LOGIN
                          </p>
                          <p className="text-sm text-text-primary">{lastLogin}</p>
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
                            <span className="text-sm text-text-primary">{member.role?.roleName}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-2">
                            ASSIGNED LOCATIONS
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {member.locationAssignments?.map((assignment: any, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full bg-card border border-border text-xs text-text-secondary"
                              >
                                {assignment.locationName || 'Global'}
                              </span>
                            )) || (
                                <span className="text-sm text-text-secondary italic">No locations assigned</span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Section */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {member.recentActivity?.length > 0 ? member.recentActivity.map((activity: any) => (
                        <div
                          key={activity.logId}
                          className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/20">
                              <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-sm text-text-primary capitalize">
                              {activity.action.split('_').join(' ')}
                            </p>
                          </div>
                          <p className="text-xs text-text-secondary">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      )) : (
                        <p className="text-sm text-text-secondary italic">No recent activity found</p>
                      )}
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
                    Effective permissions based on <span className="font-semibold text-text-primary">{member.role?.roleName}</span> role.
                  </p>
                  <div className="space-y-4">
                    {/* Placeholder for capabilities - in real app, these would come from the role's capability list */}
                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <p className="text-sm text-text-primary mb-2 font-medium">Included Capabilities:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.capabilities?.map((cap: string) => (
                          <span key={cap} className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-mono">
                            {cap}
                          </span>
                        )) || <span className="text-sm text-text-secondary italic">Standard permissions for {member.role?.roleName}</span>}
                      </div>
                    </div>
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

      <EditMemberModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={member}
        onSave={handleSaveMember}
      />

      {/* Deactivate Member Modal */}
      <DeactivateMemberModal
        open={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        memberName={`${member.first_name} ${member.last_name}`}
        onDeactivate={handleDeactivateMember}
      />
    </DashboardLayout>
  );
};

