// src/app/(app)/quotes/mapper.ts
import { Quote } from './schema'

export const mapQuoteToCard = (quote: Quote) => ({
  id: quote.id,
  title: quote.title,
  subtitle: quote.client.name,
  stage: quote.stage,
  description: quote.description,
  value: quote.expectedPremium,
})
