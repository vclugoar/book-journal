'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, Home, Library, Palette, Info, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth, UserMenu } from '@/components/auth';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

// Always visible in the main nav bar
const primaryNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Library', href: '/library', icon: Library },
];

// Hidden in hamburger menu
const menuNavItems: NavItem[] = [
  { label: 'Create Collage', href: '/library', icon: Palette, description: 'Make a mood collage' },
  { label: 'About', href: '/about', icon: Info, description: 'About Moodmark' },
  { label: 'Settings', href: '/settings', icon: Settings, description: 'Preferences' },
];

interface NavigationProps {
  children?: React.ReactNode;
  showUserMenu?: boolean;
}

export function Navigation({ children, showUserMenu = true }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-sage" />
            <span className="font-serif text-lg font-semibold">Moodmark</span>
          </Link>

          {/* Primary Navigation - Always visible */}
          <nav className="flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sage/10 text-sage'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Additional actions passed as children */}
            {children}

            {/* User menu */}
            {showUserMenu && user && (
              <UserMenu />
            )}

            {/* Hamburger menu button */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  isMenuOpen ? 'bg-muted' : 'hover:bg-muted'
                )}
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-lg bg-card border border-border shadow-lg overflow-hidden z-50"
                  >
                    <nav className="py-2">
                      {menuNavItems.map((item) => {
                        const isActive = pathname === item.href ||
                          (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 transition-colors',
                              isActive
                                ? 'bg-sage/10 text-sage'
                                : 'text-foreground hover:bg-muted'
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium text-sm">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground">{item.description}</div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Theme Toggle */}
                    <div className="border-t border-border px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Theme</span>
                        <ThemeToggle />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
