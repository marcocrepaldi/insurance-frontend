// src/app/(app)/quotes/page.tsx
import { SectionCards } from './section-cards'
import { SalesBoard } from './sales-board'
import { CreateQuoteDialog } from './components/create-quote-dialog'

export default function QuotesPage() {
  return (
    <main className="p-6 space-y-6">
      <SectionCards />
      <SalesBoard />
      <CreateQuoteDialog />
    </main>
  )
}
