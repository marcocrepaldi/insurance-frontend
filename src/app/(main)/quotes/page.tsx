"use client"

import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { DataTable } from "./components/data-table"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useQuotes } from "@/hooks/useQuotes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateQuoteForm from "./components/create-quote-form"
import { useState } from "react"
import { SectionCardsQuotes } from "./components/section-cards"

export default function Page() {
  const { quotes, isLoading, error } = useQuotes()
  const [open, setOpen] = useState(false)

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Ação principal */}
              <div className="flex items-center justify-between px-4 lg:px-6">
                <h1 className="text-xl font-semibold">Cotações de Seguro</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default">Criar Cotação</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Nova Cotação de Seguro</DialogTitle>
                    </DialogHeader>
                    <CreateQuoteForm onSuccess={() => setOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Cards interativo */}
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-accent text-accent-foreground p-4 shadow-sm">
                <SectionCardsQuotes quotes={quotes ?? []} />
              </div>

              </div>
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
