
// src/pages/products/[productId].

import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import { NextPage } from 'next'
import { useproduct } from '../../hooks/useproduct'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Notification from '../../components/Notification/Notification'

const ProductDetails = dynamic(() => import('../../components/ProductDetails/ProductDetails'), { suspense: true })
const ReviewForm = dynamic(() => import('../../components/ReviewForm/ReviewForm'), { suspense: true })
const Rating = dynamic(() => import('../../components/Rating/Rating'), { suspense: true })
const SubscriptionsSummary = dynamic(() => import('../../components/SubscriptionsSummary/SubscriptionsSummary'), { suspense: true })

const ProductDetail: NextPage = () => {
  const router = useRouter()
  const { productId } = router.query
  const { data: product, isLoading, isError, error } = useproduct(productId as string)

  useEffect(() => {
    if (productId && product) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'view_item', {
          items: [
            {
              id: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              subscription: true,
            },
          ],
        })
      }
    }
  }, [productId, product])

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    product ? { label: product.name, href: `/products/${product.id}` } : { label: 'Loading...', href: '#' },
  ]

  return (
    <>
      <Head>
        <title>{product ? `${product.name} | Subscriptions` : 'Product Detail | Subscriptions'}</title>
        <meta name="description" content={product ? product.description : 'Product detail page for subscriptions ecommerce.'} />
        <meta property="og:title" content={product ? product.name : 'Product Detail'} />
        <meta property="og:description" content={product ? product.description : 'Product detail page for subscriptions ecommerce.'} />
        <meta property="og:type" content="product" />
      </Head>
      <ErrorBoundary>
        <Breadcrumb items={breadcrumbs} />
        {isLoading && <LoadingSpinner />}
        {isError && <Notification type="error" message={error instanceof Error ? error.message : 'Error loading product.'} />}
        {product && (
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <ProductDetails product={product} />
              <Rating productId={product.id} />
              <ReviewForm productId={product.id} />
              <SubscriptionsSummary productId={product.id} />
            </Suspense>
          </main>
        )}
      </ErrorBoundary>
    </>
  )
}

export default ProductDetail

