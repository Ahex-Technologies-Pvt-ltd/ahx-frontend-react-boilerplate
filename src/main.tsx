import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/auth-context';



// const authMode = import.meta.env.VITE_AUTH_MODE === 'bearer' ? 'bearer' : 'cookie';
import './index.css';
import App from './App.tsx';
import { ErrorBoundaryClass } from './components/ErrorBoundary.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Toaster } from './components/ui/sonner.tsx';



const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundaryClass  >
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <AuthProvider>
                    <ThemeProvider >
                        <App />
                        <Toaster />
                    </ThemeProvider>
                </AuthProvider>
            </GoogleOAuthProvider>
        </ErrorBoundaryClass>
    </StrictMode>,
);
