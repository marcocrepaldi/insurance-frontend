"use client"

import useSWR from "swr"

export type UserOption = {
  id: string
  name: string
  email: string
}

const fetchUsers = async (): Promise<UserOption[]> => {
  const token = localStorage.getItem("jwt_token")

  const res = await fetch("https://insurance-api-production-55fa.up.railway.app/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Erro ao carregar usuários")

  return res.json()
}

export function useUsers() {
  const { data, error, isValidating } = useSWR("/users", fetchUsers)

  return {
    users: data ?? [],
    isLoading: isValidating,
    isError: !!error,
  }
}
