import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import { AuthProvider, getAppAuthConfig } from './context/auth-context';



const authMode = import.meta.env.VITE_AUTH_MODE === 'bearer' ? 'bearer' : 'cookie';
import './index.css';



const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById('root')!).render(
    <StrictMode>            
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>           
            <AuthProvider config={getAppAuthConfig(authMode)}>
                <App />
            </AuthProvider>           
        </GoogleOAuthProvider>          
    </StrictMode>,
);
