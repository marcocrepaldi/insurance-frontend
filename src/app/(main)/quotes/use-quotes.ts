'use client'

import useSWR from 'swr'
import { quoteSchema } from './schema'
import { z } from 'zod'

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

const quotesSchema = z.array(quoteSchema)

export const useQuotes = () => {
  const fetcher = async (url: string) => {
    const token = localStorage.getItem('jwt_token')
    if (!token || !API_URL) {
      console.warn('⚠️ Token ou API URL ausente.')
      return []
    }

    try {
      const res = await fetch(`${API_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`[${res.status}] ${res.statusText} - ${errorText}`)
      }

      const json = await res.json()
      const payload = Array.isArray(json) ? json : json.data
      return quotesSchema.parse(payload)
    } catch (error) {
      console.error('❌ Erro ao carregar cotações:', error)
      return []
    }
  }

  const { data, error, mutate } = useSWR('/insurance-quotes', fetcher)

  const isLoading = !data && !error

  return {
    quotes: data ?? [],
    isLoading,
    mutate,
  }
}
