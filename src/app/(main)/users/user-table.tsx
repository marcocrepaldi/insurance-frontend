"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { User } from "@/schemas/user"
import { DataTableUser } from "../../../components/tables/data-table-user"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import axios from "axios"

type Props = {
  data: User[]
}

export function UserTable({ data }: Props) {
  const router = useRouter()
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [openDialog, setOpenDialog] = useState(false)

  const handleDelete = async () => {
    const ids = selectedUsers.map((user) => user.id)
    const token = localStorage.getItem("jwt_token")

    if (!token) {
      toast.error("Token não encontrado. Faça login novamente.")
      return
    }

    try {
      await Promise.all(
        ids.map((id) =>
          axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      )

      toast.success("Usuário(s) removido(s) com sucesso!")

      // Aguarda 1 segundo para exibir o toast antes do reload
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast.error("Erro ao remover usuário(s).")
      console.error(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="default" onClick={() => router.push("/users/new")}>
          + Novo Usuário
        </Button>

        {selectedUsers.length > 0 && (
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Excluir Selecionados ({selectedUsers.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja excluir?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Os usuários selecionados serão removidos
                  permanentemente do sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Envolvendo a tabela em um card temático */}
      <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
        <DataTableUser
          data={data}
          onSelectedRowsChange={(rows) => setSelectedUsers(rows)}
        />
      </div>
    </div>
  )
}
