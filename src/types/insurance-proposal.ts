// src/types/insurance-proposal.ts
export interface Coverage {
    name: string
    value: number
    deductible?: string
  }
  
  export interface InsuranceProposal {
    id: string
    insurerName: string
    totalPremium: number
    insuredAmount: number
    observations?: string
    pdfPath?: string
    coverages?: Coverage[]
    createdAt: string
    updatedAt: string
  }
  