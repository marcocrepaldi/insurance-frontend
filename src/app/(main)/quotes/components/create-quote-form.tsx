// src/app/(main)/quotes/components/create-quote-form.tsx
"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createInsuranceQuote } from "../hooks/create-insurance-quote"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { quoteServiceSchemas } from "../schemas/quoteServiceSchemas"
import { ServiceFields } from "../hooks/useServiceFields"

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
  serviceType: z.enum(Object.keys(quoteServiceSchemas) as [keyof typeof quoteServiceSchemas]),
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
  const [serviceType, setServiceType] = useState<FormData["serviceType"] | null>(null)

  const dynamicSchema = serviceType ? quoteServiceSchemas[serviceType] : null

  const finalSchema = dynamicSchema
    ? z.object({ serviceDetails: dynamicSchema }).merge(formSchema)
    : formSchema

  const methods = useForm<z.infer<typeof finalSchema>>({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      stage: "ABERTURA",
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods

  const expectedPremium = watch("expectedPremium")

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("jwt_token")
        const headers = { Authorization: `Bearer ${token}` }
        const [clientsRes, producersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/producers`, { headers }),
        ])

        if (clientsRes.ok) setClients(await clientsRes.json())
        if (producersRes.ok) setProducers(await producersRes.json())
      } catch {
        toast.error("Erro ao carregar clientes ou produtores.")
      }
    }

    fetchData()
  }, [])

  async function onSubmit(data: z.infer<typeof finalSchema>) {
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...register("title" as const)} disabled={isSubmitting} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" {...register("description" as const)} disabled={isSubmitting} />
        </div>

        <div>
          <Label htmlFor="expectedPremium">Prêmio Estimado</Label>
          <Input
            id="expectedPremium"
            type="text"
            inputMode="decimal"
            value={expectedPremium?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "")
              const formatted = (Number(value) / 100) || 0
              setValue("expectedPremium", formatted, { shouldValidate: true })
            }}
            disabled={isSubmitting}
          />
          {errors.expectedPremium && (
            <p className="text-sm text-red-500">{errors.expectedPremium.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="stage">Status</Label>
          <Select
            onValueChange={(value) => setValue("stage", value as FormData["stage"])}
            defaultValue="ABERTURA"
            disabled={isSubmitting}
          >
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
          <Label htmlFor="serviceType">Tipo de Produto</Label>
          <Select
            onValueChange={(value) => {
              setValue("serviceType", value as FormData["serviceType"])
              setServiceType(value as FormData["serviceType"])
            }}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de serviço" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(quoteServiceSchemas) as FormData["serviceType"][]).map((key) => (
                <SelectItem key={key} value={key}>
                  {key.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceType && (
            <p className="text-sm text-red-500">{errors.serviceType.message}</p>
          )}
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
          {errors.clientId && (
            <p className="text-sm text-red-500">{errors.clientId.message}</p>
          )}
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
          {errors.producerId && (
            <p className="text-sm text-red-500">{errors.producerId.message}</p>
          )}
        </div>

        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Campos Específicos</h4>
          <ServiceFields serviceType={serviceType} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </FormProvider>
  )
}
