import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';

import { buildAuthConfig, resolveProfileUrl } from './config';
import { AuthContext } from './context';
import { getStoredToken, setStoredToken } from './storage';
import type {
    ApiResponse,
    AuthProviderConfig,
    AuthProviderProps,
    AuthState,
    AuthUser,
} from './types';



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
        if (!isCookieMode || !resolvedConfig.logoutPath) {
            return;
        }

        const headers: Record<string, string> = {};

        if (resolvedConfig.logoutMethod === 'POST') {
            headers['Content-Type'] = 'application/json';
        }

        try {
            await axios.request({
                method: resolvedConfig.logoutMethod,
                url: resolveProfileUrl(resolvedConfig.apiBaseUrl, resolvedConfig.logoutPath),
                headers,
                withCredentials: resolvedConfig.includeCredentials,
                validateStatus: () => true,
            });
        } catch {
            // Keep local logout deterministic even if network logout fails.
        }
    }, [
        isCookieMode,
        resolvedConfig.apiBaseUrl,
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

    const getApiErrorMessage = useCallback((payload?: ApiResponse<AuthUser>): string => {
        if (!payload) {
            return 'Unable to fetch profile';
        }

        const detailMessage = payload.error?.details
            ?.map((detail) => detail.message)
            .filter((message): message is string => Boolean(message))
            .join(', ');

        if (detailMessage) {
            return detailMessage;
        }

        if (payload.message) {
            return payload.message;
        }

        if (payload.error?.code) {
            return payload.error.code;
        }

        return 'Unable to fetch profile';
    }, []);

    const fetchProfile = useCallback(
        async (
            activeToken?: string,
            options?: {
                signal?: AbortSignal;
                setLoading?: boolean;
            },
        ): Promise<AuthUser | null> => {
            const currentRequestId = ++requestIdRef.current;

            if (options?.setLoading !== false) {
                setIsLoading(true);
            }
            setError(null);

            try {
                const headers: Record<string, string> = {};
                if (!isCookieMode && activeToken) {
                    headers[resolvedConfig.authHeaderName] =
                        `${resolvedConfig.authHeaderPrefix} ${activeToken}`;
                }

                const response = await axios.request<ApiResponse<AuthUser>>({
                    method: 'GET',
                    url: resolveProfileUrl(resolvedConfig.apiBaseUrl, resolvedConfig.profilePath),
                    headers,
                    withCredentials: resolvedConfig.includeCredentials,
                    signal: options?.signal,
                    validateStatus: () => true,
                });

                if (currentRequestId !== requestIdRef.current) {
                    return null;
                }

                if (response.status === 401 || response.status === 403) {
                    logout();
                    return null;
                }

                const payload = response.data ?? null;

                if (response.status < 200 || response.status >= 300 || !payload?.success) {
                    throw new Error(getApiErrorMessage(payload));
                }

                if (!payload?.data) {
                    throw new Error('Profile response data is missing');
                }

                const profile = payload.data;
                setUser(profile);
                return profile;
            } catch (fetchError) {
                if (axios.isCancel(fetchError)) {
                    return null;
                }

                if (
                    fetchError instanceof DOMException &&
                    fetchError.name === 'AbortError'
                ) {
                    return null;
                }

                const message =
                    fetchError instanceof Error
                        ? fetchError.message
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
            getApiErrorMessage,
            isCookieMode,
            logout,
            resolvedConfig.apiBaseUrl,
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
