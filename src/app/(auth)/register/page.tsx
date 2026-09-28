'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerSchema, type RegisterSchema } from '@/lib/validations';
import { toast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({ title: 'Registration Failed', description: result.error, variant: 'destructive' });
        return;
      }

      toast({ title: 'Account Created!', description: 'Welcome to EduPro! You are now logged in.', variant: 'default' });
      window.location.href = '/student';
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/30">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold gradient-text">EduPro</span>
          </Link>
          <h1 className="text-3xl font-heading font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-2">Join 50,000+ students learning on EduPro</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            'Access free courses',
            'Live interactive classes',
            'Expert teachers',
            'Performance tracking',
          ].map(benefit => (
            <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="form-label mb-1.5 block">Full Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

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
              <label htmlFor="phone" className="form-label mb-1.5 block">
                Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
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
              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength.textColor}`}>{passwordStrength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="referralCode" className="form-label mb-1.5 block">
                Referral Code <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                id="referralCode"
                type="text"
                placeholder="Enter referral code"
                {...register('referralCode')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              variant="gradient"
              loading={isSubmitting}
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By registering, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  textColor: string;
} {
  if (!password) return { score: 0, label: '', color: 'bg-muted', textColor: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 1, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-600' },
    { score: 2, label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' },
    { score: 3, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' },
    { score: 4, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  ];

  return levels[score - 1] || levels[0];
}
