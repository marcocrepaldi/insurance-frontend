"use client"

import { useTasks } from "./use-tasks"
import { TaskStatus } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Clock, ShieldCheck, ShieldX } from "lucide-react"

const statusConfig: {
  status: TaskStatus
  label: string
  icon: React.ReactNode
  color: string
}[] = [
  {
    status: TaskStatus.PENDING,
    label: "Pendentes",
    icon: <Clock className="text-yellow-500" />,
    color: "border-yellow-400",
  },
  {
    status: TaskStatus.WAITING_APPROVAL,
    label: "Aguardando Aprovação",
    icon: <ShieldCheck className="text-orange-500" />,
    color: "border-orange-400",
  },
  {
    status: TaskStatus.APPROVED,
    label: "Aprovadas",
    icon: <Check className="text-green-600" />,
    color: "border-green-500",
  },
  {
    status: TaskStatus.REJECTED,
    label: "Rejeitadas",
    icon: <ShieldX className="text-red-500" />,
    color: "border-red-400",
  },
]

export function SectionCards() {
  const { tasks, isLoading } = useTasks()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusConfig.map((item) => (
          <Card key={item.status} className="animate-pulse h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statusConfig.map((item) => {
        const count = tasks.filter((task) => task.status === item.status).length

        return (
          <Card key={item.status} className={`border-l-4 ${item.color}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
