"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { InsuranceQuote } from "@/types/insuranceQuotesType"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  serviceType: z.string().min(1, "Tipo obrigatório"),
  expectedPremium: z.coerce.number().min(0, "Valor inválido"),
})

type FormValues = z.infer<typeof formSchema>

interface EditQuoteDialogProps {
  quote: InsuranceQuote
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

export function EditQuoteDialog({ quote, open, onOpenChange, onUpdated }: EditQuoteDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: quote
      ? {
          title: quote.title,
          serviceType: quote.serviceType,
          expectedPremium: quote.expectedPremium ?? 0,
        }
      : undefined,
  })

  async function onSubmit(data: FormValues) {
    try {
      const token = localStorage.getItem("jwt_token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insurance-quotes/${quote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()

      toast.success("Cotação atualizada com sucesso.")
      onUpdated()
    } catch {
      toast.error("Erro ao atualizar cotação.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Cotação</DialogTitle>
          <DialogDescription>Altere os dados da cotação desejada.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Tipo de Serviço</Label>
            <Select
              defaultValue={quote?.serviceType}
              onValueChange={(val) => setValue("serviceType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEGURO_CARRO">Seguro de Carro</SelectItem>
                <SelectItem value="SEGURO_MOTO">Seguro de Moto</SelectItem>
                <SelectItem value="SAUDE_ODONTO">Saúde / Odonto</SelectItem>
              </SelectContent>
            </Select>
            {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Prêmio Estimado</Label>
            <Input type="number" step="0.01" {...register("expectedPremium")} />
            {errors.expectedPremium && <p className="text-sm text-red-500">{errors.expectedPremium.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
