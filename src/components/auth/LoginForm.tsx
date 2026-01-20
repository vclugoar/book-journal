'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Sparkles, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

type AuthMode = 'password' | 'magic-link';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Generic error message to prevent user enumeration
      setError('Invalid email or password');
      setPassword(''); // Clear password on error
      setIsLoading(false);
      return;
    }

    router.push('/library');
    router.refresh();
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setMessage('Check your email for the magic link!');
    setIsLoading(false);
  };

  const handleSubmit = authMode === 'password' ? handlePasswordSignIn : handleMagicLink;

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'password' ? 'magic-link' : 'password');
    setError(null);
    setMessage(null);
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auth mode toggle */}
      <div className="flex rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => authMode !== 'password' && toggleAuthMode()}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            authMode === 'password'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Password
        </button>
        <button
          type="button"
          onClick={() => authMode !== 'magic-link' && toggleAuthMode()}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            authMode === 'magic-link'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Magic Link
        </button>
      </div>

      {/* Email field */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10"
          required
        />
      </div>

      {/* Password field (only for password mode) */}
      {authMode === 'password' && (
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-sage transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {message && (
        <div className="p-4 rounded-lg bg-sage/10 border border-sage/20 text-center">
          <Sparkles className="h-8 w-8 text-sage mx-auto mb-2" />
          <p className="text-sm text-foreground">{message}</p>
          <p className="text-xs text-muted-foreground mt-1">Click the link in your email to continue</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        {authMode === 'password' ? (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            Sign In
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Send Magic Link
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-sage hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
