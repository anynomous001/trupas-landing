import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  HelpCircle,
  FileText,
  Shield,
  Settings,
  Link as LinkIcon,
  Headphones,
  Plus,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';

interface PopularArticle {
  id: string;
  title: string;
  description: string;
  readTime: string;
  icon: typeof FileText;
  category: string;
}

export const Support = (): JSX.Element => {
  const popularArticles: PopularArticle[] = [
    {
      id: '1',
      title: 'Integrating TruePas API with Python',
      description: 'Step-by-step guide to authenticating and making your first request.',
      readTime: '5 min read',
      icon: FileText,
      category: 'Integration',
    },
    {
      id: '2',
      title: 'Understanding Verification Tiers',
      description: 'Differences between Basic, Enhanced, and Premium identity checks.',
      readTime: '3 min read',
      icon: Shield,
      category: 'Verification',
    },
    {
      id: '3',
      title: 'Managing Sub-Merchant Accounts',
      description: 'How to create and manage permissions for multiple business units.',
      readTime: '8 min read',
      icon: Settings,
      category: 'Account Management',
    },
    {
      id: '4',
      title: 'Troubleshooting Webhook Failures',
      description: 'Common error codes and how to retry failed event notifications.',
      readTime: '10 min read',
      icon: LinkIcon,
      category: 'Technical',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            {/* Greeting */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-text-primary">Hello, Root User.</h1>
              <p className="text-xl text-text-secondary">How can we help you today?</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                placeholder="Search documentation, FAQs, or describe your issue..."
                className="pl-12 pr-20 h-14 text-base bg-card"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-semibold text-text-secondary bg-background border border-border rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Key Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documentation Card */}
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Documentation</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Browse technical guides & API references for seamless integration.
                  </p>
                  <Link
                    to={ROUTES.DOCUMENTATION}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors group-hover:gap-2"
                  >
                    Browse Docs
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Card>

            {/* FAQs Card */}
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">FAQs</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Quick answers to common billing, setup, and account questions.
                  </p>
                  <Link
                    to={ROUTES.FAQ}
                    className="inline-flex items-center gap-1 text-sm font-medium text-purple-500 hover:text-purple-400 transition-colors group-hover:gap-2"
                  >
                    View Answers
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Popular Articles Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary">Popular Articles</h2>
              <Link
                to="#"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all articles
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {popularArticles.map((article) => {
                const ArticleIcon = article.icon;
                return (
                  <Card
                    key={article.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                        <ArticleIcon className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-2">{article.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-text-secondary">{article.readTime}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-secondary flex-shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Still Need Help Section */}
          <div className="pt-8 border-t border-border">
            <Card className="bg-gradient-to-br from-background to-card border-primary/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-8 h-8 text-text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Still need help?
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Our support team is available 24/7 to assist you with any technical or billing
                    issues you might encounter.
                  </p>
                </div>
                <Button className="flex items-center gap-2 whitespace-nowrap rounded-full">
                  <Plus size={16} />
                  Chat with us
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

