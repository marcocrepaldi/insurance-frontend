// src/hooks/useQuoteChartData.ts
import { useEffect, useState } from "react"

interface Quote {
  createdAt: string
  serviceType: string
}

interface ChartPoint {
  date: string
  [service: string]: number | string
}

function formatServiceLabel(type: string): string {
  const map: Record<string, string> = {
    SEGURO_CARRO: "Seguro Carro",
    SEGURO_MOTO: "Seguro Moto",
    SEGURO_CAMINHAO: "Seguro Caminhão",
    SEGURO_FROTAS: "Seguro Frotas",
    AUTO_POR_ASSINATURA: "Auto por Assinatura",
    AUTO_POPULAR: "Auto Popular",
    ASSISTENCIA_24H: "Assistência 24h",
    SEGURO_RESIDENCIAL: "Seguro Residencial",
    SEGURO_CONDOMINIO: "Seguro Condomínio",
    SEGURO_EMPRESARIAL: "Seguro Empresarial",
    SEGURO_PATRIMONIAL: "Seguro Patrimonial",
    SEGURO_EQUIPAMENTOS: "Seguro Equipamentos",
    SEGURO_AGRICOLA: "Seguro Agrícola",
    VIDA_INDIVIDUAL: "Vida Individual",
    VIDA_EM_GRUPO: "Vida em Grupo",
    ACIDENTES_PESSOAIS: "Acidentes Pessoais",
    SEGURO_FUNERAL: "Seguro Funeral",
    DOENCAS_GRAVES: "Doenças Graves",
    SEGURO_PRESTAMISTA: "Seguro Prestamista",
    VIAGEM_NACIONAL_INTERNACIONAL: "Viagem Nacional/Internacional",
    VIAGEM_INTERCAMBIO: "Viagem Intercâmbio",
    VIAGEM_BAGAGEM: "Viagem - Bagagem",
    VIAGEM_COBERTURA_MEDICA: "Viagem - Cobertura Médica",
    RC_PROFISSIONAL: "RC Profissional",
    D_O: "D&O",
    E_O: "E&O",
    GARANTIA: "Garantia",
    CYBER: "Cyber",
    FIANCAS: "Fianças",
    CREDITO: "Crédito",
    RC_LIBERAIS: "RC Liberais",
    EQUIPAMENTOS_TRABALHO: "Equipamentos de Trabalho",
    VIDA_MEI: "Vida MEI",
    CONSORCIO: "Consórcio",
    PREVIDENCIA_PRIVADA: "Previdência Privada",
    CAPITALIZACAO: "Capitalização",
    ASSISTENCIAS_AVULSAS: "Assistências Avulsas",
    SAUDE_ODONTO: "Saúde / Odonto",
  }
  return map[type] ?? "Outros"
}

export function useQuoteChartData() {
  const [data, setData] = useState<ChartPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("jwt_token")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insurance-quotes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) return

        const quotes: Quote[] = await res.json()
        const grouped: Record<string, Record<string, number>> = {}

        for (const quote of quotes) {
          const date = new Date(quote.createdAt).toISOString().slice(0, 10)
          const label = formatServiceLabel(quote.serviceType ?? "OUTROS")

          if (!grouped[date]) grouped[date] = {}
          grouped[date][label] = (grouped[date][label] ?? 0) + 1
        }

        const result = Object.entries(grouped).map(([date, types]) => ({
          date,
          ...types,
        }))

        setData(result)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading }
}
