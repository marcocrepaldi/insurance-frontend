"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { getInsurers, Insurer } from "../api/use-insurers"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const createProposalSchema = z.object({
  insurerName: z.string().min(1, "Nome da seguradora obrigatório"),
  totalPremium: z.coerce.number().min(0.01, "Prêmio total obrigatório"),
  insuredAmount: z.coerce.number().min(0.01, "Valor segurado obrigatório"),
  observations: z.string().nullable().optional(),
  file: z
    .any()
    .refine(
      (file) =>
        file?.[0] &&
        ["application/pdf", "image/png", "image/jpeg"].includes(file[0].type),
      {
        message: "Arquivo inválido. Apenas PDF ou imagem.",
      }
    ),
})

type CreateProposalFormValues = z.infer<typeof createProposalSchema>

interface CreateProposalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quoteId: string
}

export function CreateProposalDialog({
  open,
  onOpenChange,
  quoteId,
}: CreateProposalDialogProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProposalFormValues>({
    resolver: zodResolver(createProposalSchema),
  })

  const [insurers, setInsurers] = React.useState<Insurer[]>([])
  const [loadingInsurers, setLoadingInsurers] = React.useState(true)

  React.useEffect(() => {
    async function loadInsurers() {
      try {
        const data = await getInsurers()
        setInsurers(data)
      } catch {
        toast.error("Erro ao carregar seguradoras")
      } finally {
        setLoadingInsurers(false)
      }
    }

    if (open) {
      loadInsurers()
    }
  }, [open])

  async function onSubmit(data: CreateProposalFormValues) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem("jwt_token")

    const formData = new FormData()
    formData.append("quoteId", quoteId)
    formData.append("insurerName", data.insurerName)
    formData.append("totalPremium", data.totalPremium.toString())
    formData.append("insuredAmount", data.insuredAmount.toString())
    if (data.observations) formData.append("observations", data.observations)
    formData.append("file", data.file[0])

    try {
      await axios.post(`${apiUrl}/insurance-quotes/proposals/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Proposta cadastrada com sucesso!")
      reset()
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error("Erro ao cadastrar proposta")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Proposta</DialogTitle>
          <DialogDescription>
            Preencha os dados e envie o arquivo da proposta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Seguradora</Label>
            <Select
              onValueChange={(value) => setValue("insurerName", value)}
              defaultValue={watch("insurerName")}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingInsurers ? "Carregando..." : "Selecione a seguradora"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {insurers.map((insurer) => (
                  <SelectItem key={insurer.id} value={insurer.nomeFantasia}>
                    {insurer.nomeFantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.insurerName && (
              <p className="text-sm text-red-500">
                {errors.insurerName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Prêmio Total</Label>
            <Input type="number" step="0.01" {...register("totalPremium")} />
            {errors.totalPremium && (
              <p className="text-sm text-red-500">
                {errors.totalPremium.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Valor Segurado</Label>
            <Input type="number" step="0.01" {...register("insuredAmount")} />
            {errors.insuredAmount && (
              <p className="text-sm text-red-500">
                {errors.insuredAmount.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Observações</Label>
            <Textarea rows={3} {...register("observations")} />
          </div>
          <div className="grid gap-2">
            <Label>Arquivo (PDF ou imagem)</Label>
            <Input type="file" accept=".pdf,image/*" {...register("file")} />
            {errors.file && (
              <p className="text-sm text-red-500">
                {errors.file.message as string}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? "Enviando..." : "Cadastrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
