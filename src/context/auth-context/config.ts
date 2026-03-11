import { API_ENDPOINTS } from '../../api';
import type { AuthProviderConfig } from '../../types';



type AuthMode = AuthProviderConfig['authMode'];

const DEFAULT_AUTH_MODE: AuthMode =
    import.meta.env.VITE_AUTH_MODE === 'bearer' ? 'bearer' : 'cookie';

const COMMON_DEFAULTS: Omit<
    AuthProviderConfig,
    'authMode' | 'includeCredentials' | 'profilePath' | 'logoutPath' | 'logoutMethod'
> = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
    tokenStorageKey: 'auth_token',
    authHeaderName: 'Authorization',
    authHeaderPrefix: 'Bearer',
};

const MODE_DEFAULTS: Record<
    AuthMode,
    Pick<
        AuthProviderConfig,
        'authMode' | 'includeCredentials' | 'profilePath' | 'logoutPath' | 'logoutMethod'
    >
> = {
    // Update profilePath/logoutPath per target project API contract.
    cookie: {
        authMode: 'cookie',
        includeCredentials: true,
        profilePath: API_ENDPOINTS.AUTH.PROFILE,
        logoutPath: API_ENDPOINTS.AUTH.LOGOUT,
        logoutMethod: 'POST',
    },
    bearer: {
        authMode: 'bearer',
        includeCredentials: false,
        profilePath: API_ENDPOINTS.AUTH.PROFILE,
        logoutPath: API_ENDPOINTS.AUTH.LOGOUT,
        logoutMethod: 'POST',
    },
};

// Project-level overrides: update these values per project requirement.
const APP_AUTH_OVERRIDES: Partial<AuthProviderConfig> = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
};

export const DEFAULT_AUTH_CONFIG: AuthProviderConfig = {
    ...COMMON_DEFAULTS,
    ...MODE_DEFAULTS[DEFAULT_AUTH_MODE],
    ...APP_AUTH_OVERRIDES,
};

export const buildAuthConfig = (
    overrides?: Partial<AuthProviderConfig>,
): AuthProviderConfig => {
    const requestedMode: AuthMode = overrides?.authMode ?? DEFAULT_AUTH_MODE;

    return {
        ...COMMON_DEFAULTS,
        ...MODE_DEFAULTS[requestedMode],
        ...APP_AUTH_OVERRIDES,
        ...overrides,
        authMode: requestedMode,
    };
};

export const getAppAuthConfig = (authMode: AuthMode): AuthProviderConfig => {
    return buildAuthConfig({ authMode });
};

export const resolveEndpointUrl = (
    apiBaseUrl: string,
    path: string,
): string => {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const trimmedBase = apiBaseUrl.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${trimmedBase}${normalizedPath}`;
};
