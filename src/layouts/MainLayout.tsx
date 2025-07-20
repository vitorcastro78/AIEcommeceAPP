
// src/layouts/MainLayout.
import React, { ReactNode, createContext, useContext, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import Notification from '../components/Notification/Notification'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'

type Theme = 'light' | 'dark'
type ThemeContextType = { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

type MainLayoutProps = {
  children: ReactNode
  loading?: boolean
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/subscriptions', label: 'Subscriptions' },
  { href: '/cart', label: 'Cart' },
  { href: '/invoices', label: 'Invoices' },
  { href: '/profile', label: 'Profile' },
]

export default function MainLayout({ children, loading }: MainLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const [navOpen, setNavOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow z-20">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" aria-label="Go to homepage" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ZippedBeans
          </Link>
          <nav aria-label="Main navigation" className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  router.pathname === link.href
                    ? 'text-primary-600 dark:text-primary-400 font-semibold'
                    : 'hover:text-primary-500 dark:hover:text-primary-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {theme === 'dark' ? (
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71-.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71.71" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              )}
            </button>
            <button
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setNavOpen((v) => !v)}
            >
              <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {navOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2" aria-label="Mobile navigation">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      router.pathname === link.href
                        ? 'text-primary-600 dark:text-primary-400 font-semibold'
                        : 'hover:text-primary-500 dark:hover:text-primary-300'
                    }`}
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <Notification />
      <main className="flex-1 container mx-auto px-4 py-6 w-full max-w-7xl">
        <Breadcrumb />
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]" aria-busy="true">
            <LoadingSpinner />
          </div>
        ) : (
          <div>{children}</div>
        )}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-6 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold">ZippedBeans</span> &copy; {new Date().getFullYear()}
          </div>
          <nav aria-label="Footer navigation" className="flex gap-4">
            <Link href="/privacy" className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500">Privacy</Link>
            <Link href="/terms" className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500">Terms</Link>
            <Link href="/contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

