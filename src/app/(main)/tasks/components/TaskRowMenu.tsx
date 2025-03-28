"use client"

import { MoreHorizontal, Eye, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface TaskRowMenuProps {
  taskId: string
}

export function TaskRowMenu({ taskId }: TaskRowMenuProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/tasks/${taskId}`)}>
          <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(`/tasks/${taskId}?tab=history`)}>
          <History className="h-4 w-4 mr-2" /> Histórico
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
