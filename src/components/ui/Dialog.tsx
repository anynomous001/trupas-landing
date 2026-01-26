import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '../../lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Dialog = ({
  open,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}: DialogProps) => {
  if (!open) return null;

  const hasHeader = title || showCloseButton;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className={cn('w-full max-w-md relative dark:!bg-black dark:!border-white/10', className)}>
        {hasHeader && (
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="text-xl font-semibold text-text-primary">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors ml-auto"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        {children}
      </Card>
    </div>
  );
};

