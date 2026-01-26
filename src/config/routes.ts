export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LOCATIONS: '/locations',
  LOCATION_DETAILS: '/locations/:id',
  DEVICE_HUB: '/devices',
  DEVICE_DETAILS: '/devices/:id',
  TEAM_MANAGEMENT: '/team',
  MEMBER_DETAILS: '/team/:id',
  SETTINGS: '/settings',
  SUPPORT: '/support',
  DOCUMENTATION: '/documentation',
  GETTING_STARTED_ARTICLE: '/documentation/getting-started/first-terminal-setup',
  FAQ: '/faq',
  ONBOARDING: {
    ROOT: '/onboarding',
    ACCOUNT_DETAILS: '/onboarding/account-details',
    VERIFICATION: '/onboarding/verification',
    TAX_VALIDATION: '/onboarding/tax-validation',
  },
} as const;

