import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Rocket,
  Code,
  Puzzle,
  Smartphone,
  Users,
  Receipt,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ROUTES } from '../config/routes';
import { cn } from '../lib/utils';

interface DocumentationCategory {
  id: string;
  title: string;
  description: string;
  articleCount: number;
  icon: typeof Rocket;
  color: string;
}

export const Documentation = (): JSX.Element => {
  const categories: DocumentationCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Account setup, platform basics, and initial configuration.',
      articleCount: 12,
      icon: Rocket,
      color: 'text-blue-500',
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Endpoints, authentication methods, and error codes.',
      articleCount: 45,
      icon: Code,
      color: 'text-blue-500',
    },
    {
      id: 'integration-guides',
      title: 'Integration Guides',
      description: 'Official SDKs, platform plugins, and client libraries.',
      articleCount: 8,
      icon: Puzzle,
      color: 'text-blue-500',
    },
    {
      id: 'terminal-setup',
      title: 'Terminal Setup',
      description: 'Hardware configuration, pairing, and troubleshooting.',
      articleCount: 5,
      icon: Smartphone,
      color: 'text-blue-500',
    },
    {
      id: 'team-management',
      title: 'Team Management',
      description: 'User roles, permission sets, and security audit logs.',
      articleCount: 10,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      id: 'billing-plans',
      title: 'Billing & Plans',
      description: 'Invoices, payment methods, and subscription tiers.',
      articleCount: 3,
      icon: Receipt,
      color: 'text-blue-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Link */}
          <Link
            to={ROUTES.SUPPORT}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Support
          </Link>

          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">Documentation</h1>
            <p className="text-lg text-text-secondary">
              Everything you need to integrate and manage your TruePas account, from API references
              to billing setups.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                placeholder="Search documentation..."
                className="pl-10 h-12 bg-card"
              />
            </div>
          </div>

          {/* Documentation Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  to={
                    category.id === 'getting-started'
                      ? ROUTES.GETTING_STARTED_ARTICLE
                      : ROUTES.DOCUMENTATION
                  }
                  className="block"
                >
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Icon className={cn('w-6 h-6', category.color)} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-4">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-text-secondary">
                            {category.articleCount} articles
                          </span>
                          <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

