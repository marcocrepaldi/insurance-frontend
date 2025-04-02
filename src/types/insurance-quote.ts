import { InsuranceProposal } from "./insurance-proposal"

export interface InsuranceQuote {
  id: string
  title: string
  description?: string
  stage: string
  expectedPremium?: number
  proposalSentAt?: string
  expectedDecisionDate?: string
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string
  }
  producer: {
    id: string
    name: string
  }
  proposals?: InsuranceProposal[]
}
