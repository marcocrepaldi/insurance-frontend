import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { CreateClientInput, useCreateClient } from "../hook/useCreateClient"
import { Client } from "../hook/type"

interface CreateClientDialogProps {
  existingClients: Client[]
  onCreated?: (client: Client) => void
}

export function CreateClientDialog({
  existingClients,
  onCreated,
}: CreateClientDialogProps) {
  const [open, setOpen] = useState(false)
  const { createClient, loading } = useCreateClient()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const payload: CreateClientInput = {
      name: String(formData.get("name")),
      document: String(formData.get("document")),
      birthDate: formData.get("birthDate") ? String(formData.get("birthDate")) : null,
      phone: formData.get("phone") ? String(formData.get("phone")) : null,
      email: formData.get("email") ? String(formData.get("email")) : null,
      street: formData.get("street") ? String(formData.get("street")) : null,
      number: formData.get("number") ? String(formData.get("number")) : null,
      complement: formData.get("complement") ? String(formData.get("complement")) : null,
      neighborhood: formData.get("neighborhood") ? String(formData.get("neighborhood")) : null,
      city: formData.get("city") ? String(formData.get("city")) : null,
      state: formData.get("state") ? String(formData.get("state")) : null,
      zipCode: formData.get("zipCode") ? String(formData.get("zipCode")) : null,
      indicatedById: formData.get("indicatedById") ? String(formData.get("indicatedById")) : null,
      isActive: formData.get("isActive") === "on",
      documents: [],
    }

    try {
      const client = await createClient(payload)

      if (client) {
        toast.success("Cliente cadastrado com sucesso!")
        form.reset()
        setOpen(false)
        onCreated?.(client)
      } else {
        toast.error("Erro ao cadastrar cliente.")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado"
      toast.error("Erro ao cadastrar cliente", {
        description: message,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Cliente</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Dados principais */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="document">CPF ou CNPJ</Label>
            <Input id="document" name="document" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input id="birthDate" name="birthDate" type="date" />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" />
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input id="street" name="street" />
            </div>
            <div>
              <Label htmlFor="number">Número</Label>
              <Input id="number" name="number" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" name="complement" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" name="neighborhood" />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="state">UF</Label>
              <Input id="state" name="state" maxLength={2} />
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" name="zipCode" />
            </div>
          </div>

          {/* Indicação */}
          <div className="grid gap-2">
            <Label htmlFor="indicatedById">Indicado por</Label>
            <Select name="indicatedById" defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {existingClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Ativo?</Label>
            <Switch id="isActive" name="isActive" defaultChecked />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
