import type { ReactNode } from 'react';




export interface LoginPayload {
    email: string
    password: string
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    token: string
    password: string
}

export interface AuthUser {
    id?: string | number
    name?: string
    email?: string
    role?: string
    [key: string]: unknown
}

export interface LoginResponse {
    user: AuthUser
}

export interface AuthState {
    user: AuthUser | null
    token: string | null
    isLoading: boolean
    error: string | null
    isAuthenticated: boolean
    setToken: (token: string | null) => void
    refreshProfile: () => Promise<AuthUser | null>
    logout: () => void
}

export interface AuthProviderConfig {
    authMode: 'cookie' | 'bearer'
    includeCredentials: boolean
    apiBaseUrl: string
    profilePath: string
    logoutPath: string
    logoutMethod: 'POST' | 'GET'
    tokenStorageKey: string
    authHeaderName: string
    authHeaderPrefix: string
}

export interface AuthProviderProps {
    children: ReactNode
    config?: Partial<AuthProviderConfig>
}
