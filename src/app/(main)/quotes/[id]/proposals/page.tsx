"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { SectionCards } from "@/components/section-cards"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTableDemo } from "../../components/data-table-proposals"
import { ProposalCards } from "../../components/proposal-cards"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CreateProposalDialog } from "../../components/create-proposal-dialog"

export default function Page() {
  const pathname = usePathname()
  const regex = /\/quotes\/([a-f0-9-]+)\/proposals/
  const match = pathname?.match(regex)
  const id = match ? match[1] : null
  const [quoteData, setQuoteData] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchQuoteData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt_token")
        if (!jwtToken) {
          console.error("Token JWT não encontrado")
          return
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/insurance-quotes/${id}`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`)
        }

        const data = await response.json()
        setQuoteData(data)
      } catch (error) {
        console.error("Erro ao buscar dados da cotação:", error)
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
              <SectionCards />
              <ProposalCards data={[]} />

              {id && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <div className="flex justify-end px-4 lg:px-6">
                    <DialogTrigger asChild>
                      <Button variant="default">Cadastrar Proposta</Button>
                    </DialogTrigger>
                  </div>
                  <CreateProposalDialog open={dialogOpen} onOpenChange={setDialogOpen} quoteId={id} />
                </Dialog>
              )}

              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
                  {quoteData?.proposals?.length ? (
                    <DataTableDemo data={quoteData.proposals} />
                  ) : (
                    <p>Carregando propostas...</p>
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
