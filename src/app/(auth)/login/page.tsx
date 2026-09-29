'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginSchema } from '@/lib/validations';
import { toast } from '@/hooks/use-toast';
import { useBranding } from '@/hooks/use-branding';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';
  const [showPassword, setShowPassword] = useState(false);
  const { siteName, logoUrl } = useBranding();
  const { isLoggedIn, dashboardUrl, mounted } = useAuth();

  useEffect(() => {
    if (mounted && isLoggedIn) {
      router.replace(dashboardUrl);
    }
  }, [mounted, isLoggedIn, dashboardUrl, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({ title: 'Login Failed', description: result.error, variant: 'destructive' });
        return;
      }

      toast({ title: 'Welcome back!', description: 'Login successful', variant: 'default' });

      // Save user info locally and dispatch event
      if (result.data) {
        try {
          localStorage.setItem('auth_user', JSON.stringify(result.data));
          window.dispatchEvent(new CustomEvent('auth-state-changed'));
        } catch {}
      }

      // Redirect based on role
      const role = result.data?.role;
      let target = '/student';
      if (role === 'ADMIN') target = '/admin';
      else if (role === 'TEACHER') target = '/teacher';
      else if (role === 'PARENT') target = '/parent';

      if (from && from !== '/' && !from.includes('/login') && !from.includes('/register')) {
        target = from;
      }
      window.location.href = target;
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-10 w-auto max-h-10 max-w-[200px] object-contain transition-transform group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-heading font-bold gradient-text">{siteName}</span>
                </>
              )}
            </Link>
            <h1 className="text-3xl font-heading font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label mb-1.5 block">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="form-label">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              variant="gradient"
              loading={isSubmitting}
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-background px-2">New to CyberMate Solutions?</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg" asChild>
            <Link href="/register">Create a free account</Link>
          </Button>

          {/* Demo credentials */}
          <div className="rounded-xl bg-muted/50 border border-border p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p>Admin: <span className="font-mono text-primary">admin@cybermatesolutions.com</span> / <span className="font-mono">Admin@123</span></p>
              <p>Student: <span className="font-mono text-primary">student@cybermatesolutions.com</span> / <span className="font-mono">Student@123</span></p>
              <p>Teacher: <span className="font-mono text-primary">teacher@cybermatesolutions.com</span> / <span className="font-mono">Teacher@123</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-brand-600 via-brand-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 text-white text-center px-12">
          <div className="text-6xl mb-6">🎓</div>
          <h2 className="text-3xl font-heading font-bold mb-4">Learn, Grow, Succeed</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Access 200+ courses, live classes, and expert teachers on India's most trusted education platform.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: '50K+', label: 'Students' },
              { value: '200+', label: 'Courses' },
              { value: '50+', label: 'Teachers' },
              { value: '98%', label: 'Success Rate' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
