
// src/layouts/AdminLayout.
import React, { ReactNode, useContext, useState } from 'react';
import { ThemeContext, ThemeProvider } from '../contexts/ThemeContext';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import Notification from '../components/Notification/Notification';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from '../components/Modal/Modal';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import { useRouter } from 'next/router';

type AdminLayoutProps = {
  children: ReactNode;
  loading?: boolean;
};

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Subscriptions', href: '/subscriptions' },
  { name: 'Invoices', href: '/invoices' },
  { name: 'Profile', href: '/profile' },
  { name: 'Cart', href: '/cart' },
];

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <button
            aria-label="Open navigation"
            className="md:hidden mr-2"
            onClick={() => setNavOpen(!navOpen)}
          >
            <svg className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span
            className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
            tabIndex={0}
            onClick={() => router.push('/')}
          >
            ZippedBeans Admin
          </span>
        </div>
        <nav className="hidden md:flex space-x-6" aria-label="Main navigation">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-current={router.pathname === link.href ? 'page' : undefined}
            >
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {theme === 'dark' ? (
              <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.03a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.03 4.22a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.03a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.03-4.22a1 1 0 00-1.42-1.42l-.7.7a1 1 0 001.42 1.42l.7-.7z" />
                <circle cx="10" cy="10" r="3" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {navOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="block text-gray-700 dark:text-gray-200 py-2 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-current={router.pathname === link.href ? 'page' : undefined}
              onClick={() => setNavOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>&copy; {new Date().getFullYear()} ZippedBeans. All rights reserved.</span>
        <nav className="flex space-x-4 mt-2 md:mt-0" aria-label="Footer navigation">
          <a href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">Privacy</a>
          <a href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">Terms</a>
        </nav>
      </div>
    </footer>
  );
}

export default function AdminLayout({ children, loading }: AdminLayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <Notification />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6" tabIndex={-1}>
          <Breadcrumb />
          <ErrorBoundary>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              children
            )}
          </ErrorBoundary>
        </main>
        <Footer />
        <Modal />
      </div>
    </ThemeProvider>
  );
}



// src/contexts/ThemeContext.
import React, { createContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
