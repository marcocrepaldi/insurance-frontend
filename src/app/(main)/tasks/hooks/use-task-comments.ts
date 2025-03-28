// src/app/(app)/tasks/[id]/hooks/use-task-comments.ts

import useSWR from 'swr'
import { useState } from 'react'
import { fetcherWithToken } from '../../../../lib/fetcherWithToken'

export interface TaskComment {
  id: string
  comment: string
  createdAt: string
  user: {
    id: string
    name: string
  }
}

interface UseTaskCommentsProps {
  taskId: string
  userId: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://insurance-api-production-55fa.up.railway.app/api'

export function useTaskComments({ taskId, userId }: UseTaskCommentsProps) {
  const {
    data: comments,
    error,
    isValidating,
    mutate,
  } = useSWR<TaskComment[]>(
    taskId ? `${API_URL}/tasks/${taskId}/comments` : null,
    fetcherWithToken
  )

  const isLoading = !comments && !error
  const [isPosting, setIsPosting] = useState(false)

  const postComment = async (comment: string) => {
    if (!taskId || !userId || !comment.trim()) return

    setIsPosting(true)

    try {
      await fetch(`${API_URL}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`, // ✅ corrigido aqui
        },
        body: JSON.stringify({ comment, userId }),
      })

      await mutate() // Atualiza os comentários
    } catch (err) {
      console.error('[useTaskComments] Erro ao postar comentário', err)
    } finally {
      setIsPosting(false)
    }
  }

  return {
    comments: comments || [],
    isLoading,
    isValidating,
    isPosting,
    error,
    postComment,
  }
}
