"use client"
import { useParams, useSearchParams } from "next/navigation"
import TaskDetails from "./components/TaskDetails"
import TaskHistory from "./components/TaskHistory"

export default function TaskDetailPage() {
  const { id } = useParams()
  const tab = useSearchParams().get("tab")

  return (
    <div className="container space-y-4 py-10">
      {tab === "history" ? <TaskHistory taskId={id as string} /> : <TaskDetails taskId={id as string} />}
    </div>
  )
}
