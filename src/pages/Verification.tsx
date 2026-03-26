import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/ui/spinner';
import ResendVerification from '@/components/ResendVerification';
import { authService } from '@/services';
import { showToast } from '@/lib/toast';



export default function Verification() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            handleVerification();
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleVerification = async () => {
        if (!token) return;

        setLoading(true);

        authService.verifyEmail(
            { token },
            {
                onSuccess: () => {
                    setVerified(true);
                    setLoading(false);
                    showToast('Email verified successfully!', 'success');
                    setTimeout(() => navigate('/login'), 2000);
                },
                onError: (err) => {
                    setLoading(false);
                    setVerified(false);
                    showToast(err.message || 'Verification failed', 'error');
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Email Verification
                    </h1>
                </div>

                {/* Loading State */}
                {loading && (
                    <Card className="shadow-sm">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Spinner size="lg" center />
                            </div>
                            <CardTitle className="text-xl">Verifying Email</CardTitle>
                            <CardDescription>
                                Please wait while we verify your email address...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                {/* Verified State */}
                {!loading && verified && (
                    <Card className="shadow-sm">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                            <CardTitle className="text-xl text-green-700">
                                Email Verified!
                            </CardTitle>
                            <CardDescription>
                                Your email has been successfully verified. Redirecting to login...
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="default" className="w-full">
                                <Link to="/login">Continue to Login</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Failed State or No Token - Show Resend Component */}
                {!loading && !verified && (
                    <div className="space-y-6">
                        {token && (
                            <Card className="shadow-sm">
                                <CardHeader className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                            <XCircle className="w-8 h-8 text-red-600" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl text-red-700">
                                        Verification Failed
                                    </CardTitle>
                                    <CardDescription className="text-red-600">
                                        The verification link is invalid or has expired.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        )}

                        {/* Resend Verification Component */}
                        <ResendVerification />

                        {/* Back to Login */}
                        <div className="text-center">
                            <Button asChild variant="ghost" className="text-sm">
                                <Link to="/login">Back to Login</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
