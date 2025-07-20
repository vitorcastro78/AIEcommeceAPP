
// src/layouts/AuthLayout.
import React, { ReactNode, useContext } from 'react';
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';
import { Notification } from '../components/Notification/Notification';
import { Modal } from '../components/Modal/Modal';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import { ThemeContext } from '../context/ThemeContext';
import { useRouter } from 'next/router';

type AuthLayoutProps = {
  children: ReactNode;
  loading?: boolean;
};

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Subscriptions', href: '/subscriptions' },
  { name: 'Invoices', href: '/invoices' },
  { name: 'Profile', href: '/profile' },
];

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, loading }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen flex flex-col`}>
      <header className="w-full shadow bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              aria-label="Go to home"
              className="text-2xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => router.push('/')}
            >
              ZippedBeans
            </button>
            <nav aria-label="Main navigation" className="hidden md:flex gap-6">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-current={router.pathname === link.href ? 'page' : undefined}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => router.push('/cart')}
              aria-label="View shopping cart"
              className="relative rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L19 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
              </svg>
            </button>
            <button
              onClick={() => router.push('/profile')}
              aria-label="Go to profile"
              className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="md:hidden flex gap-4 px-4 pb-2" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-current={router.pathname === link.href ? 'page' : undefined}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-4">
        <Breadcrumb />
        <Notification />
        <ErrorBoundary>
          <Modal />
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]" aria-busy="true">
              <LoadingSpinner />
            </div>
          ) : (
            children
          )}
        </ErrorBoundary>
      </main>
      <footer className="w-full bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} ZippedBeans. All rights reserved.
          </div>
          <nav className="flex gap-4">
            <a href="/privacy" className="text-sm hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">Privacy</a>
            <a href="/terms" className="text-sm hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">Terms</a>
            <a href="/contact" className="text-sm hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

