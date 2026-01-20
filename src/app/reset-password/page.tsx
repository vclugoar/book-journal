'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Lock, Eye, EyeOff, Check, X, KeyRound } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { createClient } from '@/lib/supabase/client';
import { checkPasswordRequirements, calculatePasswordStrength } from '@/lib/validation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    const { error } = await supabase.auth.updateUser({
      password,
    });

    // Clear password fields after submission
    setPassword('');
    setConfirmPassword('');

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Redirect to library on success
    router.push('/library');
    router.refresh();
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
            <div className="text-center mb-8">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <KeyRound className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </motion.div>
              <h1 className="font-serif text-2xl font-semibold mb-2">Set new password</h1>
              <p className="text-muted-foreground">
                Create a strong password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password field */}
              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
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
                    placeholder="Confirm new password"
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

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={!allRequirementsMet || !passwordsMatch}
              >
                Reset Password
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
