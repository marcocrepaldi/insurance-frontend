"use client"

import useSWR from "swr"
import { Task } from "./types"
import { taskSchema } from "./schema"

const fetcher = async (url: string): Promise<Task[]> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null

  if (!token) {
    throw new Error("Token JWT não encontrado.")
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401) {
    throw new Error("Não autorizado. Verifique o token.")
  }

  if (!res.ok) {
    throw new Error("Erro ao buscar tarefas.")
  }

  const data = await res.json()
  const validated = data.map((item: any) => taskSchema.parse(item))
  return validated
}

export function useTasks() {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null
  const shouldFetch = !!token

  const { data, error, isValidating, mutate } = useSWR(
    shouldFetch ? "https://insurance-api-production-55fa.up.railway.app/api/tasks" : null,
    fetcher,
    { revalidateOnFocus: false } // ✅ evita recarregamento automático ao trocar de aba
  )

  return {
    tasks: data ?? [],
    isLoading: isValidating,
    isError: !!error,
    mutate,
  }
}
