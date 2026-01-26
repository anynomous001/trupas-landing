import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Smartphone,
  CheckCircle2,
  FileText,
  Users,
  Lock,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';

type FAQCategory = 'all' | 'terminals' | 'check-ins' | 'billing' | 'account';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  icon: typeof Smartphone;
}

export const FAQ = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>(['2']); // Second item expanded by default
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'yes' | 'no' | null>>({});

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I pair a new TruePas terminal?',
      answer:
        'To pair a new terminal, navigate to the Device Hub in your dashboard. Click "Add Device" and follow the on-screen instructions. You will need to enter the terminal serial number and select the location where it will be installed. Once paired, the terminal will appear in your device list and can be configured through the settings.',
      category: 'terminals',
      icon: Smartphone,
    },
    {
      id: '2',
      question: 'What happens if a user fails ID verification?',
      answer:
        'If a user fails verification, the system will automatically flag the attempt as "High Risk". You can review these attempts in the Verifications Log. The user will be prompted to retry with a clearer image or an alternative ID document. Common reasons for failure include glare on the ID, blurriness, or expired documents.',
      category: 'check-ins',
      icon: CheckCircle2,
    },
    {
      id: '3',
      question: 'Where can I download my monthly invoices?',
      answer:
        'Monthly invoices are available in the Billing section of your Settings page. Navigate to Settings > Billing to view and download all past invoices. Invoices are generated on the first of each month and are available in PDF format. You can also set up email notifications to receive invoices automatically.',
      category: 'billing',
      icon: FileText,
    },
    {
      id: '4',
      question: 'How do I add a new sub-merchant user?',
      answer:
        'To add a new sub-merchant user, go to Team Management in your dashboard. Click "Invite Member" and enter their email address. Select their role (Admin, Manager, or Staff) and assign them to specific locations if needed. They will receive an invitation email with instructions to set up their account. The invitation expires after 7 days.',
      category: 'account',
      icon: Users,
    },
    {
      id: '5',
      question: 'Can I enforce 2FA for all my staff?',
      answer:
        'Yes, you can enforce two-factor authentication (2FA) for all staff members. Go to Settings > Account Security to enable mandatory 2FA. Once enabled, all users will be required to set up 2FA on their next login. You can also view which users have 2FA enabled in the Team Management section.',
      category: 'account',
      icon: Lock,
    },
  ];

  const categories: { id: FAQCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'terminals', label: 'Terminals' },
    { id: 'check-ins', label: 'Check-ins' },
    { id: 'billing', label: 'Billing' },
    { id: 'account', label: 'Account' },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFeedback = (id: string, feedback: 'yes' | 'no') => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: feedback }));
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link
              to={ROUTES.SUPPORT}
              className="inline-flex items-center gap-2 hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Support
            </Link>
            <span>/</span>
            <Link to={ROUTES.SUPPORT} className="hover:text-text-primary transition-colors">
              Support
            </Link>
            <span>/</span>
            <span className="text-text-primary">FAQ</span>
            {activeCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-text-primary capitalize">{activeCategory}</span>
              </>
            )}
          </div>

          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">Frequently Asked Questions</h1>
            <p className="text-lg text-text-secondary">
              Find answers to common questions about TruePas.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                placeholder="Search FAQs (e.g., 'invoice', 'terminal setup')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-card text-text-secondary hover:text-text-primary hover:bg-card-hover border border-border'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFAQs.map((faq) => {
              const Icon = faq.icon;
              const isExpanded = expandedItems.includes(faq.id);
              const feedback = helpfulFeedback[faq.id];

              return (
                <Card key={faq.id} className="overflow-hidden hover:bg-card-hover transition-colors">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full flex items-center gap-4  text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-text-primary">{faq.question}</h3>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-text-secondary flex-shrink-0 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-2 pb-4 space-y-3 border-t border-border">
                      <p className="text-sm text-text-secondary leading-relaxed pt-3">
                        {faq.answer}
                      </p>

                      {/* Feedback Section */}
                      {!feedback && (
                        <div className="pt-3 border-t border-border">
                          <p className="text-sm font-medium text-text-primary mb-2">
                            WAS THIS HELPFUL?
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeedback(faq.id, 'yes');
                              }}
                              className="flex items-center gap-2"
                            >
                              <ThumbsUp size={16} />
                              Yes
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeedback(faq.id, 'no');
                              }}
                              className="flex items-center gap-2"
                            >
                              <ThumbsDown size={16} />
                              No
                            </Button>
                          </div>
                        </div>
                      )}

                      {feedback && (
                        <div className="pt-1 border-t border-border">
                          <p className="text-sm text-text-secondary">
                            Thank you for your feedback!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* No Results Message */}
          {filteredFAQs.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-text-secondary">
                No FAQs found matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

