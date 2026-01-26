import { ReactNode } from 'react';
import { Check, Shield, Lock, Pencil } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
  number: string;
  title: string;
  completed: boolean;
  current: boolean;
}

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
}

const steps: Omit<Step, 'completed' | 'current'>[] = [
  { number: '01', title: 'Account Details' },
  { number: '02', title: 'Business Profile' },
  { number: '03', title: 'Verification' },
  { number: '04', title: 'Subscription' },
  { number: '05', title: 'Review' },
];

export const OnboardingLayout = ({ children, currentStep }: OnboardingLayoutProps) => {
  const getStepStatus = (index: number): { completed: boolean; current: boolean } => {
    const stepIndex = index + 1;
    return {
      completed: stepIndex < currentStep,
      current: stepIndex === currentStep,
    };
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Fixed, non-scrollable */}
      <aside className="w-80  h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1013] p-8 flex flex-col flex-shrink-0 overflow-hidden">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3 flex-shrink-0 ">
          <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">TruePas</h1>
        </div>

        {/* Steps */}
        <div className="flex flex-col mb-2 overflow-hidden">
          {steps.map((step, index) => {
            const { completed, current } = getStepStatus(index);
            const isStep01 = step.number === '01';
            const isLastStep = index === steps.length - 1;
            // Line below should be blue if this step is completed or current
            const shouldShowBlueLine = current || completed;
            
            return (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors relative z-10',
                        {
                          'bg-primary border-primary text-white': current,
                          'bg-success border-success text-white': completed,
                          'border-gray-200 dark:border-gray-800 text-text-secondary': !current && !completed,
                        }
                      )}
                    >
                      {completed ? (
                        <Check size={18} />
                      ) : current && isStep01 ? (
                        <Pencil size={18} />
                      ) : (
                        step.number
                      )}
                    </div>
                    {/* Connecting line - blue if this step is completed or current */}
                    {!isLastStep && (
                      <div
                        className={cn(
                          'w-0.5 h-10 mt-2',
                          shouldShowBlueLine ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'
                        )}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p
                      className={cn('text-sm font-medium', {
                        'text-text-primary': current || completed,
                        'text-text-secondary': !current && !completed,
                      })}
                    >
                      {step.title}
                    </p>
                    {current && isStep01 && (
                      <p className="text-xs text-text-secondary mt-1">Basic Information</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonial Section - Takes up half the sidebar */}
        <div className="flex flex-col space-y-12 space-y-3 mt-10 ">
          {/* Testimonial Quote */}
          <div className="relative pl-4">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
            <p className="text-lg text-text-primary leading-relaxed mb-3">
              "Since switching to TruePas, our check-in times have dropped by 60%, and our guests love the seamless experience."
            </p>
            <p className="text-xs text-primary">
              — Elena Rodriguez, COO at Meridian Cruise Lines
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-card"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-card"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-card"></div>
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">+2K</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary">
              Trusted by leading hospitality brands
            </p>
          </div>

          {/* Security Badges */}
          <div className="flex items-center gap-6 pt-10 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-text-primary" />
              <span className="text-xs text-text-primary">SOC2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-text-primary" />
              <span className="text-xs text-text-primary">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-20">
          <div className="max-w-2xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

