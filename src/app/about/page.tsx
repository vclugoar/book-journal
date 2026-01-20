'use client';

import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Heart, Palette, Cloud, Shield } from 'lucide-react';
import { Navigation } from '@/components/layout';

export default function AboutPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Whimsical Ratings',
      description: 'Go beyond stars with ratings like "Overall Magic", "Coziness Level", and "Missed My Stop Risk".',
    },
    {
      icon: Heart,
      title: 'Guided Prompts',
      description: 'Capture the essence of each book through sensory questions about seasons, scents, and reading spots.',
    },
    {
      icon: Palette,
      title: 'Mood Collages',
      description: 'Create beautiful visual collages that capture the feeling and aesthetic of your favorite reads.',
    },
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Your reading journal syncs across devices. Works offline too with local-first storage.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is yours. We use secure authentication and never share your reading history.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="font-serif text-4xl font-bold mb-4">About Moodmark</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A delightful reading journal that goes beyond star ratings to capture the true feeling of your reading adventures.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-neutral dark:prose-invert max-w-none mb-12"
        >
          <h2 className="font-serif">Why Moodmark?</h2>
          <p>
            Traditional book tracking apps focus on what you read and when. Moodmark focuses on
            <em> how books made you feel</em>. Because the best books aren&apos;t just stories—they&apos;re
            experiences that transport us to different worlds, seasons, and states of mind.
          </p>
          <p>
            Whether it&apos;s the cozy feeling of a rainy-day mystery or the exhilaration of an
            adventure epic, Moodmark helps you capture and remember those magical reading moments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-sage" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center p-8 rounded-xl bg-muted/50"
        >
          <p className="text-muted-foreground">
            Made with love for readers who believe books are more than just words on a page.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
