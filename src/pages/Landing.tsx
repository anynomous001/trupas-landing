import { useState } from 'react';
import {
  CheckCircle2,
  Smartphone,
  MapPin,
  Users,
  Shield,
  BarChart3,
  ChevronDown,
  ArrowRight,
  Zap,
  Lock,
  Bell,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const faqs = [
  {
    id: '1',
    question: 'How do I pair a new TruePas terminal?',
    answer:
      'Navigate to Device Hub in your dashboard, click "Add Device", and follow the on-screen steps. Enter the terminal serial number and assign it to a location. Once paired, it appears in your device list and is ready to configure.',
  },
  {
    id: '2',
    question: 'What happens if a user fails ID verification?',
    answer:
      'Failed attempts are flagged as "High Risk" and logged in the Verifications Log. The user is prompted to retry with a clearer image or alternative ID. Common causes are glare, blurriness, or an expired document.',
  },
  {
    id: '3',
    question: 'How do I add a new team member?',
    answer:
      'Go to Team Management and click "Invite Member". Enter their email, choose a role (Admin, Manager, or Staff), and optionally restrict them to specific locations. They receive an invitation link valid for 7 days.',
  },
  {
    id: '4',
    question: 'Can I enforce 2FA for all staff?',
    answer:
      'Yes. Go to Settings → Account Security and enable mandatory 2FA. All users will be required to set it up on their next login. You can monitor 2FA status per user from the Team Management page.',
  },
  {
    id: '5',
    question: 'Where can I download monthly invoices?',
    answer:
      'Invoices are available under Settings → Billing. They are generated on the first of each month in PDF format. You can also enable email notifications to receive them automatically.',
  },
];

const features = [
  {
    icon: CheckCircle2,
    title: 'Automated ID Verification',
    description:
      'Real-time identity checks at every kiosk. Our system instantly validates documents and flags anomalies so your staff never has to guess.',
  },
  {
    icon: MapPin,
    title: 'Multi-Location Management',
    description:
      'Manage every venue from a single dashboard. View live check-in data, terminal health, and alerts across all your locations at once.',
  },
  {
    icon: Smartphone,
    title: 'Device Hub',
    description:
      'Pair, monitor, and manage kiosks, tablets, and handheld scanners with ease. Get real-time status, firmware updates, and battery alerts.',
  },
  {
    icon: Users,
    title: 'Role-Based Team Access',
    description:
      'Invite staff with granular permissions. Assign Admins, Managers, or limited Staff roles scoped to specific locations.',
  },
  {
    icon: BarChart3,
    title: 'Live Analytics',
    description:
      'Track check-in volume, success rates, and trends in real time. Weekly comparisons give you the context to act fast.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Enforce 2FA for all users, get full audit logs, and meet compliance requirements out of the box.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create your merchant account',
    description: 'Sign up and onboard your business in minutes. No technical setup required.',
  },
  {
    number: '02',
    title: 'Add your locations & devices',
    description: 'Register your venues and pair your TruePas kiosks or terminals in a few clicks.',
  },
  {
    number: '03',
    title: 'Invite your team',
    description: 'Set roles and permissions for each staff member across any location.',
  },
  {
    number: '04',
    title: 'Go live',
    description: 'Your kiosks start verifying IDs instantly. Monitor everything from the dashboard.',
  },
];

export const Landing = (): React.JSX.Element => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 dark:bg-[#0f1013]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">TruePas</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How it works</a>
            <a href="#faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">FAQ</a>
          </nav>
          <a href="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="flex-1 flex items-center justify-center px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-sm text-text-secondary">
            <Zap className="w-4 h-4 text-primary" />
            Trusted by merchants across the US
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
            Identity verification,{' '}
            <span className="text-primary">finally built</span>{' '}
            for merchants
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            TruePas gives you a single dashboard to manage ID check-ins across every location, terminal, and team member — in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login">
              <Button size="lg" className="gap-2">
                Get started free <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button size="lg" variant="outline">See how it works</Button>
            </a>
          </div>
          <div className="flex items-center justify-center gap-8 pt-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> SOC 2 compliant</span>
            <span className="flex items-center gap-1.5"><Bell className="w-4 h-4 text-primary" /> 24/7 monitoring</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 lg:px-8 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">
              Everything you need to run compliant check-ins
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              From kiosk management to team permissions, TruePas covers the full stack.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">
              Up and running in under an hour
            </h2>
            <p className="text-lg text-text-secondary">
              Simple setup, zero downtime.
            </p>
          </div>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{step.number}</span>
                </div>
                <div className="flex-1 pb-8 border-b border-border last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{step.title}</h3>
                  <p className="text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-24 px-6 lg:px-8 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">Built for your industry</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              TruePas adapts to any business that needs reliable, fast identity verification at point of entry.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Hospitality & Events', desc: 'Verify guests at check-in, control access by age or membership tier, and keep a full audit trail.' },
              { title: 'Retail & Dispensaries', desc: 'Age-gate purchases instantly at the kiosk. Stay compliant without slowing down the checkout line.' },
              { title: 'Corporate & Co-working', desc: 'Manage visitor check-ins across multiple offices with role-based access for your reception team.' },
            ].map((uc) => (
              <div key={uc.title} className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-base font-semibold text-text-primary mb-2">{uc.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary">Frequently asked questions</h2>
            <p className="text-lg text-text-secondary">Answers to the most common questions from merchants.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-card/60 transition-colors"
                >
                  <span className="font-medium text-text-primary">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-text-secondary flex-shrink-0 ml-4 transition-transform duration-200',
                      openFaq === faq.id && 'rotate-180'
                    )}
                  />
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-5 text-text-secondary leading-relaxed border-t border-border bg-card/30">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-6 lg:px-8 bg-primary">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to streamline your check-ins?</h2>
          <p className="text-lg text-white/80">
            Join merchants who trust TruePas for compliant, real-time identity verification.
          </p>
          <a href="/login">
            <Button size="lg" variant="secondary" className="gap-2">
              Sign in to your portal <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10 px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text-primary">TruePas</span>
          </div>
          <p className="text-sm text-text-secondary">© 2024 TruePas. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
