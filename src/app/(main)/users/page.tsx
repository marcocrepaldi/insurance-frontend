"use client"

import { useEffect, useState } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "./components/data-table"
import { userSchema } from "@/schemas/users-schema"
import { mapUserToTableItem, tableSchema } from "@/lib/mapUsersToTable"
import { z } from "zod"
import { SectionCards } from "./components/section-cards"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

export default function UserPage() {
  const [data, setData] = useState<z.infer<typeof tableSchema>[]>([]) // Dados dos usuários
  const [loading, setLoading] = useState(true) // Estado de carregamento
  const [error, setError] = useState<string | null>(null) // Estado de erro
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "f6dde762-760b-4139-88ee-4ff73c48903b", // User ID default
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Estado de envio

  // Carregar os usuários ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("jwt_token")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://insurance-api-production-55fa.up.railway.app/api" // Certifique-se de que a variável de ambiente está configurada

    if (!token) {
      console.error("JWT não encontrado no localStorage")
      setError("Token JWT não encontrado. Faça login novamente.")
      setLoading(false)
      return
    }

    setLoading(true) // Começar o carregamento dos dados

    fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Adicionando Content-Type para garantir o tipo correto
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorJson = await res.json()
          throw new Error(
            `[${res.status}] ${res.statusText} - ${JSON.stringify(errorJson)}`
          )
        }
        const json = await res.json()
        const payload = Array.isArray(json) ? json : json.data
        try {
          const parsed = z.array(userSchema).parse(payload) // Validação com Zod
          const mapped = parsed.map(mapUserToTableItem)
          setData(mapped)
        } catch (err) {
          setError("Erro ao processar os dados recebidos.")
          console.error("❌ Invalid data:", err)
        }
      })
      .catch((err) => {
        setError("Falha ao carregar os usuários. Tente novamente mais tarde.")
        console.error("❌ Failed to load users:", err)
      })
      .finally(() => setLoading(false)) // Certifique-se de que o loading seja desativado depois de completar
  }, [])

  const handleCreateUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("As senhas não coincidem!")
      return
    }

    setIsSubmitting(true) // Inicia o envio

    const token = localStorage.getItem("jwt_token")
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://insurance-api-production-55fa.up.railway.app/api"

    if (!token) {
      console.error("JWT não encontrado no localStorage")
      setIsSubmitting(false)
      return
    }

    const payload = {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      roleId: newUser.roleId,
    }

    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorJson = await response.json()
      console.error("Erro ao criar usuário:", errorJson)
      toast.error("Erro ao criar usuário. Tente novamente.")
      setIsSubmitting(false)
      return
    }

    const data = await response.json()
    console.log("Usuário criado com sucesso:", data)
    setData((prevData) => [...prevData, mapUserToTableItem(data)])
    toast.success("Usuário criado com sucesso!")
    setShowModal(false)
    setIsSubmitting(false) // Finaliza o envio
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />

              <div className="flex justify-end">
                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <DialogTrigger asChild>
                    <Button className="w-[200px]">Criar Usuário</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do usuário.
                    </DialogDescription>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          placeholder="Nome"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser({ ...newUser, password: e.target.value })
                            }
                            placeholder="Senha"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={newUser.confirmPassword}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirmar Senha"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="role">Função</Label>
                        <Select
                          value={newUser.roleId}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, roleId: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma função" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="f6dde762-760b-4139-88ee-4ff73c48903b">User</SelectItem>
                            <SelectItem value="a8c621ca-9404-4b27-a961-5a29ebf39731">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button onClick={handleCreateUser} disabled={isSubmitting}>
                        {isSubmitting ? "Criando..." : "Criar Usuário"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
                  {loading ? (
                    <div className="p-4 text-sm">Loading users...</div>
                  ) : error ? (
                    <div className="p-4 text-red-500">{error}</div>
                  ) : data.length === 0 ? (
                    <div className="p-4 text-sm">Nenhum usuário encontrado.</div>
                  ) : (
                    <DataTable data={data} />
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
