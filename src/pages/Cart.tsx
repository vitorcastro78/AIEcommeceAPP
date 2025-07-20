
// src/pages/cart.

import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useRouter } from 'next/router'
import { useubscription } from '../hooks/useubscription'
import { usecustomer } from '../hooks/usecustomer'
import { usepayment } from '../hooks/usepayment'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import Notification from '../components/Notification/Notification'

const ShoppingCart = dynamic(() => import('../components/ShoppingCart/ShoppingCart'), { ssr: false, loading: () => <LoadingSpinner /> })
const CartItem = dynamic(() => import('../components/CartItem/CartItem'), { ssr: false })
const CheckoutForm = dynamic(() => import('../components/CheckoutForm/CheckoutForm'), { ssr: false })
const SubscriptionsSummary = dynamic(() => import('../components/SubscriptionsSummary/SubscriptionsSummary'), { ssr: false })

const CartPage: NextPage = () => {
  const router = useRouter()
  const { data: subscriptions, isLoading: loadingSubs, error: errorSubs } = useubscription()
  const { data: customer, isLoading: loadingCustomer, error: errorCustomer } = usecustomer()
  const { data: paymentMethods, isLoading: loadingPayment, error: errorPayment } = usepayment()

  if (loadingSubs || loadingCustomer || loadingPayment) {
    return <LoadingSpinner />
  }

  if (errorSubs || errorCustomer || errorPayment) {
    return (
      <Notification
        type="error"
        message="An error occurred while loading your cart. Please try again."
      />
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' }
  ]

  return (
    <>
      <Head>
        <title>Cart | Subscriptions Ecommerce</title>
        <meta name="description" content="Review your subscriptions, manage your cart, and proceed to checkout." />
        <meta property="og:title" content="Cart | Subscriptions Ecommerce" />
        <meta property="og:description" content="Review your subscriptions, manage your cart, and proceed to checkout." />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL}/cart`} />
      </Head>
      <ErrorBoundary>
        <main>
          <Breadcrumb items={breadcrumbs} />
          <h1>Your Cart</h1>
          <Suspense fallback={<LoadingSpinner />}>
            <ShoppingCart>
              {subscriptions?.cartItems?.length ? (
                subscriptions.cartItems.map((item: any) => (
                  <CartItem key={item.id} item={item} />
                ))
              ) : (
                <div>Your cart is empty.</div>
              )}
            </ShoppingCart>
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <SubscriptionsSummary subscriptions={subscriptions?.cartItems || []} />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <CheckoutForm
              customer={customer}
              paymentMethods={paymentMethods}
              onSuccess={() => {
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'begin_checkout', {
                    event_category: 'ecommerce',
                    event_label: 'Cart Checkout',
                    value: subscriptions?.cartItems?.reduce((acc: number, item: any) => acc + (item.price || 0), 0)
                  })
                }
                router.push('/checkout/success')
              }}
            />
          </Suspense>
        </main>
      </ErrorBoundary>
    </>
  )
}

export default CartPage
