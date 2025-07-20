
// src/pages/invoices.

import { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary'
import { useinvoice } from '../hooks/useinvoice'

const InvoicesList = dynamic(() => import('../components/InvoicesList/InvoicesList'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})

const InvoicesPage: NextPage = () => {
  const { data, isLoading, isError, error } = useinvoice()

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'page_view', {
        page_title: 'Invoices',
        page_path: '/invoices',
      })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Invoices | My Subscriptions</title>
        <meta name="description" content="View and download your invoices for all your subscriptions." />
        <meta property="og:title" content="Invoices | My Subscriptions" />
        <meta property="og:description" content="View and download your invoices for all your subscriptions." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.yoursite.com/invoices" />
      </Head>
      <main>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account', href: '/account' },
            { label: 'Invoices', href: '/invoices' },
          ]}
        />
        <h1>Invoices</h1>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <InvoicesList
              invoices={data?.invoices || []}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  )
}

export default InvoicesPage

