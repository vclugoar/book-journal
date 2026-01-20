'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from './AuthProvider';

interface UserMenuProps {
  isSyncing?: boolean;
  lastSyncTime?: string | null;
}

export function UserMenu({ isSyncing = false, lastSyncTime }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  if (!user) return null;

  const email = user.email || 'User';
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white text-sm font-medium">
          {initial}
        </div>
        {isSyncing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Cloud className="h-4 w-4 text-sage" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-lg bg-card border border-border shadow-lg z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white font-medium">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{email}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {isSyncing ? (
                      <>
                        <Cloud className="h-3 w-3 text-sage" />
                        <span>Syncing...</span>
                      </>
                    ) : lastSyncTime ? (
                      <>
                        <Cloud className="h-3 w-3 text-sage" />
                        <span>Synced</span>
                      </>
                    ) : (
                      <>
                        <CloudOff className="h-3 w-3" />
                        <span>Not synced</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
