import { Button } from '../components/ui/Button';

export const Landing = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">TruePas</h1>
          <a href="/login">
            <Button variant="outline">Sign In</Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-3xl text-center space-y-8">
          <h2 className="text-5xl font-bold text-text-primary">
            Welcome to TruePas Merchant Portal
          </h2>
          <p className="text-xl text-text-secondary">
            Manage your merchant account, locations, and team members with our secure and efficient portal.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/login">
              <Button size="lg">Sign In to Dashboard</Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-8 text-center text-sm text-text-secondary">
          <p>© 2024 TruePas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
