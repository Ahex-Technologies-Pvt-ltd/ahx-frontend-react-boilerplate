import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider, getAppAuthConfig } from './context/auth-context';



const authMode = import.meta.env.VITE_AUTH_MODE === 'bearer' ? 'bearer' : 'cookie';



createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider config={getAppAuthConfig(authMode)}>
            <App />
        </AuthProvider>
    </StrictMode>,
);
