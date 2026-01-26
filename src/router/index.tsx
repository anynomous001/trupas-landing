import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
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
import { AccountDetails } from '../pages/onboarding/AccountDetails';
import { Verification } from '../pages/onboarding/Verification';
import { TaxValidation } from '../pages/onboarding/TaxValidation';
import { ROUTES } from '../config/routes';
import { useOnboardingStore } from '../stores/onboardingStore';

// Navigation guard components
const RequireVerification = () => {
  const accountDetails = useOnboardingStore((state) => state.accountDetails);
  
  if (!accountDetails) {
    return <Navigate to={ROUTES.ONBOARDING.ACCOUNT_DETAILS} replace />;
  }
  
  return <Verification />;
};

const RequireTaxValidation = () => {
  const accountDetails = useOnboardingStore((state) => state.accountDetails);
  const verification = useOnboardingStore((state) => state.verification);
  
  if (!accountDetails) {
    return <Navigate to={ROUTES.ONBOARDING.ACCOUNT_DETAILS} replace />;
  }
  
  if (!verification.emailVerified || !verification.phoneVerified) {
    return <Navigate to={ROUTES.ONBOARDING.VERIFICATION} replace />;
  }
  
  return <TaxValidation />;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Landing />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: ROUTES.LOCATIONS,
    element: <Locations />,
  },
  {
    path: ROUTES.LOCATION_DETAILS,
    element: <LocationDetails />,
  },
  {
    path: ROUTES.DEVICE_HUB,
    element: <DeviceHub />,
  },
  {
    path: ROUTES.DEVICE_DETAILS,
    element: <DeviceDetails />,
  },
  {
    path: ROUTES.TEAM_MANAGEMENT,
    element: <TeamManagement />,
  },
  {
    path: ROUTES.MEMBER_DETAILS,
    element: <MemberDetails />,
  },
  {
    path: ROUTES.SETTINGS,
    element: <Settings />,
  },
  {
    path: ROUTES.SUPPORT,
    element: <Support />,
  },
  {
    path: ROUTES.DOCUMENTATION,
    element: <Documentation />,
  },
  {
    path: ROUTES.GETTING_STARTED_ARTICLE,
    element: <GettingStartedArticle />,
  },
  {
    path: ROUTES.FAQ,
    element: <FAQ />,
  },
  {
    path: ROUTES.ONBOARDING.ROOT,
    element: <Navigate to={ROUTES.ONBOARDING.ACCOUNT_DETAILS} replace />,
  },
  {
    path: ROUTES.ONBOARDING.ACCOUNT_DETAILS,
    element: <AccountDetails />,
  },
  {
    path: ROUTES.ONBOARDING.VERIFICATION,
    element: <RequireVerification />,
  },
  {
    path: ROUTES.ONBOARDING.TAX_VALIDATION,
    element: <RequireTaxValidation />,
  },
]);

