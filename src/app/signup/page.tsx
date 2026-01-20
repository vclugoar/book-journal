'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { SignupForm } from '@/components/auth/SignupForm';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SignupPage() {
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
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center relative"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </motion.div>
              </motion.div>
              <h1 className="font-serif text-2xl font-semibold mb-2">Create Your Account</h1>
              <p className="text-muted-foreground">Start capturing the magic of your reads</p>
            </div>

            <SignupForm />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
