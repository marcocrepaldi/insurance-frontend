// src/app/(app)/tasks/actions.ts
import { TaskStatus } from "./types"
import { toast } from "sonner"
import { mutate } from "swr"

export async function updateTaskStatus(id: string, status: TaskStatus) {
  try {
    const token = localStorage.getItem("jwt_token")

    if (!token) {
      toast.error("Token JWT não encontrado.")
      return
    }

    console.log("📡 PATCH tarefa:", id, "Status:", status)

    const res = await fetch(`https://insurance-api-production-55fa.up.railway.app/api/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || "Erro ao atualizar status.")
    }

    toast.success("Tarefa atualizada com sucesso!")
    mutate("https://insurance-api-production-55fa.up.railway.app/api/tasks")
  } catch (error: any) {
    console.error("Erro na atualização:", error)
    toast.error(error.message || "Erro ao atualizar tarefa.")
  }
}
