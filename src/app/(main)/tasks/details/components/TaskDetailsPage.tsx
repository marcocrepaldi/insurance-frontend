"use client"

import { useParams, useSearchParams } from "next/navigation"
import TaskDetails from "./TaskDetails"
import TaskHistory from "./TaskHistory"

export default function TaskDetailsPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  return (
    <div className="container space-y-4 py-10">
      {tab === "history" ? <TaskHistory taskId={id as string} /> : <TaskDetails taskId={id as string} />}
    </div>
  )
}
