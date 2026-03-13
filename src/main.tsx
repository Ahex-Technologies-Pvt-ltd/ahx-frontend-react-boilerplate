import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';



import './index.css';
import { ErrorBoundaryClass } from './components/ErrorBoundary.tsx';
import { AuthProvider } from './context/AuthContext.tsx';



const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string || "hvjfhv";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundaryClass  >
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </GoogleOAuthProvider>
        </ErrorBoundaryClass>
    </StrictMode>,
);
