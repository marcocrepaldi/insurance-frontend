export async function createInsuranceQuote(data: {
    title: string
    description?: string
    stage?: string
    proposalSentAt?: string
    expectedDecisionDate?: string
    expectedPremium?: number
    suggestedProducts?: string[]
    clientId: string
    producerId: string
  }) {
    const token = localStorage.getItem("jwt_token")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
    try {
      const response = await fetch(`${apiUrl}/insurance-quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao criar cotação.")
      }
  
      return await response.json()
    } catch (error) {
      console.error("[createInsuranceQuote]", error)
      throw error
    }
  }
  