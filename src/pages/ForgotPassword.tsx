import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../config/routes';
import { api } from '../lib/api';

const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post('/auth/forgot-password', {
                email: data.email,
            });
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">Check your email</h2>
                    <p className="text-text-secondary">
                        If an account exists with that email, we've sent a password reset link.
                    </p>
                    <div className="pt-4">
                        <Link to={ROUTES.LOGIN}>
                            <Button variant="secondary" className="w-full">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Form (2/3) */}
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
                    <Link
                        to={ROUTES.LOGIN}
                        className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>

                {/* Forgot Password Form */}
                <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">
                            Forgot Password?
                        </h2>
                        <p className="text-text-secondary">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10"
                                    {...register('email')}
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center text-sm text-text-secondary mt-auto pt-8">
                    <p>© 2024 TruePas Inc.</p>
                </div>
            </div>

            {/* Right Side - Decorative (1/3) */}
            <div className="hidden lg:block w-1/3 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-blue-800/50"></div>
                </div>
            </div>
        </div>
    );
};
