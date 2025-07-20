
// src/pages/products.

import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Suspense, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useproduct } from '../hooks/useproduct'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import SearchBar from '../components/SearchBar/SearchBar'
import CategoryFilter from '../components/CategoryFilter/CategoryFilter'
import Pagination from '../components/Pagination/Pagination'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { trackEvent } from '../utils/analytics'

const ProductList = dynamic(() => import('../components/ProductList/ProductList'), { ssr: false, loading: () => <LoadingSpinner /> })
const ShoppingCart = dynamic(() => import('../components/ShoppingCart/ShoppingCart'), { ssr: false })
const Notification = dynamic(() => import('../components/Notification/Notification'), { ssr: false })

const ProductsPage: NextPage = () => {
  const router = useRouter()
  const { query } = router
  const page = Number(query.page) || 1
  const category = typeof query.category === 'string' ? query.category : undefined
  const search = typeof query.search === 'string' ? query.search : undefined

  const { data, isLoading, isError, refetch } = useproduct({ page, category, search })

  const handleCategoryChange = useCallback((cat: string) => {
    router.push({ pathname: '/products', query: { ...query, category: cat, page: 1 } }, undefined, { shallow: true })
    trackEvent('CategoryFilter', { category: cat })
  }, [router, query])

  const handleSearch = useCallback((term: string) => {
    router.push({ pathname: '/products', query: { ...query, search: term, page: 1 } }, undefined, { shallow: true })
    trackEvent('Search', { search: term })
  }, [router, query])

  const handlePageChange = useCallback((newPage: number) => {
    router.push({ pathname: '/products', query: { ...query, page: newPage } }, undefined, { shallow: true })
    trackEvent('Pagination', { page: newPage })
  }, [router, query])

  return (
    <>
      <Head>
        <title>Subscription Products | ZippedBeans</title>
        <meta name="description" content="Browse our curated selection of subscription products. Find the perfect plan for you." />
        <meta property="og:title" content="Subscription Products | ZippedBeans" />
        <meta property="og:description" content="Browse our curated selection of subscription products. Find the perfect plan for you." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.zippedbeans.com/products" />
      </Head>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' }
        ]}
      />
      <main>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <aside style={{ minWidth: 220 }}>
            <CategoryFilter selected={category} onChange={handleCategoryChange} />
            <ShoppingCart />
          </aside>
          <section style={{ flex: 1 }}>
            <SearchBar initialValue={search || ''} onSearch={handleSearch} />
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                {isLoading && <LoadingSpinner />}
                {isError && <Notification type="error" message="Failed to load products." onRetry={refetch} />}
                {data && (
                  <>
                    <ProductList products={data.products} onProductClick={p => trackEvent('ProductView', { productId: p.id })} />
                    <Pagination
                      currentPage={page}
                      totalPages={data.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </Suspense>
            </ErrorBoundary>
          </section>
        </div>
      </main>
    </>
  )
}

export default ProductsPage

