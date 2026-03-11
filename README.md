# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            // Other configs...

            // Remove tseslint.configs.recommended and replace with this
            tseslint.configs.recommendedTypeChecked,
            // Alternatively, use this for stricter rules
            tseslint.configs.strictTypeChecked,
            // Optionally, add this for stylistic rules
            tseslint.configs.stylisticTypeChecked,

            // Other configs...
        ],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,
            },
            // other options...
        },
    },
])
```

## Project Work: Task #12 (Auth Context & Provider)

This project includes a reusable auth module for task `#12`.

Implemented location:

- `src/context/auth-context/`

Supporting API layer:

- `src/api/client.ts`
- `src/api/endpoints.ts`
- `src/api/types.ts`
- `src/api/utils.ts`

Main capabilities:

- Calls profile endpoint on provider mount.
- Stores fetched user profile in auth state.
- Exposes `useAuth()` with:
  - `user`
  - `token`
  - `isAuthenticated`
  - `isLoading`
  - `error`
  - `setToken()`
  - `refreshProfile()`
  - `logout()`

### Backend Response Support

The provider is built to handle wrapped API responses like:

- `success: true` with `data`
- `success: false` with `message`, `error.code`, `error.details`

Types are defined in:

- `src/api/types.ts`

The auth provider uses the shared API client (`apiClient.instance`) so it follows common interceptors and normalized error handling used by the rest of the app.

### Auth Modes

The provider supports both reusable modes through config.

1. `cookie` mode (default, production-oriented)
2. `bearer` mode (token storage mode)

Default config file:

- `src/context/auth-context/config.ts`

Auth endpoint defaults now come from shared endpoint constants:

- `API_ENDPOINTS.AUTH.PROFILE`
- `API_ENDPOINTS.AUTH.LOGOUT`

### Session Cookie Clear Flow

In cookie mode, `logout()`:

1. Calls backend logout endpoint (default: `/auth/logout`)
2. Sends request with credentials
3. Clears local auth state

This keeps frontend state deterministic even if network logout fails.

In bearer mode, `logout()` clears the configured token storage key and local auth state.

### How To Use In This Project

App wrapping is in `src/main.tsx`.

Example:

```tsx
const authMode = import.meta.env.VITE_AUTH_MODE === 'bearer' ? 'bearer' : 'cookie';

<AuthProvider config={getAppAuthConfig(authMode)}>
    <App />
</AuthProvider>
```

Set backend URL in env:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_AUTH_MODE=cookie
```

### How To Reuse In Other Projects

To use this in another project:

1. Copy folders `src/context/auth-context/` and `src/api/`
2. Update `src/context/auth-context/config.ts`:
   - `MODE_DEFAULTS.cookie`
   - `MODE_DEFAULTS.bearer`
   - `APP_AUTH_OVERRIDES`
3. Update `src/api/endpoints.ts` if your backend path contracts differ
4. Wrap app root with one provider using mode key only
5. Set env values (`VITE_API_BASE_URL`, `VITE_AUTH_MODE`)
6. Use `useAuth()` in pages/components

Reusable standard pattern:

```tsx
const authMode = import.meta.env.VITE_AUTH_MODE === 'bearer' ? 'bearer' : 'cookie';

<AuthProvider config={getAppAuthConfig(authMode)}>
    <App />
</AuthProvider>
```

Why this is standard:

- `main.tsx` passes only auth mode key.
- Endpoint paths and mode behavior are centralized in `config.ts`.
- Endpoint values are shared through `src/api/endpoints.ts` constants.
- API success/error handling is centralized in `src/api/client.ts` interceptors.
- New projects only edit config defaults/overrides, not provider internals.

Important for reuse across projects:

- Each project may have different auth endpoints.
- Primary update point: `src/api/endpoints.ts`
    - `API_ENDPOINTS.AUTH.PROFILE`
    - `API_ENDPOINTS.AUTH.LOGOUT`
- Optional override point: `src/context/auth-context/config.ts`
    - `MODE_DEFAULTS.cookie.profilePath` / `MODE_DEFAULTS.cookie.logoutPath`
    - `MODE_DEFAULTS.bearer.profilePath` / `MODE_DEFAULTS.bearer.logoutPath`
    - Use this only when a project needs mode-specific endpoint differences.
- Example per project:
    - Project A: `API_ENDPOINTS.AUTH.PROFILE = /auth/profile`, `API_ENDPOINTS.AUTH.LOGOUT = /auth/logout`
    - Project B: `API_ENDPOINTS.AUTH.PROFILE = /users/me`, `API_ENDPOINTS.AUTH.LOGOUT = /session/logout`
    - Project C: `API_ENDPOINTS.AUTH.PROFILE = /v1/account/profile`, `API_ENDPOINTS.AUTH.LOGOUT = /v1/auth/signout`

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            // Other configs...
            // Enable lint rules for React
            reactX.configs['recommended-typescript'],
            // Enable lint rules for React DOM
            reactDom.configs.recommended,
        ],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.node.json', './tsconfig.app.json'],
                tsconfigRootDir: import.meta.dirname,
            },
            // other options...
        },
    },
])
```
