
// src/pages/subscriptions.

import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Suspense, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useubscription } from '../hooks/useubscription'
import { useproduct } from '../hooks/useproduct'
import { usecustomer } from '../hooks/usecustomer'
import { usepayment } from '../hooks/usepayment'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import Notification from '../components/Notification/Notification'
import { trackPageView } from '../utils/analytics'

const SubscriptionsSummary = dynamic(() => import('../components/SubscriptionsSummary/SubscriptionsSummary'), { ssr: false, loading: () => <LoadingSpinner /> })
const ProductList = dynamic(() => import('../components/ProductList/ProductList'), { ssr: false, loading: () => <LoadingSpinner /> })
const ShoppingCart = dynamic(() => import('../components/ShoppingCart/ShoppingCart'), { ssr: false, loading: () => <LoadingSpinner /> })
const CheckoutForm = dynamic(() => import('../components/CheckoutForm/CheckoutForm'), { ssr: false, loading: () => <LoadingSpinner /> })

const SubscriptionsPage: NextPage = () => {
  const router = useRouter()
  const { data: subscriptions, isLoading: loadingSubs, error: errorSubs } = useubscription()
  const { data: products, isLoading: loadingProducts, error: errorProducts } = useproduct()
  const { data: customer, isLoading: loadingCustomer, error: errorCustomer } = usecustomer()
  const { data: paymentMethods, isLoading: loadingPayment, error: errorPayment } = usepayment()

  useMemo(() => {
    trackPageView('Subscriptions')
  }, [])

  const breadcrumbs = useMemo(() => [
    { label: 'Home', href: '/' },
    { label: 'Subscriptions', href: '/subscriptions' }
  ], [])

  if (loadingSubs || loadingProducts || loadingCustomer || loadingPayment) {
    return <LoadingSpinner />
  }

  if (errorSubs || errorProducts || errorCustomer || errorPayment) {
    return (
      <Notification
        type="error"
        message="An error occurred while loading your subscriptions. Please try again."
      />
    )
  }

  return (
    <>
      <Head>
        <title>Subscriptions | ZippedBeans</title>
        <meta name="description" content="Manage your subscriptions, view available plans, and update your preferences on ZippedBeans." />
        <meta property="og:title" content="Subscriptions | ZippedBeans" />
        <meta property="og:description" content="Manage your subscriptions, view available plans, and update your preferences on ZippedBeans." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.zippedbeans.com/subscriptions" />
      </Head>
      <ErrorBoundary>
        <main>
          <Breadcrumb items={breadcrumbs} />
          <section>
            <h1 className="text-3xl font-bold mb-4">Your Subscriptions</h1>
            <Suspense fallback={<LoadingSpinner />}>
              <SubscriptionsSummary subscriptions={subscriptions} customer={customer} />
            </Suspense>
          </section>
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Available Plans</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <ProductList products={products} />
            </Suspense>
          </section>
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Your Cart</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <ShoppingCart />
            </Suspense>
          </section>
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-2">Checkout</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <CheckoutForm customer={customer} paymentMethods={paymentMethods} />
            </Suspense>
          </section>
        </main>
      </ErrorBoundary>
    </>
  )
}

export default SubscriptionsPage

