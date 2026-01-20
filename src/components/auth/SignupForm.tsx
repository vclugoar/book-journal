'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Sparkles } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
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

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
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
        <Sparkles className="mr-2 h-4 w-4" />
        Send Magic Link
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
