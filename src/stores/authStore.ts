import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    memberId: string;
    merchantId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    profilePhotoUrl: string | null;
    role: {
        roleId: string;
        roleName: string;
        roleSlug: string;
        scopeLevel: string;
    };
    scopeLevel: string;
    isActive: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    lastLoginAt: string;
    loginCount: number;
    isOnline: boolean;
    createdAt: string;
    capabilities: string[];
}

interface AuthState {
    user: User | null;
    access_token: string | null;
    refresh_token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, access_token: string, refresh_token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            access_token: null,
            refresh_token: null,
            isAuthenticated: false,
            setAuth: (user, access_token, refresh_token) => {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                set({ user, access_token, refresh_token, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                set({ user: null, access_token: null, refresh_token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
