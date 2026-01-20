'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback?next=/reset-password`,
    });

    // Always show success message to prevent user enumeration
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-sage" />
              <span className="font-serif text-lg font-semibold">Moodmark</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-xl border border-border shadow-sm p-8">
            {isSubmitted ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/10 flex items-center justify-center"
                >
                  <Sparkles className="h-8 w-8 text-sage" />
                </motion.div>
                <h1 className="font-serif text-2xl font-semibold mb-2">Check your email</h1>
                <p className="text-muted-foreground mb-6">
                  If an account exists for {email}, you&apos;ll receive a password reset link shortly.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Didn&apos;t receive an email? Check your spam folder or make sure you entered the correct email address.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sage hover:underline font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Mail className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </motion.div>
                  <h1 className="font-serif text-2xl font-semibold mb-2">Forgot password?</h1>
                  <p className="text-muted-foreground">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>

                  <p className="text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sage transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to sign in
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
