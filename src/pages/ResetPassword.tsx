import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../config/routes';
import { api } from '../lib/api';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = (): JSX.Element => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await api.post('/auth/reset-password', {
                token,
                new_password: data.password,
            });
            setIsSuccess(true);
            // Automatically redirect after 3 seconds
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-6">
                    <h2 className="text-3xl font-bold text-text-primary">Invalid Link</h2>
                    <p className="text-text-secondary">
                        This password reset link is invalid or has expired.
                    </p>
                    <div className="pt-4 text-center">
                        <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary hover:underline">
                            Request a new link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">Password Reset!</h2>
                    <p className="text-text-secondary">
                        Your password has been successfully updated. Redirecting you to login...
                    </p>
                    <div className="pt-4">
                        <Link to={ROUTES.LOGIN}>
                            <Button className="w-full">
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            <div className="flex-1 flex flex-col p-8 lg:w-2/3">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center border border-border">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">TruePas</h1>
                    </div>
                </div>

                {/* Reset Password Form */}
                <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">
                            Set New Password
                        </h2>
                        <p className="text-text-secondary">
                            Please enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="At least 8 characters"
                                    className="pl-10 pr-10"
                                    {...register('password')}
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Repeat new password"
                                    className="pl-10 mr-10"
                                    {...register('confirmPassword')}
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center text-sm text-text-secondary mt-auto pt-8">
                    <p>© 2024 TruePas Inc.</p>
                </div>
            </div>

            {/* Decorative Right Side */}
            <div className="hidden lg:block w-1/3 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1444464666168-49d633b867ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-blue-800/50"></div>
                </div>
            </div>
        </div>
    );
};
