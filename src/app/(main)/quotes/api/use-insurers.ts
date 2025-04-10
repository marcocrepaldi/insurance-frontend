export type Insurer = {
    id: string
    nomeFantasia: string
  }
  
  export async function getInsurers(): Promise<Insurer[]> {
    const token = localStorage.getItem("jwt_token")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
    try {
      const response = await fetch(`${apiUrl}/insurers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao buscar seguradoras.")
      }
  
      const data = await response.json()
      return data.map((insurer: any) => ({ id: insurer.id, nomeFantasia: insurer.nomeFantasia }))
    } catch (error) {
      console.error("[getInsurers] Erro ao buscar seguradoras:", error)
      throw new Error("Erro ao buscar seguradoras.")
    }
  }
  