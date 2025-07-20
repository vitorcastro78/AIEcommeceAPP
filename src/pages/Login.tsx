
// src/pages/login.

import { useState, Suspense, lazy } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { NextPage } from 'next'
import { useauthenticate } from '../hooks/useauthenticate'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import Notification from '../components/Notification/Notification'

const Modal = lazy(() => import('../components/Modal/Modal'))

const LoginPage: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [notification, setNotification] = useState<{ type: 'error' | 'success'; message: string } | null>(null)

  const { mutate: authenticate, isLoading } = useauthenticate({
    onSuccess: (data) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        ;(window as any).gtag('event', 'login', { method: 'email' })
      }
      setNotification({ type: 'success', message: 'Login successful!' })
      setTimeout(() => {
        router.push('/')
      }, 1000)
    },
    onError: (error: any) => {
      setNotification({ type: 'error', message: error?.response?.data?.detail || 'Login failed' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    authenticate({ email, password })
  }

  return (
    <>
      <Head>
        <title>Login | ZippedBeans Subscriptions</title>
        <meta name="description" content="Login to manage your subscriptions and access exclusive products." />
        <meta property="og:title" content="Login | ZippedBeans Subscriptions" />
        <meta property="og:description" content="Login to manage your subscriptions and access exclusive products." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.zippedbeans.com/login" />
      </Head>
      <ErrorBoundary>
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
          <div className="w-full max-w-md px-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Login', href: '/login' },
              ]}
            />
            <div className="bg-white shadow rounded-lg p-8 mt-6">
              <h1 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h1>
              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:underline"
                    onClick={() => setShowModal(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  {isLoading ? <LoadingSpinner /> : 'Sign In'}
                </button>
              </form>
              <div className="mt-6 text-center text-sm">
                Don't have an account?{' '}
                <a href="/register" className="text-indigo-600 hover:underline">
                  Register
                </a>
              </div>
            </div>
          </div>
          {notification && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          )}
          <Suspense fallback={null}>
            {showModal && (
              <Modal onClose={() => setShowModal(false)} title="Forgot Password">
                <div className="p-4">
                  <p className="mb-4">Please contact support to reset your password.</p>
                  <button
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </Modal>
            )}
          </Suspense>
        </main>
      </ErrorBoundary>
    </>
  )
}

export default LoginPage
