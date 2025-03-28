'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTaskComments } from '../hooks/use-task-comments'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TaskCommentsProps {
  taskId: string
  userId: string
}

export function TaskComments({ taskId, userId }: TaskCommentsProps) {
  const [input, setInput] = useState('')
  const {
    comments,
    isLoading,
    isPosting,
    postComment,
  } = useTaskComments({ taskId, userId })

  const handleSubmit = async () => {
    if (!input.trim()) return
    await postComment(input.trim())
    setInput('')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comentários</h3>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Carregando comentários...</p>
        )}

        {!isLoading && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum comentário ainda.</p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{comment.user.name}</div>
              <div className="text-xs text-muted-foreground mb-1">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </div>
              <div className="text-sm">{comment.comment}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        <Textarea
          placeholder="Escreva um comentário..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />
        <Button onClick={handleSubmit} disabled={isPosting || !input.trim()}>
          {isPosting ? 'Enviando...' : 'Enviar comentário'}
        </Button>
      </div>
    </div>
  )
}
