
// src/pages/register.

import { useState, Suspense, lazy, useCallback } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { useproduct } from '../hooks/useproduct'
import { usecountrie } from '../hooks/usecountrie'
import { usecustomer } from '../hooks/usecustomer'
import { useubscription } from '../hooks/useubscription'
import { usepayment } from '../hooks/usepayment'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import Notification from '../components/Notification/Notification'
import { track } from '../utils/analytics'

const ProductList = lazy(() => import('../components/ProductList/ProductList'))
const ShoppingCart = lazy(() => import('../components/ShoppingCart/ShoppingCart'))
const CheckoutForm = lazy(() => import('../components/CheckoutForm/CheckoutForm'))
const AddressForm = lazy(() => import('../components/AddressForm/AddressForm'))
const PaymentForm = lazy(() => import('../components/PaymentForm/PaymentForm'))
const SubscriptionsSummary = lazy(() => import('../components/SubscriptionsSummary/SubscriptionsSummary'))

const RegisterPage: NextPage = () => {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])
  const [address, setAddress] = useState<any>(null)
  const [payment, setPayment] = useState<any>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const { data: products, isLoading: loadingProducts, error: errorProducts } = useproduct()
  const { data: countries } = usecountrie()
  const { mutateAsync: createCustomer } = usecustomer()
  const { mutateAsync: createSubscription } = useubscription()
  const { mutateAsync: createPayment } = usepayment()

  const handleProductSelect = useCallback((product: any) => {
    setSelectedProduct(product)
    setCart([product])
    setStep(1)
    track('register_product_selected', { productId: product.id })
  }, [])

  const handleAddressSubmit = useCallback((addressData: any) => {
    setAddress(addressData)
    setStep(2)
    track('register_address_submitted')
  }, [])

  const handlePaymentSubmit = useCallback((paymentData: any) => {
    setPayment(paymentData)
    setStep(3)
    track('register_payment_submitted')
  }, [])

  const handleCheckout = useCallback(async () => {
    try {
      const customer = await createCustomer({ address, ...payment })
      await createSubscription({ customerId: customer.id, products: cart })
      await createPayment({ customerId: customer.id, payment })
      setNotification({ type: 'success', message: 'Registration successful!' })
      setStep(4)
      track('register_completed', { customerId: customer.id })
    } catch (e: any) {
      setNotification({ type: 'error', message: 'Registration failed. Please try again.' })
      track('register_failed', { error: e?.message })
    }
  }, [address, payment, cart, createCustomer, createSubscription, createPayment])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Register', href: '/register' }
  ]

  return (
    <>
      <Head>
        <title>Register | Subscription Ecommerce</title>
        <meta name="description" content="Register for a subscription and enjoy exclusive benefits. Choose your plan, enter your details, and get started!" />
        <meta property="og:title" content="Register | Subscription Ecommerce" />
        <meta property="og:description" content="Register for a subscription and enjoy exclusive benefits. Choose your plan, enter your details, and get started!" />
        <link rel="canonical" href="https://www.example.com/register" />
      </Head>
      <ErrorBoundary>
        <main>
          <Breadcrumb items={breadcrumbs} />
          {notification && <Notification type={notification.type} message={notification.message} />}
          <Suspense fallback={<LoadingSpinner />}>
            {step === 0 && (
              <ProductList
                products={products}
                isLoading={loadingProducts}
                error={errorProducts}
                onSelect={handleProductSelect}
              />
            )}
            {step === 1 && (
              <AddressForm
                countries={countries}
                onSubmit={handleAddressSubmit}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <CheckoutForm
                cart={cart}
                address={address}
                payment={payment}
                onCheckout={handleCheckout}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <SubscriptionsSummary
                cart={cart}
                address={address}
                payment={payment}
                onGoHome={() => router.push('/')}
              />
            )}
          </Suspense>
        </main>
      </ErrorBoundary>
    </>
  )
}

export default RegisterPage

**utils/analytics.ts**
ts
export function track(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, data || {})
  }
}
