export interface InsuranceProposal {
    id: string
  
    /** Nome da seguradora que enviou a proposta */
    insurerName: string
  
    /** Valor total do prêmio da proposta */
    totalPremium: number
  
    /** Valor total segurado */
    insuredAmount: number
  
    /** Observações extraídas do PDF ou preenchidas manualmente */
    observations?: string
  
    /** Caminho relativo para o PDF salvo */
    pdfPath?: string
  
    /** Data de criação da proposta */
    createdAt: string
  
    /** Data de última atualização da proposta */
    updatedAt: string
  }
  