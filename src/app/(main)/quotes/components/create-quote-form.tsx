"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createInsuranceQuote } from "../api/create-insurance-quote"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
  stage: z.enum([
    "ABERTURA",
    "EM_ABORDAGEM",
    "PROPOSTA_ENVIADA",
    "EM_NEGOCIACAO",
    "APROVADA",
    "PERDIDA",
    "CANCELADA",
  ]).optional(),
  expectedPremium: z.coerce.number().optional(),
  clientId: z.string().uuid("ID do cliente inválido"),
  producerId: z.string().uuid("ID do produtor inválido"),
})

type FormData = z.infer<typeof formSchema>

interface Client {
  id: string
  name: string
}

interface Producer {
  id: string
  name: string
}

export default function CreateQuoteForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [producers, setProducers] = useState<Producer[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stage: "ABERTURA",
    },
  })

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("jwt_token")
      const headers = { Authorization: `Bearer ${token}` }
      const [clientsRes, producersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/producers`, { headers }),
      ])

      if (clientsRes.ok) setClients(await clientsRes.json())
      if (producersRes.ok) setProducers(await producersRes.json())
    }

    fetchData()
  }, [])

  async function onSubmit(data: FormData) {
    try {
      await createInsuranceQuote(data)
      toast.success("Cotação criada com sucesso!")
      reset()
      onSuccess?.()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar cotação.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" {...register("title")}
          disabled={isSubmitting} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register("description")} disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="expectedPremium">Prêmio Estimado</Label>
        <Input id="expectedPremium" type="number" step="0.01" {...register("expectedPremium")} disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="stage">Status</Label>
        <Select onValueChange={(value) => setValue("stage", value as FormData["stage"])} defaultValue="ABERTURA" disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o estágio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ABERTURA">Abertura</SelectItem>
            <SelectItem value="EM_ABORDAGEM">Em abordagem</SelectItem>
            <SelectItem value="PROPOSTA_ENVIADA">Proposta enviada</SelectItem>
            <SelectItem value="EM_NEGOCIACAO">Em negociação</SelectItem>
            <SelectItem value="APROVADA">Aprovada</SelectItem>
            <SelectItem value="PERDIDA">Perdida</SelectItem>
            <SelectItem value="CANCELADA">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="clientId">Cliente</Label>
        <Select onValueChange={(value) => setValue("clientId", value)} disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.clientId && <p className="text-sm text-red-500">{errors.clientId.message}</p>}
      </div>

      <div>
        <Label htmlFor="producerId">Produtor</Label>
        <Select onValueChange={(value) => setValue("producerId", value)} disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um produtor" />
          </SelectTrigger>
          <SelectContent>
            {producers.map((producer) => (
              <SelectItem key={producer.id} value={producer.id}>
                {producer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.producerId && <p className="text-sm text-red-500">{errors.producerId.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  )
}