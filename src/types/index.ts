export type InsuranceQuote = {
    id: string
    title: string
    description: string | null
    stage: string
    expectedPremium: number | null
    expectedDecisionDate: string | null
    proposalSentAt: string | null
    client: { id: string; name: string }
    producer: { id: string; name: string }
    createdBy: { id: string; name: string }
    createdAt: string
    updatedAt: string
  }
  