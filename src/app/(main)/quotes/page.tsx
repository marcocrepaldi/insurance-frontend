'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './hooks/use-auth'

import { SectionCards } from './section-cards'
import { SalesBoard } from './sales-board'
import { CreateQuoteDialog } from './components/create-quote-dialog'

export default function QuotesPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated])

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  if (!isAuthenticated) {
    return null // evita renderizar se não autenticado (durante o redirecionamento)
  }

  return (
    <main className="p-6 space-y-6">
      <SectionCards />
      <SalesBoard />
      <CreateQuoteDialog />
    </main>
  )
}
