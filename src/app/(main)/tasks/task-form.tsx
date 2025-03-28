"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTasks } from "./use-tasks"
import { z } from "zod"
import { toast } from "sonner"
import { useUsers } from "./use-users"

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  label: z.enum(["BUG", "FEATURE", "URGENT", "IMPROVEMENT"]).optional(),
  assignedTo: z.string().uuid(),
})

export function TaskForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { mutate } = useTasks()
  const { users, isLoading: loadingUsers } = useUsers()

  const [form, setForm] = useState({
    title: "",
    description: "",
    label: undefined,
    assignedTo: "",
  })

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const parsed = formSchema.parse(form)

      const token = localStorage.getItem("jwt_token")

      const res = await fetch("https://insurance-api-production-55fa.up.railway.app/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed),
      })

      if (!res.ok) throw new Error("Erro ao criar tarefa.")

      toast.success("Tarefa criada com sucesso!")
      mutate()
      setOpen(false)
      setForm({ title: "", description: "", label: undefined, assignedTo: "" })
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar formulário")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Registro</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Tarefa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
          </div>

          <div>
            <Label>Rótulo</Label>
            <Select onValueChange={(val) => handleChange("label", val)} value={form.label}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um rótulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUG">Bug</SelectItem>
                <SelectItem value="FEATURE">Funcionalidade</SelectItem>
                <SelectItem value="URGENT">Urgente</SelectItem>
                <SelectItem value="IMPROVEMENT">Melhoria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Atribuir para</Label>
            <Select onValueChange={(val) => handleChange("assignedTo", val)} value={form.assignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="__loading__" disabled>Carregando usuários...</SelectItem>
                  ) : users.length === 0 ? (
                    <SelectItem value="__none__" disabled>Nenhum usuário encontrado</SelectItem>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))
                  )}
              </SelectContent>

            </Select>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Tarefa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
