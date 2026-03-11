import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';

import { apiClient } from '../../api';
import { isApiError, isForbidden, isUnauthorized } from '../../api/utils';
import { buildAuthConfig } from './config';
import { AuthContext } from './context';
import { getStoredToken, setStoredToken } from './storage';
import type { AuthProviderConfig, AuthProviderProps, AuthState, AuthUser } from './types';



export const AuthProvider = ({ children, config }: AuthProviderProps) => {
    const resolvedConfig = useMemo<AuthProviderConfig>(
        () => buildAuthConfig(config),
        [config],
    );
    const isCookieMode = resolvedConfig.authMode === 'cookie';

    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setTokenState] = useState<string | null>(() =>
        isCookieMode ? null : getStoredToken(resolvedConfig.tokenStorageKey),
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        if (isCookieMode) {
            setTokenState(null);
            return;
        }
        setTokenState(getStoredToken(resolvedConfig.tokenStorageKey));
    }, [isCookieMode, resolvedConfig.tokenStorageKey]);

    const clearServerSession = useCallback(async (): Promise<void> => {
        if (!isCookieMode || !resolvedConfig.logoutPath) return;

        try {
            await apiClient.instance.request({
                method: resolvedConfig.logoutMethod,
                url: resolvedConfig.logoutPath,
                withCredentials: resolvedConfig.includeCredentials,
            });
        } catch {
            // Keep local logout deterministic even if network logout fails.
        }
    }, [
        isCookieMode,
        resolvedConfig.includeCredentials,
        resolvedConfig.logoutMethod,
        resolvedConfig.logoutPath,
    ]);

    const logout = useCallback(() => {
        if (!isCookieMode) {
            setStoredToken(resolvedConfig.tokenStorageKey, null);
        } else {
            void clearServerSession();
        }
        setTokenState(null);
        setUser(null);
        setError(null);
    }, [clearServerSession, isCookieMode, resolvedConfig.tokenStorageKey]);

    const setToken = useCallback(
        (nextToken: string | null) => {
            if (isCookieMode) {
                setTokenState(null);
                return;
            }

            setStoredToken(resolvedConfig.tokenStorageKey, nextToken);
            setTokenState(nextToken);

            if (!nextToken) {
                setUser(null);
                setError(null);
            }
        },
        [isCookieMode, resolvedConfig.tokenStorageKey],
    );

    const fetchProfile = useCallback(
        async (
            activeToken?: string,
            options?: {
                signal?: AbortSignal;
                setLoading?: boolean;
            },
        ): Promise<AuthUser | null> => {
            const currentRequestId = ++requestIdRef.current;

            if (options?.setLoading !== false) setIsLoading(true);
            setError(null);

            try {
                const headers: Record<string, string> = {};
                if (!isCookieMode && activeToken) {
                    headers[resolvedConfig.authHeaderName] =
                        `${resolvedConfig.authHeaderPrefix} ${activeToken}`;
                }

                // apiClient.instance interceptor unwraps the backend envelope;
                // response.data is the resolved AuthUser on success.
                const response = await apiClient.instance.get<AuthUser>(resolvedConfig.profilePath, {
                    headers,
                    signal: options?.signal,
                    withCredentials: resolvedConfig.includeCredentials,
                });

                if (currentRequestId !== requestIdRef.current) return null;

                const profile = response.data;
                if (!profile) throw new Error('Profile response data is missing');

                setUser(profile);
                return profile;
            } catch (err) {
                if (axios.isCancel(err) || (err instanceof DOMException && err.name === 'AbortError')) {
                    return null;
                }

                if (currentRequestId !== requestIdRef.current) return null;

                // 401 / 403 — session no longer valid; force local logout.
                if (isUnauthorized(err) || isForbidden(err)) {
                    logout();
                    return null;
                }

                const message = isApiError(err)
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : 'Unable to fetch profile';
                setError(message);
                setUser(null);
                return null;
            } finally {
                if (
                    options?.setLoading !== false &&
                    currentRequestId === requestIdRef.current
                ) {
                    setIsLoading(false);
                }
            }
        },
        [
            isCookieMode,
            logout,
            resolvedConfig.authHeaderName,
            resolvedConfig.authHeaderPrefix,
            resolvedConfig.includeCredentials,
            resolvedConfig.profilePath,
        ],
    );

    const refreshProfile = useCallback(async (): Promise<AuthUser | null> => {
        if (!isCookieMode && !token) {
            setUser(null);
            setError(null);
            return null;
        }

        return fetchProfile(token ?? undefined);
    }, [fetchProfile, isCookieMode, token]);

    useEffect(() => {
        if (!isCookieMode && !token) {
            requestIdRef.current += 1;
            setIsLoading(false);
            setUser(null);
            return;
        }

        const controller = new AbortController();

        void fetchProfile(token ?? undefined, { signal: controller.signal });

        return () => {
            controller.abort();
        };
    }, [fetchProfile, isCookieMode, token]);

    const value = useMemo<AuthState>(
        () => ({
            user,
            token,
            isLoading,
            error,
            isAuthenticated: isCookieMode ? Boolean(user) : Boolean(user && token),
            setToken,
            refreshProfile,
            logout,
        }),
        [error, isCookieMode, isLoading, logout, refreshProfile, setToken, token, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
