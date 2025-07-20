
// src/pages/checkout.

import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Suspense, useCallback } from 'react'
import { useRouter } from 'next/router'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import Notification from '../components/Notification/Notification'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { usecustomer } from '../hooks/usecustomer'
import { usepaymentMethod } from '../hooks/usepayment-method'
import { useubscription } from '../hooks/useubscription'
import { useproduct } from '../hooks/useproduct'

const SubscriptionsSummary = dynamic(() => import('../components/SubscriptionsSummary/SubscriptionsSummary'), { ssr: false, loading: () => <LoadingSpinner /> })
const CheckoutForm = dynamic(() => import('../components/CheckoutForm/CheckoutForm'), { ssr: false, loading: () => <LoadingSpinner /> })
const PaymentForm = dynamic(() => import('../components/PaymentForm/PaymentForm'), { ssr: false, loading: () => <LoadingSpinner /> })
const AddressForm = dynamic(() => import('../components/AddressForm/AddressForm'), { ssr: false, loading: () => <LoadingSpinner /> })

const CheckoutPage: NextPage = () => {
  const router = useRouter()
  const { data: customer, isLoading: customerLoading, error: customerError } = usecustomer()
  const { data: paymentMethods, isLoading: paymentLoading, error: paymentError } = usepaymentMethod()
  const { data: subscriptions, isLoading: subscriptionLoading, error: subscriptionError } = useubscription()
  const { data: products, isLoading: productsLoading, error: productsError } = useproduct()

  const handleCheckoutSuccess = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        event_category: 'ecommerce',
        event_label: 'subscription_checkout',
        value: subscriptions?.totalPrice || 0,
      })
    }
    router.push('/thank-you')
  }, [router, subscriptions])

  if (customerLoading || paymentLoading || subscriptionLoading || productsLoading) {
    return <LoadingSpinner />
  }

  if (customerError || paymentError || subscriptionError || productsError) {
    return <Notification type="error" message="An error occurred while loading checkout data." />
  }

  return (
    <>
      <Head>
        <title>Checkout | Subscriptions Ecommerce</title>
        <meta name="description" content="Complete your subscription checkout securely and easily." />
        <meta property="og:title" content="Checkout | Subscriptions Ecommerce" />
        <meta property="og:description" content="Complete your subscription checkout securely and easily." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.yoursubscriptionstore.com/checkout" />
      </Head>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout', href: '/checkout' },
        ]}
      />
      <main>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <section>
              <SubscriptionsSummary subscriptions={subscriptions} products={products} />
            </section>
            <section>
              <CheckoutForm
                customer={customer}
                onSuccess={handleCheckoutSuccess}
                renderAddressForm={() => (
                  <AddressForm customer={customer} />
                )}
                renderPaymentForm={() => (
                  <PaymentForm paymentMethods={paymentMethods} />
                )}
              />
            </section>
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  )
}

export default CheckoutPage

