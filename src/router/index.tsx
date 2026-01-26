import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { Dashboard } from '../pages/Dashboard';
import { Locations } from '../pages/Locations';
import { LocationDetails } from '../pages/LocationDetails';
import { DeviceHub } from '../pages/DeviceHub';
import { DeviceDetails } from '../pages/DeviceDetails';
import { TeamManagement } from '../pages/TeamManagement';
import { MemberDetails } from '../pages/MemberDetails';
import { Settings } from '../pages/Settings';
import { Support } from '../pages/Support';
import { Documentation } from '../pages/Documentation';
import { GettingStartedArticle } from '../pages/documentation/GettingStartedArticle';
import { FAQ } from '../pages/FAQ';

import { ROUTES } from '../config/routes';
import { useAuthStore } from '../stores/authStore';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

// Guest Only Route (redirect to dashboard if already logged in)
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Landing />,
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <GuestRoute>
        <ForgotPassword />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <GuestRoute>
        <ResetPassword />
      </GuestRoute>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LOCATIONS,
    element: (
      <ProtectedRoute>
        <Locations />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LOCATION_DETAILS,
    element: (
      <ProtectedRoute>
        <LocationDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DEVICE_HUB,
    element: (
      <ProtectedRoute>
        <DeviceHub />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DEVICE_DETAILS,
    element: (
      <ProtectedRoute>
        <DeviceDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.TEAM_MANAGEMENT,
    element: (
      <ProtectedRoute>
        <TeamManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MEMBER_DETAILS,
    element: (
      <ProtectedRoute>
        <MemberDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SUPPORT,
    element: (
      <ProtectedRoute>
        <Support />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DOCUMENTATION,
    element: (
      <ProtectedRoute>
        <Documentation />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.GETTING_STARTED_ARTICLE,
    element: (
      <ProtectedRoute>
        <GettingStartedArticle />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.FAQ,
    element: (
      <ProtectedRoute>
        <FAQ />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ONBOARDING.ROOT,
    element: <Navigate to={ROUTES.ONBOARDING.ACCOUNT_DETAILS} replace />,
  },
]);

