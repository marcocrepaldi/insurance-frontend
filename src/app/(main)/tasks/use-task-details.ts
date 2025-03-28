"use client"

import useSWR from "swr"
import { Task } from "./types"

const fetcher = async (url: string): Promise<Task> => {
  const token = localStorage.getItem("jwt_token")

  if (!token) {
    throw new Error("Token JWT não encontrado.")
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Erro ao buscar detalhes da tarefa.")
  }

  const data = await res.json()
  return data as Task
}

export function useTaskDetails(id: string) {
  const { data, error, isValidating, mutate } = useSWR<Task>(
    `https://insurance-api-production-55fa.up.railway.app/api/tasks/${id}`,
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    task: data,
    isLoading: isValidating,
    isError: !!error,
    mutate,
  }
}
