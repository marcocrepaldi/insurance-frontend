'use client'

import * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import { Button } from './button'

interface DragHandleProps {
  id: string
  onDragStart: (id: string) => void
}

export const DragHandle: React.FC<DragHandleProps> = ({ id, onDragStart }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:bg-transparent"
      onMouseDown={() => onDragStart(id)} // Trigger drag start event
    >
      <GripVerticalIcon className="text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}
