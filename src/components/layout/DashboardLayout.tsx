import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Smartphone,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Input } from '../ui/Input';
import { ROUTES } from '../../config/routes';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps): JSX.Element => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const user = useAuthStore((state) => state.user);

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Michael Ross';
  const roleName = user?.role?.role_name || 'Root Admin';
  const merchantName = user?.merchant_id === '14e3b37c-8118-47f9-af0f-055ac174027d'
    ? 'TruePas Demo'
    : 'ABC Corp';

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
<<<<<<< HEAD

=======

>>>>>>> origin/feature-team
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={cn(
          'border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1013] flex flex-col flex-shrink-0 transition-all duration-300 z-50',
          // Mobile: hidden by default, overlay when open
          'fixed lg:static inset-y-0 left-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Desktop sizes
          isCollapsed ? 'w-20 lg:w-20' : 'w-64 lg:w-64'
        )}
      >
        {/* Logo */}
        <div className={cn('border-b border-gray-200 dark:border-gray-800 transition-all duration-300', isCollapsed ? 'p-4' : 'p-4 lg:p-6')}>
          <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'gap-2 lg:gap-3')}>
            <div className={cn('bg-primary rounded flex items-center justify-center flex-shrink-0', isCollapsed ? 'w-10 h-10' : 'w-9 h-9 lg:w-8 lg:h-8')}>
              <CheckCircle2 className={cn('text-white', isCollapsed ? 'w-5 h-5' : 'w-4 h-4 lg:w-5 lg:h-5')} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-base lg:text-lg font-bold text-text-primary">TruePas</h1>
                <p className="text-xs text-text-secondary hidden lg:block">Merchant Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
          <Link
            to={ROUTES.DASHBOARD}
            onClick={closeMobileMenu}
            className={cn(
              'w-full flex items-center rounded-lg transition-colors',
              isCollapsed ? 'justify-center px-3 py-2.5 lg:py-3' : 'gap-2.5 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3',
              isActive(ROUTES.DASHBOARD)
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-card-hover dark:hover:bg-white/10 hover:text-text-primary'
            )}
            title={isCollapsed ? 'Dashboard' : ''}
          >
            <LayoutDashboard size={isCollapsed ? 22 : 20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm lg:text-base font-medium truncate">Dashboard</span>}
          </Link>

          <div className="pt-3 lg:pt-4">
            {!isCollapsed && (
              <p className="text-[10px] lg:text-xs font-semibold text-text-secondary uppercase tracking-wide px-3 lg:px-4 mb-2">
                Operations
              </p>
            )}
            <div className="space-y-0.5 lg:space-y-1">
              <Link
                to={ROUTES.LOCATIONS}
                onClick={closeMobileMenu}
                className={cn(
                  'w-full flex items-center rounded-lg transition-colors',
                  isCollapsed ? 'justify-center px-3 py-2' : 'gap-2.5 lg:gap-3 px-3 lg:px-4 py-2',
                  isActive(ROUTES.LOCATIONS) || location.pathname.startsWith('/locations/')
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-secondary hover:bg-card-hover dark:hover:bg-white/10 hover:text-text-primary'
                )}
                title={isCollapsed ? 'Locations' : ''}
              >
                <MapPin size={isCollapsed ? 22 : 20} className="flex-shrink-0" />
                {!isCollapsed && <span className="text-sm lg:text-base truncate">Locations</span>}
              </Link>
              <Link
                to={ROUTES.DEVICE_HUB}
                onClick={closeMobileMenu}
                className={cn(
                  'w-full flex items-center rounded-lg transition-colors',
                  isCollapsed ? 'justify-center px-3 py-2' : 'gap-2.5 lg:gap-3 px-3 lg:px-4 py-2',
                  isActive(ROUTES.DEVICE_HUB) || location.pathname.startsWith('/devices/')
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-secondary hover:bg-card-hover dark:hover:bg-white/10 hover:text-text-primary'
                )}
                title={isCollapsed ? 'Device Hub' : ''}
              >
                <Smartphone size={isCollapsed ? 22 : 20} className="flex-shrink-0" />
                {!isCollapsed && <span className="text-sm lg:text-base truncate">Device Hub</span>}
              </Link>
              <Link
                to={ROUTES.TEAM_MANAGEMENT}
                onClick={closeMobileMenu}
                className={cn(
                  'w-full flex items-center rounded-lg transition-colors',
                  isCollapsed ? 'justify-center px-3 py-2' : 'gap-2.5 lg:gap-3 px-3 lg:px-4 py-2',
                  isActive(ROUTES.TEAM_MANAGEMENT) || location.pathname.startsWith('/team/')
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-secondary hover:bg-card-hover dark:hover:bg-white/10 hover:text-text-primary'
                )}
                title={isCollapsed ? 'Team Management' : ''}
              >
                <Users size={isCollapsed ? 22 : 20} className="flex-shrink-0" />
                {!isCollapsed && <span className="text-sm lg:text-base truncate">Team Management</span>}
              </Link>
            </div>
          </div>

          <div className="pt-3 lg:pt-4">
            {!isCollapsed && (
              <p className="text-[10px] lg:text-xs font-semibold text-text-secondary uppercase tracking-wide px-3 lg:px-4 mb-2">
                System
              </p>
            )}
            <div className="space-y-0.5 lg:space-y-1">
              <Link
                to={ROUTES.SETTINGS}
                onClick={closeMobileMenu}
                className={cn(
                  'w-full flex items-center rounded-lg transition-colors',
                  isCollapsed ? 'justify-center px-3 py-2' : 'gap-2.5 lg:gap-3 px-3 lg:px-4 py-2',
                  isActive(ROUTES.SETTINGS)
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-secondary hover:bg-card-hover dark:hover:bg-white/10 hover:text-text-primary'
                )}
                title={isCollapsed ? 'Settings' : ''}
              >
                <Settings size={isCollapsed ? 22 : 20} className="flex-shrink-0" />
                {!isCollapsed && <span className="text-sm lg:text-base truncate">Settings</span>}
              </Link>
              <Link
                to={ROUTES.SUPPORT}
                onClick={closeMobileMenu}
                className={cn(
                  'w-full flex items-center rounded-lg transition-colors',
                  isCollapsed ? 'justify-center px-3 py-2' : 'gap-2.5 lg:gap-3 px-3 lg:px-4 py-2',
                  isActive(ROUTES.SUPPORT)
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-secondary hover:bg-card-hover dark:hover:bg-white/10 hover:text-text-primary'
                )}
                title={isCollapsed ? 'Support' : ''}
              >
                <HelpCircle size={isCollapsed ? 22 : 20} className="flex-shrink-0" />
                {!isCollapsed && <span className="text-sm lg:text-base truncate">Support</span>}
              </Link>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <Link
          to="/team/root"
          onClick={closeMobileMenu}
          className={cn(
            'border-t border-gray-200 dark:border-gray-800 transition-all duration-300 cursor-pointer',
            isCollapsed ? 'p-3 lg:p-4' : 'p-3 lg:p-4',
            'hover:bg-card-hover dark:hover:bg-white/5 transition-colors'
          )}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"></div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 lg:gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{fullName}</p>
                <p className="text-xs text-text-secondary truncate">{roleName}</p>
              </div >
            </div >
          )}
        </Link >
      </aside >

      {/* Main Content */}
      < div className="flex-1 flex flex-col overflow-hidden lg:ml-0" >
        {/* Top Header */}
        < header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f1013]/80 backdrop-blur-md px-4 lg:px-6 py-4 lg:py-6 flex items-center justify-between flex-shrink-0" >
          <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Toggle / Desktop Toggle Sidebar Button */}
            <button
              onClick={() => {
                if (isMobile) {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  toggleSidebar();
                }
              }}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-card-hover rounded-lg transition-colors flex-shrink-0"
              title={isMobile ? 'Toggle menu' : isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isMobile ? (
                <Menu size={20} />
              ) : isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>

            <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
              {/* Company Selector */}
              <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded bg-primary flex items-center justify-center text-white font-bold text-sm lg:text-base">
                  {merchantName.substring(0, 3).toUpperCase()}
                </div >
                <div className="hidden lg:block">
                  <button className="flex items-center gap-1 text-text-primary text-sm lg:text-base font-medium hover:text-primary">
                    {merchantName}
                    <ChevronDown size={14} className="lg:w-4 lg:h-4" />
                  </button>
                  <p className="text-xs text-text-secondary">Enterprise Plan</p>
                </div>
              </div >

              {/* Search Bar */}
              < div className="flex-1 max-w-md min-w-0" >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-text-secondary" />
                  <Input
                    placeholder="Search locations, terminals..."
                    className="pl-9 lg:pl-10 bg-background text-sm lg:text-base"
                  />
                </div>
              </div >
            </div >
          </div >

          {/* Right Icons */}
          < div className="flex items-center gap-2 lg:gap-4 flex-shrink-0" >
            <button className="relative p-1.5 lg:p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Bell size={18} className="lg:w-5 lg:h-5" />
              <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 lg:p-2 text-text-secondary hover:text-text-primary transition-colors"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon size={18} className="lg:w-5 lg:h-5" />
              ) : (
                <Sun size={18} className="lg:w-5 lg:h-5" />
              )}
            </button>
          </div >
        </header >

        {/* Page Content */}
        < main className="flex-1 overflow-y-auto" > {children}</main >
      </div >
    </div >
  );
};