import { Suspense } from "react"
import TaskDetailsPage from "./components/TaskDetailsPage"

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TaskDetailsPage />
    </Suspense>
  )
}
