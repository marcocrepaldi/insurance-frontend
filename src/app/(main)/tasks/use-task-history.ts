"use client"

import useSWR from "swr"

interface TaskHistoryEntry {
  id: string
  action: string
  from: string | null
  to: string | null
  changedBy: { id: string; name: string }
  changedAt: string
}

const fetcher = (url: string) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
  }).then(res => res.json())

export function useTaskHistory(taskId: string) {
  const { data, error, isValidating } = useSWR<TaskHistoryEntry[]>(
    `https://insurance-api-production-55fa.up.railway.app/api/tasks/${taskId}/history`,
    fetcher
  )

  return {
    history: data ?? [],
    isLoading: isValidating,
    isError: !!error,
  }
}
