'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Mail, Sparkles, Lock, Eye, EyeOff, Check, X, KeyRound } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { checkPasswordRequirements, calculatePasswordStrength } from '@/lib/validation';

type AuthMode = 'password' | 'magic-link';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRequirements = useMemo(
    () => checkPasswordRequirements(password),
    [password]
  );

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );

  const allRequirementsMet = passwordRequirements.every((r) => r.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
      },
    });

    // Clear password fields after submission (security best practice)
    setPassword('');
    setConfirmPassword('');

    if (error) {
      // Handle silently to prevent user enumeration
      // "User already registered" should show same success message
      if (error.message.includes('already registered')) {
        setIsSuccess(true);
      } else {
        setError(error.message);
      }
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setIsLoading(false);
  };

  const handleMagicLinkSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

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

    setIsSuccess(true);
    setIsLoading(false);
  };

  const handleSubmit = authMode === 'password' ? handlePasswordSignUp : handleMagicLinkSignUp;

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'password' ? 'magic-link' : 'password');
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  if (isSuccess) {
    return (
      <div className="p-6 rounded-lg bg-sage/10 border border-sage/20 text-center">
        <Sparkles className="h-12 w-12 text-sage mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {authMode === 'password'
            ? "We've sent you a verification link. Click the link in your email to complete your registration."
            : "We've sent you a magic link. Click the link in your email to sign in."}
        </p>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive an email? Check your spam folder or{' '}
          <button
            onClick={() => {
              setIsSuccess(false);
              setEmail('');
            }}
            className="text-sage hover:underline"
          >
            try again
          </button>
        </p>
      </div>
    );
  }

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

      {/* Password fields (only for password mode) */}
      {authMode === 'password' && (
        <>
          {/* Password field */}
          <div className="space-y-3">
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

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.score
                          ? passwordStrength.color
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.label && (
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-medium">{passwordStrength.label}</span>
                  </p>
                )}
              </div>
            )}

            {/* Password requirements checklist */}
            {password.length > 0 && (
              <ul className="space-y-1">
                {passwordRequirements.map((req) => (
                  <li
                    key={req.label}
                    className={`flex items-center gap-2 text-xs ${
                      req.met ? 'text-green-600 dark:text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    {req.met ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm password field */}
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p
                className={`text-xs flex items-center gap-1 ${
                  passwordsMatch ? 'text-green-600 dark:text-green-500' : 'text-red-500'
                }`}
              >
                {passwordsMatch ? (
                  <>
                    <Check className="h-3 w-3" />
                    Passwords match
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3" />
                    Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={authMode === 'password' && (!allRequirementsMet || !passwordsMatch)}
      >
        {authMode === 'password' ? (
          'Create Account'
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Send Magic Link
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-sage hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
