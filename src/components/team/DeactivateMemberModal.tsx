import { useState } from 'react';
import { AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface DeactivateMemberModalProps {
  open: boolean;
  onClose: () => void;
  memberName: string;
  onDeactivate: () => void;
}

export const DeactivateMemberModal = ({
  open,
  onClose,
  memberName,
  onDeactivate,
}: DeactivateMemberModalProps) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isImpactExpanded, setIsImpactExpanded] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const isConfirmValid = confirmationText.trim().toUpperCase() === 'DEACTIVATE';

  const handleDeactivate = async () => {
    if (!isConfirmValid) return;

    setIsDeactivating(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onDeactivate();
    setIsDeactivating(false);
    handleClose();
  };

  const handleClose = () => {
    if (!isDeactivating) {
      setConfirmationText('');
      setIsImpactExpanded(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Deactivate Member?"
      className="max-w-md"
    >
      <div className="space-y-6 mt-4">
        {/* Confirmation Message */}
        <p className="text-sm text-text-secondary">
          Are you sure you want to deactivate <span className="font-semibold text-text-primary">{memberName}</span>? This action can be undone later.
        </p>

        {/* Impact of Deactivation Section */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setIsImpactExpanded(!isImpactExpanded)}
            className="w-full flex items-center justify-between p-4 bg-card dark:bg-black/50 hover:bg-background dark:hover:bg-black/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm font-semibold text-red-500">
                Impact of deactivation
              </span>
            </div>
            {isImpactExpanded ? (
              <ChevronUp className="w-5 h-5 text-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-text-secondary" />
            )}
          </button>

          {isImpactExpanded && (
            <div className="px-4 pb-4 space-y-2 border-t border-border bg-background">
              <ul className="space-y-2 pt-3">
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-text-primary mt-1">•</span>
                  <span>Immediately revoke system access</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-text-primary mt-1">•</span>
                  <span>Terminate active sessions</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-text-primary mt-1">•</span>
                  <span>Retain historical data</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirmation Input */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
            TYPE DEACTIVATE TO CONFIRM
          </label>
          <Input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="DEACTIVATE"
            className={cn(
              'uppercase',
              confirmationText && !isConfirmValid && 'border-red-500'
            )}
            disabled={isDeactivating}
          />
          {confirmationText && !isConfirmValid && (
            <p className="text-xs text-red-500 mt-1">
              Please type "DEACTIVATE" to confirm
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isDeactivating}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDeactivate}
            disabled={!isConfirmValid || isDeactivating}
            className="bg-red-500 hover:bg-red-600 text-white border-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
          >
            {isDeactivating ? 'Deactivating...' : 'Deactivate Member'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

