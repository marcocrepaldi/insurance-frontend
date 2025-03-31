// src/app/(app)/quotes/quote-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Quote } from './schema'
import { UploadProposalDialog } from './components/upload-proposal-dialog'


export function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <Card className="mb-4 shadow-sm border">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">{quote.title}</CardTitle>
        <span className="text-muted-foreground text-xs">{quote.client.name}</span>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        R$ {quote.expectedPremium?.toFixed(2) || '0,00'}
      </CardContent>
      <CardContent>
        R$ {quote.expectedPremium?.toFixed(2) || '0,00'}
        <div className="mt-2">
            <UploadProposalDialog quoteId={quote.id} />
        </div>
        </CardContent>
    </Card>
    
  )
}
