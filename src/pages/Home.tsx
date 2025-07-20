
// src/pages/index.

import { useEffect, Suspense, useCallback } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import SearchBar from '../components/SearchBar/SearchBar'
import CategoryFilter from '../components/CategoryFilter/CategoryFilter'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import Notification from '../components/Notification/Notification'
import { useproduct } from '../hooks/useproduct'
import { NextPage } from 'next'

const ProductList = dynamic(() => import('../components/ProductList/ProductList'), { ssr: false, loading: () => <LoadingSpinner /> })
const ShoppingCart = dynamic(() => import('../components/ShoppingCart/ShoppingCart'), { ssr: false })
const SubscriptionsSummary = dynamic(() => import('../components/SubscriptionsSummary/SubscriptionsSummary'), { ssr: false })

const Home: NextPage = () => {
  const router = useRouter()
  const { data, isLoading, isError, refetch } = useproduct()
  const handleProductClick = useCallback((productId: string) => {
    router.push(`/products/${productId}`)
  }, [router])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', { page_path: '/' })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Home | Subscription Ecommerce</title>
        <meta name="description" content="Discover and subscribe to the best products. Flexible plans, easy checkout, and seamless management." />
        <meta property="og:title" content="Home | Subscription Ecommerce" />
        <meta property="og:description" content="Discover and subscribe to the best products. Flexible plans, easy checkout, and seamless management." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.yoursubscriptionstore.com/" />
      </Head>
      <ErrorBoundary>
        <main>
          <Breadcrumb items={[{ label: 'Home', href: '/' }]} />
          <section>
            <h1 className="sr-only">Subscription Products</h1>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <aside className="md:w-1/4 mb-4 md:mb-0">
                <CategoryFilter />
                <SubscriptionsSummary />
              </aside>
              <div className="md:w-3/4">
                <SearchBar />
                <Suspense fallback={<LoadingSpinner />}>
                  {isLoading && <LoadingSpinner />}
                  {isError && <Notification type="error" message="Failed to load products." onClose={refetch} />}
                  {data && (
                    <ProductList
                      products={data.products}
                      onProductClick={handleProductClick}
                    />
                  )}
                </Suspense>
              </div>
              <aside className="md:w-1/4 hidden lg:block">
                <ShoppingCart />
              </aside>
            </div>
          </section>
        </main>
      </ErrorBoundary>
    </>
  )
}

export default Home

