


import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"
import { SectionCards } from "./components/section-cards"
import { DataTable } from "./components/data-table"
import { Component } from "../../../components/componente-dash"

export default function ProducerPage() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <h1 className="px-4 lg:px-6 text-2xl font-bold text-primary">
                Produtores
              </h1>

              {/* Cartões com estatísticas principais */}
              <SectionCards />

              {/* Gráfico interativo */}
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-accent text-accent-foreground p-4 shadow-sm">
                  <Component />
                </div>
              </div>

              {/* Tabela de dados */}
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
                  <DataTable data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
