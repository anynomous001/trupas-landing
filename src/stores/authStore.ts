import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    member_id: string;
    merchant_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    profile_photo_url: string | null;
    role: {
        role_id: string;
        role_name: string;
        role_slug: string;
        scope_level: string;
    };
    scope_level: string;
    is_active: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    two_factor_enabled: boolean;
    last_login_at: string;
    login_count: number;
    is_online: boolean;
    created_at: string;
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
                set({ user, access_token, refresh_token, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('access_token');
                set({ user: null, access_token: null, refresh_token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
