'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Download, Trash2, User, LogOut } from 'lucide-react';
import { Navigation } from '@/components/layout';
import { Button } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { useBookStore } from '@/stores/bookStore';
import { useAuth } from '@/components/auth';
import { getAllBooks, getAllCollages, deleteAllBooks } from '@/lib/db';
import { exportLibraryAsJSON, exportLibraryAsCSV } from '@/lib/export';
import type { Theme } from '@/types';

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  const { setBooks } = useBookStore();
  const { user, signOut } = useAuth();
  const addToast = useUIStore((state) => state.addToast);
  const [isDeleting, setIsDeleting] = useState(false);

  const themeOptions: { value: Theme; label: string; icon: React.ElementType }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const handleExportJSON = async () => {
    const [allBooks, allCollages] = await Promise.all([
      getAllBooks(),
      getAllCollages(),
    ]);
    exportLibraryAsJSON(allBooks, allCollages);
    addToast({
      type: 'success',
      message: `Exported ${allBooks.length} books as JSON backup`,
    });
  };

  const handleExportCSV = async () => {
    const allBooks = await getAllBooks();
    exportLibraryAsCSV(allBooks);
    addToast({
      type: 'success',
      message: `Exported ${allBooks.length} books as CSV`,
    });
  };

  const handleDeleteAllData = async () => {
    if (!confirm('Are you sure you want to delete ALL your local data? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAllBooks();
      setBooks([]);
      addToast({
        type: 'success',
        message: 'All local data has been deleted',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Failed to delete data',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    addToast({
      type: 'info',
      message: 'You have been signed out',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-3xl font-bold mb-8">Settings</h1>

          {/* Account Section */}
          {user && (
            <section className="mb-8 p-6 rounded-xl bg-card border border-border">
              <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Account
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </section>
          )}

          {/* Theme Section */}
          <section className="mb-8 p-6 rounded-xl bg-card border border-border">
            <h2 className="font-serif text-xl font-semibold mb-4">Appearance</h2>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme === option.value
                      ? 'border-sage bg-sage/10'
                      : 'border-border hover:border-sage/50'
                  }`}
                >
                  <option.icon className={`h-6 w-6 ${theme === option.value ? 'text-sage' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${theme === option.value ? 'text-sage' : ''}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Data Export Section */}
          <section className="mb-8 p-6 rounded-xl bg-card border border-border">
            <h2 className="font-serif text-xl font-semibold mb-4">Export Data</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Download your reading journal data for backup or transfer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleExportJSON}>
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="p-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
            <h2 className="font-serif text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete all your local data. If you&apos;re signed in, your cloud data will remain intact.
            </p>
            <Button
              variant="danger"
              onClick={handleDeleteAllData}
              isLoading={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Local Data
            </Button>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
