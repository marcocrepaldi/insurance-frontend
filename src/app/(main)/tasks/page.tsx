import { TaskBoard } from "./task-board"

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciador de Tarefas</h2>
        <p className="text-muted-foreground">
          Visualize, filtre, aprove ou delegue tarefas da sua equipe.
        </p>
      </div>

      <TaskBoard />
    </div>
  )
}
