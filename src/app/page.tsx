'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Heart, Palette, LogIn } from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/components/auth';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to library if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/library');
    }
  }, [user, isLoading, router]);

  const features = [
    {
      icon: Sparkles,
      title: 'Whimsical Ratings',
      description: 'Rate books by magic level, coziness, and how likely you are to miss your stop',
    },
    {
      icon: Heart,
      title: 'Guided Prompts',
      description: 'Capture the essence of each book through sensory and imaginative questions',
    },
    {
      icon: Palette,
      title: 'Mood Collages',
      description: 'Build beautiful visual collages that capture the feeling of your favorite reads',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-sage" />
              <span className="font-serif text-lg font-semibold">Moodmark</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <Link href="/library">
                  <Button variant="primary" size="sm">
                    Open Journal
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Capture the{' '}
              <span className="gradient-text">magic</span>
              {' '}of your reading adventures
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              A delightful, local-first reading journal that goes beyond star ratings.
              Capture the feeling of every book through whimsical prompts and beautiful collages.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <>
                  <Link href="/library">
                    <Button size="lg" className="w-full sm:w-auto">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Open Your Journal
                    </Button>
                  </Link>
                  <Link href="/book/new">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Add a Book
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="relative p-6 rounded-xl bg-card shadow-sm border border-border/50"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative Elements */}
          <div className="mt-24 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
                <span>Works offline, syncs across devices</span>
                <span className="text-sage">Cloud-enabled</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>A cozy corner for your reading memories</p>
        </div>
      </footer>
    </div>
  );
}
