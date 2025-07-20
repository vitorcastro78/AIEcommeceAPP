
// src/pages/404.

import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Breadcrumb = dynamic(() => import('../components/Breadcrumb/Breadcrumb'), { ssr: false })
const ProductList = dynamic(() => import('../components/ProductList/ProductList'), { ssr: false, loading: () => null })
const ErrorBoundary = dynamic(() => import('../components/ErrorBoundary/ErrorBoundary'), { ssr: false })
const LoadingSpinner = dynamic(() => import('../components/LoadingSpinner/LoadingSpinner'), { ssr: false, loading: () => null })

import { useproduct } from '../hooks/useproduct'

const NotFound: NextPage = () => {
  const router = useRouter()
  const { data: products, isLoading, isError } = useproduct()
  
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: '404 Not Found',
        page_path: router.asPath,
        event_category: 'Error',
        event_label: '404'
      })
    }
  }, [router.asPath])

  return (
    <>
      <Head>
        <title>404 Not Found | Subscriptions Store</title>
        <meta name="description" content="Page not found. Discover our best subscription offers." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/404`} />
      </Head>
      <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: '404 Not Found' }
          ]}
        />
        <section style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>404</h1>
          <p style={{ fontSize: '1.25rem', margin: '1rem 0' }}>Sorry, the page you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/')}
            style={{
              margin: '1.5rem 0',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            aria-label="Go to homepage"
          >
            Go to Homepage
          </button>
        </section>
        <section style={{ width: '100%', maxWidth: 1200, margin: '2rem auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
            Discover Popular Subscriptions
          </h2>
          <ErrorBoundary>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                <LoadingSpinner />
              </div>
            ) : isError ? (
              <div style={{ textAlign: 'center', color: '#b00' }}>Unable to load subscriptions.</div>
            ) : (
              <ProductList products={products?.slice(0, 4) || []} />
            )}
          </ErrorBoundary>
        </section>
      </main>
    </>
  )
}

export default NotFound
