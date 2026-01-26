import { CheckCircle2 } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface InviteSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onInviteAnother: () => void;
  invitationData: {
    email: string;
    role: 'Admin' | 'Manager' | 'Staff';
    locations: string[];
  };
}

const getRoleLabel = (role: 'Admin' | 'Manager' | 'Staff'): string => {
  switch (role) {
    case 'Admin':
      return 'Administrator';
    case 'Manager':
      return 'Manager';
    case 'Staff':
      return 'Staff';
    default:
      return role;
  }
};

export const InviteSuccessModal = ({
  open,
  onClose,
  onInviteAnother,
  invitationData,
}: InviteSuccessModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="max-w-md"
      showCloseButton={false}
    >
      <div className="space-y-6 mt-4">
        {/* Success Message */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary">
            Invitation sent successfully!
          </h3>
        </div>

        {/* Invitation Details */}
        <Card className="bg-background dark:bg-black dark:border-white/10 border-border p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
              EMAIL
            </p>
            <p className="text-sm text-text-primary">{invitationData.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
              ROLE
            </p>
            <p className="text-sm text-text-primary">{getRoleLabel(invitationData.role)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
              LOCATIONS
            </p>
            <p className="text-sm text-text-primary">
              {invitationData.locations.length > 0
                ? invitationData.locations.join(', ')
                : 'No locations assigned'}
            </p>
          </div>
        </Card>

        {/* Informational Text */}
        <div className="space-y-1 text-center">
          <p className="text-sm text-text-secondary">
            They have 7 days to accept the invitation.
          </p>
          <p className="text-sm text-text-secondary">
            You can track status in Pending Invitations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1"
          >
            Done
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onInviteAnother}
            className="flex-1"
          >
            Invite Another
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

