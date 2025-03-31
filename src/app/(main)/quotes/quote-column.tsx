// src/app/(app)/quotes/quote-column.tsx
import { Quote } from './schema'
import { QuoteCard } from './quote-card'

interface QuoteColumnProps {
  title: string
  quotes: Quote[]
}

export function QuoteColumn({ title, quotes }: QuoteColumnProps) {
  return (
    <div className="w-[300px] min-w-[280px] bg-muted rounded-lg p-3 shadow-sm flex flex-col gap-2">
      <h2 className="text-sm font-semibold mb-1 text-muted-foreground">{title}</h2>
      {quotes.length === 0 && (
        <div className="text-xs text-muted-foreground italic">Sem cotações</div>
      )}
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  )
}
