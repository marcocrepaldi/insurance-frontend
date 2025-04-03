"use client"

import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { DataTable } from "./components/data-table"
import { SectionCards } from "./components/section-cards"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useQuotes } from "@/hooks/useQuotes"

export default function Page() {
  const { quotes, isLoading, error } = useQuotes() // Removido isValidating

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
                  {isLoading ? (
                    <div className="text-muted-foreground text-sm">Carregando cotações...</div>
                  ) : error ? (
                    <div className="text-danger-foreground text-sm">Erro ao carregar cotações.</div>
                  ) : quotes?.length === 0 ? (
                    <div className="text-muted-foreground text-sm">Nenhuma cotação encontrada.</div>
                  ) : (
                    <DataTable data={quotes ?? []} />
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
