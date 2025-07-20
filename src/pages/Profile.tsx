
// src/pages/profile.

import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import { useRouter } from 'next/router'
import { usecustomer } from '../hooks/usecustomer'
import { useubscription } from '../hooks/useubscription'
import { useinvoice } from '../hooks/useinvoice'
import { usepaymentMethod } from '../hooks/usepayment-method'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import Notification from '../components/Notification/Notification'

const UserProfile = dynamic(() => import('../components/UserProfile/UserProfile'), { ssr: false, loading: () => <LoadingSpinner /> })
const SubscriptionsSummary = dynamic(() => import('../components/SubscriptionsSummary/SubscriptionsSummary'), { ssr: false, loading: () => <LoadingSpinner /> })
const InvoicesList = dynamic(() => import('../components/InvoicesList/InvoicesList'), { ssr: false, loading: () => <LoadingSpinner /> })
const AddressForm = dynamic(() => import('../components/AddressForm/AddressForm'), { ssr: false, loading: () => <LoadingSpinner /> })
const PaymentForm = dynamic(() => import('../components/PaymentForm/PaymentForm'), { ssr: false, loading: () => <LoadingSpinner /> })

const ProfilePage: NextPage = () => {
  const router = useRouter()
  const { data: customer, isLoading: loadingCustomer, error: errorCustomer } = usecustomer()
  const { data: subscriptions, isLoading: loadingSubscriptions, error: errorSubscriptions } = useubscription()
  const { data: invoices, isLoading: loadingInvoices, error: errorInvoices } = useinvoice()
  const { data: paymentMethods, isLoading: loadingPayment, error: errorPayment } = usepaymentMethod()

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', { page_title: 'Profile', page_path: router.pathname })
    }
  }, [router.pathname])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Profile', href: '/profile' }
  ]

  return (
    <>
      <Head>
        <title>Profile | My Subscriptions</title>
        <meta name="description" content="Manage your subscriptions, invoices, payment methods and personal information." />
        <meta property="og:title" content="Profile | My Subscriptions" />
        <meta property="og:description" content="Manage your subscriptions, invoices, payment methods and personal information." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.yoursite.com/profile" />
      </Head>
      <main>
        <Breadcrumb items={breadcrumbs} />
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            {errorCustomer && <Notification type="error" message="Failed to load profile." />}
            <UserProfile user={customer} loading={loadingCustomer} />
          </Suspense>
        </ErrorBoundary>
        <section>
          <h2>Subscriptions</h2>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {errorSubscriptions && <Notification type="error" message="Failed to load subscriptions." />}
              <SubscriptionsSummary subscriptions={subscriptions} loading={loadingSubscriptions} />
            </Suspense>
          </ErrorBoundary>
        </section>
        <section>
          <h2>Invoices</h2>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {errorInvoices && <Notification type="error" message="Failed to load invoices." />}
              <InvoicesList invoices={invoices} loading={loadingInvoices} />
            </Suspense>
          </ErrorBoundary>
        </section>
        <section>
          <h2>Payment Methods</h2>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {errorPayment && <Notification type="error" message="Failed to load payment methods." />}
              <PaymentForm paymentMethods={paymentMethods} loading={loadingPayment} />
            </Suspense>
          </ErrorBoundary>
        </section>
        <section>
          <h2>Address</h2>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AddressForm user={customer} loading={loadingCustomer} />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </>
  )
}

export default ProfilePage

