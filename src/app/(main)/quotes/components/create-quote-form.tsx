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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
  stage: z
    .enum([
      "ABERTURA",
      "EM_ABORDAGEM",
      "PROPOSTA_ENVIADA",
      "EM_NEGOCIACAO",
      "APROVADA",
      "PERDIDA",
      "CANCELADA",
    ])
    .optional(),
  expectedPremium: z.coerce.number().optional(),
  clientId: z.string().uuid("ID do cliente inválido"),
  producerId: z.string().uuid("ID do produtor inválido"),
  serviceType: z.enum([
    "SEGURO_CARRO",
    "SEGURO_MOTO",
    "SEGURO_CAMINHAO",
    "SEGURO_FROTAS",
    "AUTO_POR_ASSINATURA",
    "AUTO_POPULAR",
    "ASSISTENCIA_24H",
    "SEGURO_RESIDENCIAL",
    "SEGURO_CONDOMINIO",
    "SEGURO_EMPRESARIAL",
    "SEGURO_PATRIMONIAL",
    "SEGURO_EQUIPAMENTOS",
    "SEGURO_AGRICOLA",
    "VIDA_INDIVIDUAL",
    "VIDA_EM_GRUPO",
    "ACIDENTES_PESSOAIS",
    "SEGURO_FUNERAL",
    "DOENCAS_GRAVES",
    "SEGURO_PRESTAMISTA",
    "VIAGEM_NACIONAL_INTERNACIONAL",
    "VIAGEM_INTERCAMBIO",
    "VIAGEM_BAGAGEM",
    "VIAGEM_COBERTURA_MEDICA",
    "RC_PROFISSIONAL",
    "D_O",
    "E_O",
    "GARANTIA",
    "CYBER",
    "FIANCAS",
    "CREDITO",
    "RC_LIBERAIS",
    "EQUIPAMENTOS_TRABALHO",
    "VIDA_MEI",
    "CONSORCIO",
    "PREVIDENCIA_PRIVADA",
    "CAPITALIZACAO",
    "ASSISTENCIAS_AVULSAS",
    "SAUDE_ODONTO",
  ]),
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
        <Input id="title" {...register("title")} disabled={isSubmitting} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register("description")} disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="expectedPremium">Prêmio Estimado</Label>
        <Input
          id="expectedPremium"
          type="number"
          step="0.01"
          {...register("expectedPremium")}
          disabled={isSubmitting}
        />
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
        <Label htmlFor="serviceType">Tipo de Serviço</Label>
        <Select onValueChange={(value) => setValue("serviceType", value as FormData["serviceType"])} disabled={isSubmitting}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SEGURO_CARRO">Seguro de Carro</SelectItem>
            <SelectItem value="SEGURO_MOTO">Seguro de Moto</SelectItem>
            <SelectItem value="SEGURO_CAMINHAO">Seguro de Caminhão</SelectItem>
            <SelectItem value="SEGURO_FROTAS">Seguro de Frotas</SelectItem>
            <SelectItem value="AUTO_POR_ASSINATURA">Auto por Assinatura</SelectItem>
            <SelectItem value="AUTO_POPULAR">Auto Popular</SelectItem>
            <SelectItem value="ASSISTENCIA_24H">Assistência 24h</SelectItem>
            <SelectItem value="SEGURO_RESIDENCIAL">Seguro Residencial</SelectItem>
            <SelectItem value="SEGURO_CONDOMINIO">Seguro Condomínio</SelectItem>
            <SelectItem value="SEGURO_EMPRESARIAL">Seguro Empresarial</SelectItem>
            <SelectItem value="SEGURO_PATRIMONIAL">Seguro Patrimonial</SelectItem>
            <SelectItem value="SEGURO_EQUIPAMENTOS">Seguro Equipamentos</SelectItem>
            <SelectItem value="SEGURO_AGRICOLA">Seguro Agrícola</SelectItem>
            <SelectItem value="VIDA_INDIVIDUAL">Vida Individual</SelectItem>
            <SelectItem value="VIDA_EM_GRUPO">Vida em Grupo</SelectItem>
            <SelectItem value="ACIDENTES_PESSOAIS">Acidentes Pessoais</SelectItem>
            <SelectItem value="SEGURO_FUNERAL">Seguro Funeral</SelectItem>
            <SelectItem value="DOENCAS_GRAVES">Doenças Graves</SelectItem>
            <SelectItem value="SEGURO_PRESTAMISTA">Seguro Prestamista</SelectItem>
            <SelectItem value="VIAGEM_NACIONAL_INTERNACIONAL">Viagem Nacional/Internacional</SelectItem>
            <SelectItem value="VIAGEM_INTERCAMBIO">Viagem Intercâmbio</SelectItem>
            <SelectItem value="VIAGEM_BAGAGEM">Viagem - Bagagem</SelectItem>
            <SelectItem value="VIAGEM_COBERTURA_MEDICA">Viagem - Cobertura Médica</SelectItem>
            <SelectItem value="RC_PROFISSIONAL">RC Profissional</SelectItem>
            <SelectItem value="D_O">D&O</SelectItem>
            <SelectItem value="E_O">E&O</SelectItem>
            <SelectItem value="GARANTIA">Garantia</SelectItem>
            <SelectItem value="CYBER">Cyber</SelectItem>
            <SelectItem value="FIANCAS">Fianças</SelectItem>
            <SelectItem value="CREDITO">Crédito</SelectItem>
            <SelectItem value="RC_LIBERAIS">RC Liberais</SelectItem>
            <SelectItem value="EQUIPAMENTOS_TRABALHO">Equipamentos de Trabalho</SelectItem>
            <SelectItem value="VIDA_MEI">Vida MEI</SelectItem>
            <SelectItem value="CONSORCIO">Consórcio</SelectItem>
            <SelectItem value="PREVIDENCIA_PRIVADA">Previdência Privada</SelectItem>
            <SelectItem value="CAPITALIZACAO">Capitalização</SelectItem>
            <SelectItem value="ASSISTENCIAS_AVULSAS">Assistências Avulsas</SelectItem>
            <SelectItem value="SAUDE_ODONTO">Saúde / Odonto</SelectItem>
          </SelectContent>
        </Select>
        {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType.message}</p>}
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
