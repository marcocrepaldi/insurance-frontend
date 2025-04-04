"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Task } from "./types"
import { taskSchema } from "./schema"

const API_BASE_URL = "https://insurance-api-production-55fa.up.railway.app"
const TASKS_API_URL = "/api/tasks"

const fetcher = async (url: string): Promise<Task[]> => {
  const token = localStorage.getItem("jwt_token")

  if (!token) {
    throw new Error("Token JWT não encontrado.")
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Erro ao buscar tarefas.")
  }

  const data = await res.json()
  return data.map((item: any) => taskSchema.parse(item))
}

export function useTasks() {
  const [shouldFetch, setShouldFetch] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("jwt_token")) setShouldFetch(true)
  }, [])

  const { data, error, isValidating, mutate } = useSWR(
    shouldFetch ? TASKS_API_URL : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    tasks: data ?? [],
    isLoading: isValidating,
    isError: !!error,
    mutate,
  }
}
