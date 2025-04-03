"use client" // Diretriz para marcar este componente como Cliente

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation" // Usando 'usePathname' para obter a URL
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTableDemo } from "../../components/data-table-proposals"

export default function Page() {
  const pathname = usePathname() // Usando 'usePathname' para obter a URL
  console.log("Pathname:", pathname); // Verificando o pathname para garantir que ele está correto

  const regex = /\/quotes\/([a-f0-9-]+)\/proposals/; // Regex para extrair o ID da URL
  const match = pathname?.match(regex); // Aplica o regex na URL
  const id = match ? match[1] : null; // Se encontrado, pega o ID, caso contrário, é null
  const [quoteData, setQuoteData] = useState<any>(null)

  console.log(`ID extraído: ${id}`);

  useEffect(() => {
    if (!id) return

    const fetchQuoteData = async () => {
      try {
        // Obter o JWT token do localStorage
        const jwtToken = localStorage.getItem("jwt_token")
        
        if (!jwtToken) {
          console.error("Token não encontrado")
          return
        }

        // Log da URL para garantir que a URL está correta
        const url = `https://insurance-api-production-55fa.up.railway.app/api/insurance-quotes/${id}`
        console.log("URL da requisição:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwtToken}`, // Envia o JWT token como Bearer no cabeçalho
            "Content-Type": "application/json",
          },
        })
        
        // Verifica se a resposta foi ok, senão lança um erro
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`)
        }

        // Exibe o status da resposta
        console.log("Status da resposta:", response.status);

        const data = await response.json()
        setQuoteData(data)

        // Log da resposta da API
        console.log("Resposta da API:", data);

      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      }
    }

    fetchQuoteData()
  }, [id])

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Cartões com estatísticas principais */}
              <SectionCards />

              {/* Gráfico interativo */}
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-accent text-accent-foreground p-4 shadow-sm">
                  <ChartAreaInteractive />
                </div>
              </div>

              {/* Tabela de dados */}
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
                  {/* Passa as propostas para o DataTableDemo */}
                  {quoteData && quoteData.proposals ? (
                    <DataTableDemo data={quoteData.proposals} />
                  ) : (
                    <p>Carregando cotações...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
