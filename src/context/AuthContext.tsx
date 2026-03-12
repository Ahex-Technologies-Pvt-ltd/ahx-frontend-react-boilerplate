import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { authService } from '@/services';
import type { AuthUser, LoginPayload, RegisterPayload, GoogleAuthPayload } from '@/types';
import { AuthContext } from './authContext';



export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const refetchUser = useCallback(async () => {
        try {
            const userData = await authService.getProfile();
            setUser(userData);
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            await refetchUser();
            setLoading(false);
        };

        initAuth();
    }, [refetchUser]);

    const login = useCallback(async (payload: LoginPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.login(payload);
            setUser(data.user);
        } catch (err: unknown) {
            const message = (err as { message?: string }).message ?? 'Login failed. Please try again.';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.register(payload);
            setUser(data.user);
        } catch (err: unknown) {
            const message =
                (err as { message?: string }).message ?? 'Registration failed. Please try again.';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const googleAuth = useCallback(async (payload: GoogleAuthPayload) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.googleAuth(payload);
            setUser(data.user);
        } catch (err: unknown) {
            const message =
                (err as { message?: string }).message ?? 'Google sign-in failed. Please try again.';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.logout();
            await refetchUser();
        } finally {
            setIsLoading(false);
        }
    }, [refetchUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isLoading,
                isAuthenticated: !!user,
                error,
                clearError,
                login,
                register,
                googleAuth,
                logout,
                refetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
