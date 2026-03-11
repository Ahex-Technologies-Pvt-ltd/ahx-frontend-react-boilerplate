const hasWindow = (): boolean => typeof window !== 'undefined';

export const getStoredToken = (tokenStorageKey: string): string | null => {
    if (!hasWindow()) {
        return null;
    }

    try {
        return window.localStorage.getItem(tokenStorageKey);
    } catch {
        return null;
    }
};

export const setStoredToken = (
    tokenStorageKey: string,
    token: string | null,
): void => {
    if (!hasWindow()) {
        return;
    }

    try {
        if (token) {
            window.localStorage.setItem(tokenStorageKey, token);
            return;
        }

        window.localStorage.removeItem(tokenStorageKey);
    } catch {
        // Ignore storage exceptions and keep in-memory state usable.
    }
};
