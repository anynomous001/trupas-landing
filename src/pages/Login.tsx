import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Shield, Star, Lock as LockIcon, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES } from '../config/routes';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<any>('/auth/login', {
        email: data.emailOrUsername,
        password: data.password,
      });

      setAuth(response.user, response.access_token, response.refresh_token);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Login Form (2/3) */}
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

        {/* Login Form */}
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Log In to Your Account
            </h2>
            <p className="text-text-secondary">
              Welcome back to the Merchant Portal.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}
            {/* Email or Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Email or Username
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="name@company.com"
                  className="pl-10 pr-4"
                  {...register('emailOrUsername')}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>
              {errors.emailOrUsername && (
                <p className="text-sm text-red-500">{errors.emailOrUsername.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border bg-card"
                />
                Remember me
              </label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Log In Button */}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-text-secondary">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-4">
              {/* Google */}
              <button
                type="button"
                className="h-11 rounded-lg border border-border bg-card hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <span className="text-lg font-bold bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  G
                </span>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                className="h-11 rounded-lg border border-border bg-card hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-blue-500"></div>
                  <div className="w-2 h-2 bg-green-500"></div>
                  <div className="w-2 h-2 bg-yellow-500"></div>
                  <div className="w-2 h-2 bg-red-500"></div>
                </div>
              </button>

              {/* Third Option */}
              <button
                type="button"
                className="h-11 rounded-lg border border-border bg-card hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <div className="w-5 h-5 rounded-full border-2 border-text-secondary"></div>
              </button>
            </div>
            {/* SSL Security Message */}
            <div className="flex items-center justify-center gap-2 text-sm text-text-secondary pt-4">
              <LockIcon className="w-4 h-4" />
              <span>Secure SSL encrypted login</span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-text-secondary mt-auto pt-8">
          <div className="flex gap-6">
            <Link to="#" className="hover:text-text-primary">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-text-primary">
              Terms of Service
            </Link>
          </div>
          <p>© 2024 TruePas Inc.</p>
        </div>
      </div>

      {/* Right Side - Background & Testimonial (1/3) */}
      <div className="hidden lg:block w-1/3 relative overflow-hidden">
        {/* Unsplash Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-blue-800/50"></div>
        </div>

        {/* Testimonial Card */}
        <div className="absolute bottom-8 right-8 left-8 bg-card/90 backdrop-blur-sm rounded-lg p-6 border border-border">
          {/* Star Rating */}
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-sm text-text-primary leading-relaxed mb-4">
            "TruePas has completely revolutionized our check-in process. The identity verification is instant, and the merchant portal gives us the oversight we've always needed."
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-card flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-text-primary">David Miller</p>
              <p className="text-xs text-text-secondary">Operations Director, OceanView Resorts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

