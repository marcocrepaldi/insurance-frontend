// src/app/(app)/tasks/actions.ts
import { TaskStatus } from "./types"
import { toast } from "sonner"
import { mutate } from "swr"

export async function updateTaskStatus(id: string, status: TaskStatus) {
  try {
    const token = localStorage.getItem("jwt_token")

    const res = await fetch(`https://insurance-api-production-55fa.up.railway.app/api/tasks/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) throw new Error("Erro ao atualizar status.")

    toast.success("Tarefa atualizada com sucesso!")
    mutate("https://insurance-api-production-55fa.up.railway.app/api/tasks")
  } catch (error: any) {
    toast.error(error.message || "Erro ao atualizar tarefa.")
  }
}
