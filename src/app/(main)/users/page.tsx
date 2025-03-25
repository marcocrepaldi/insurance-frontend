"use client"

import { UsersClientPage } from "./users-client-page"

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground p-4">
      <UsersClientPage />
    </div>
  )
}
