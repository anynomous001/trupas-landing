import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Info,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Key,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ROUTES } from '../../config/routes';
import { cn } from '../../lib/utils';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock = ({ language, code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-mono text-text-secondary uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono text-text-primary whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};

export const GettingStartedArticle = (): JSX.Element => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link
              to={ROUTES.DOCUMENTATION}
              className="inline-flex items-center gap-2 hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Documentation
            </Link>
            <span>/</span>
            <Link to={ROUTES.DOCUMENTATION} className="hover:text-text-primary transition-colors">
              Documentation
            </Link>
            <span>/</span>
            <Link to="#" className="hover:text-text-primary transition-colors">
              Getting Started
            </Link>
            <span>/</span>
            <span className="text-text-primary">First Terminal Setup</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">
              How to Set Up Your First Terminal
            </h1>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>Last updated: Dec 20, 2025</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              This guide will walk you through the initial configuration of a verification terminal.
              By the end, you'll have a working setup that can process identity checks using the
              TruePas SDK.
            </p>
          </div>

          {/* Prerequisites */}
          <Card className="bg-blue-500/10 border-blue-500/50 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary mb-1">Prerequisites</p>
                <p className="text-sm text-text-secondary">
                  Before starting, ensure you have an active Merchant Account and your API keys
                  generated from the dashboard settings.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 1: Install the SDK */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">1. Install the SDK</h2>
            <p className="text-text-secondary leading-relaxed">
              To get started, install the TruePas Node.js SDK using npm or yarn. This package
              provides all the methods you need to interact with verification terminals.
            </p>
            <CodeBlock
              language="bash"
              code="npm install @truepas/sdk --save"
            />
          </div>

          {/* Section 2: Initialize Client */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">2. Initialize Client</h2>
            <p className="text-text-secondary leading-relaxed">
              After installation, initialize the client with your secret key. Make sure to keep your
              API key secure and never expose it on the client-side. This code should run on your
              secure backend server.
            </p>
            <CodeBlock
              language="javascript"
              code={`const TruePas = require('@truepas/sdk');

const client = new TruePas({
  apiKey: 'sk_live_51Mz...', // Replace with your actual secret key
  apiVersion: '2025-11-01'
});`}
            />
          </div>

          {/* Section 3: Configure Terminal Settings */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">3. Configure Terminal Settings</h2>
            <p className="text-text-secondary leading-relaxed">
              Navigate to the "Terminals" section in your dashboard to find your Terminal ID. You
              can view all active terminals on an interactive map for easy management.
            </p>
            
            {/* Image Placeholder */}
            <Card className="bg-background border-border p-8">
              <div className="space-y-4">
                <div className="relative w-full h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-border flex items-center justify-center overflow-hidden">
                  {/* Map-like visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 rounded-lg bg-blue-500/30 border-2 border-blue-500/50 flex items-center justify-center mx-auto">
                        <span className="text-xs font-mono text-blue-500">Venn Lake</span>
                      </div>
                      <div className="relative">
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                        <Card className="absolute left-8 top-1/2 -translate-y-1/2 bg-card border-border p-3 shadow-lg min-w-[200px]">
                          <p className="text-xs font-semibold text-text-secondary mb-1">Terminal ID</p>
                          <p className="text-sm font-mono text-text-primary">term_829x99</p>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary italic text-center">
                  Figure 1: Locating your Terminal ID in the visual dashboard.
                </p>
              </div>
            </Card>
          </div>

          {/* Troubleshooting Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Troubleshooting</h2>
            <ul className="space-y-3 list-none">
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-text-secondary">
                  If you receive a 401 Unauthorized error, double-check your API key.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-text-secondary">
                  Ensure your server clock is synchronized to prevent timestamp rejection.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-text-secondary">
                  For connection timeouts, verify your firewall settings allow traffic on port 443.
                </p>
              </li>
            </ul>
          </div>

          {/* Helpfulness Feedback */}
          <Card className="bg-card border-border">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Was this article helpful?
                </h3>
                <p className="text-sm text-text-secondary">
                  Your feedback helps us improve our documentation.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="flex items-center gap-2">
                  <ThumbsUp size={16} />
                  Yes
                </Button>
                <Button variant="secondary" className="flex items-center gap-2">
                  <ThumbsDown size={16} />
                  No
                </Button>
              </div>
            </div>
          </Card>

          {/* Related Articles */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Related Article 1 */}
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      Generating API Keys
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Learn how to create, roll, and manage your secret keys securely.
                    </p>
                    <div className="flex items-center justify-end">
                      <span className="text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read more
                        <ArrowLeft size={16} className="rotate-180" />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Related Article 2 */}
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      Testing Verification Flows
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Use the sandbox environment to simulate identity checks without real data.
                    </p>
                    <div className="flex items-center justify-end">
                      <span className="text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read more
                        <ArrowLeft size={16} className="rotate-180" />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
              <p>© 2025 TruePas Inc. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link to="#" className="hover:text-text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="hover:text-text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to={ROUTES.SUPPORT} className="hover:text-text-primary transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

