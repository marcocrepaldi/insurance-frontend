// src/app/(main)/quotes/components/quote-actions-dropdown.tsx

"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { InsuranceQuote } from "@/types/insuranceQuotesType"
import { toast } from "sonner"

interface QuoteActionsDropdownProps {
  quote: InsuranceQuote
  onEdit: () => void
  onDeleted: () => void
}

export function QuoteActionsDropdown({ quote, onEdit, onDeleted }: QuoteActionsDropdownProps) {
  const [loading, setLoading] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("jwt_token")
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insurance-quotes/${quote.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Cotação excluída com sucesso.")
      onDeleted()
    } catch {
      toast.error("Erro ao excluir cotação.")
    } finally {
      setLoading(false)
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="size-6">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmOpen(true)}>Excluir</DropdownMenuItem>
          <DropdownMenuItem onClick={() => location.href = `/quotes/${quote.id}/proposals`}>
            Ver Propostas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta cotação? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
