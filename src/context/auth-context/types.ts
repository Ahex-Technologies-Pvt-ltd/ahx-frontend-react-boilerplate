import type { ReactNode } from 'react';



export type AuthUser = {
    id?: string | number;
    name?: string;
    email?: string;
    [key: string]: unknown;
};

export type AuthState = {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    setToken: (token: string | null) => void;
    refreshProfile: () => Promise<AuthUser | null>;
    logout: () => void;
};

export type AuthProviderConfig = {
    authMode: 'cookie' | 'bearer';
    includeCredentials: boolean;
    apiBaseUrl: string;
    profilePath: string;
    logoutPath: string;
    logoutMethod: 'POST' | 'GET';
    tokenStorageKey: string;
    authHeaderName: string;
    authHeaderPrefix: string;
};

export type AuthProviderProps = {
    children: ReactNode;
    config?: Partial<AuthProviderConfig>;
};
