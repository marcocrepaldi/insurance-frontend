// src/app/(app)/quotes/quote-column.tsx
import { Quote } from './schema'
import { QuoteCard } from './quote-card'

interface QuoteColumnProps {
  title: string
  quotes: Quote[]
}

export function QuoteColumn({ title, quotes }: QuoteColumnProps) {
  return (
    <div
      className="w-[300px] flex flex-col gap-2 p-2 bg-muted rounded-md border"
      role="region"
      aria-label={`Coluna de ${title}`}
    >
      <h3 className="text-sm font-semibold mb-2 px-1 text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>

      {quotes.length > 0 ? (
        quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)
      ) : (
        <span className="text-xs text-muted-foreground italic px-1">
          Nenhuma cotação nesta etapa.
        </span>
      )}
    </div>
  )
}
