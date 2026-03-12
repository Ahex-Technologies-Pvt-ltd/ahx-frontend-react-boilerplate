import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { DynamicForm } from '@/components/forms/DynamicForm';
import { Button } from '@/components/ui/button';
import { authService } from '@/services';
import { registerSchema, type RegisterFormData } from '@/validations/authValidation';
import type { FormFieldConfig } from '@/components/forms/types';



const registerFields: FormFieldConfig[] = [
    {
        name: 'name',
        type: 'input',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true,
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'you@example.com',
        required: true,
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Min 8 characters',
        description: 'Must contain at least one uppercase letter and one number',
        required: true,
    },
    {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Re-enter your password',
        required: true,
    },
];

const defaultValues: RegisterFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = useCallback(
        async (data: RegisterFormData) => {
            setIsLoading(true);
            setError(null);
            await authService.register(data, {
                onSuccess: () => {
                    navigate('/dashboard');
                },
                onError: (err) => {
                    setError(err.message);
                },
            });
            setIsLoading(false);
        },
        [navigate],
    );

    const handleGoogleSignUp = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            setError(null);
            await authService.googleAuth(
                { token: tokenResponse.access_token },
                {
                    onSuccess: () => {
                        navigate('/dashboard');
                    },
                    onError: (err) => {
                        setError(err.message);
                    },
                },
            );
            setGoogleLoading(false);
        },
        onError: () => {
            setError('Google sign-up failed. Please try again.');
            setGoogleLoading(false);
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">Sign up to get started today</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    {/* Server error */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Register Form */}
                    <DynamicForm<RegisterFormData>
                        schema={registerSchema}
                        defaultValues={defaultValues}
                        fields={registerFields}
                        onSubmit={handleSubmit}
                        submitButtonText={isLoading ? 'Creating account...' : 'Create Account'}
                    />

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-3 text-gray-500">or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-Up */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-3"
                        onClick={() => handleGoogleSignUp()}
                        disabled={googleLoading || isLoading}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        {googleLoading ? 'Signing up with Google...' : 'Sign up with Google'}
                    </Button>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
