'use client'

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Hook para buscar os dados reais da API
import { useFetchClients } from "./hook/useFetchData"

// Componentes reutilizáveis da página
import { SectionCards } from "./components/section-cards"
import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { DataTable } from "./components/data-table"

export default function PageClient() {
  const { clients, loading, error } = useFetchClients()

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              <h1 className="px-4 lg:px-6 text-2xl font-bold text-primary">
                Clientes
              </h1>

              {/* Cartões de resumo (pode receber props no futuro) */}
              <SectionCards />

              {/* Gráfico interativo com dados reais no futuro */}
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-accent text-accent-foreground p-4 shadow-sm">
                  <ChartAreaInteractive />
                </div>
              </div>

              {/* Tabela de dados */}
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
                  {loading && <div className="text-sm text-muted">Carregando clientes...</div>}
                  {error && <div className="text-sm text-red-500">Erro: {error}</div>}
                  {!loading && !error && <DataTable data={clients} />}
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
