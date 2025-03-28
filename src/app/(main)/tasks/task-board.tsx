"use client"

import { useTasks } from "./use-tasks"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { mapTaskToTable } from "./mapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskForm } from "./task-form"
import { SectionCards } from "./section-cards"
import { useAuth } from "../tasks/hooks/use-auth"

export function TaskBoard() {
  const { user } = useAuth()
  const { tasks, isLoading } = useTasks()

  const mapped = tasks.map(mapTaskToTable)

  const tabs = [
    { value: "ALL", label: "Todas" },
    { value: "PENDING", label: "Pendentes" },
    { value: "IN_PROGRESS", label: "Em progresso" },
    { value: "WAITING_APPROVAL", label: "Aguardando aprovação" },
    { value: "APPROVED", label: "Aprovadas" },
    { value: "REJECTED", label: "Rejeitadas" },
  ]

  const filtered = (status: string) =>
    status === "ALL"
      ? mapped
      : mapped.filter((task) => task.status === status)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
        {user?.role === "Admin" ? "Todas as Tarefas" : "Minhas Tarefas"}
        </h2>
        <TaskForm />
      </div>

      <SectionCards />

      <Tabs defaultValue="ALL" className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <DataTable columns={columns} data={filtered(tab.value)} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
