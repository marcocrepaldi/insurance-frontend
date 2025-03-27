"use client"

import { useEffect, useState } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SectionCards } from "./components/section-cards"
import { DataTable } from "./components/data-table"
import { Component } from "../../../components/componente-dash"
import { insurerSchema } from "./schemas/insurer-schema"
import { mapInsurerToTableItem, tableSchema } from "./lib/mapInsurerToTable"
import { z } from "zod"

export default function InsurersPage() {
  const [data, setData] = useState<z.infer<typeof tableSchema>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("jwt_token")

    if (!token) {
      console.error("JWT não encontrado no localStorage")
      setLoading(false)
      return
    }

    fetch("https://insurance-api-production-55fa.up.railway.app/api/insurers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorJson = await res.json()
          throw new Error(
            `[${res.status}] ${res.statusText} - ${JSON.stringify(errorJson)}`
          )
        }

        const json = await res.json()
        const payload = Array.isArray(json) ? json : json.data
        const parsed = z.array(insurerSchema).parse(payload)
        const mapped = parsed.map(mapInsurerToTableItem)
        setData(mapped)
      })
      .catch((err) => {
        console.error("❌ Failed to load insurers:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col bg-background text-foreground">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-accent text-accent-foreground p-4 shadow-sm">
                  <Component />
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <div className="rounded-xl border border-border bg-card text-card-foreground p-4 shadow-sm">
                  {loading ? (
                    <div className="p-4 text-sm">Loading insurers...</div>
                  ) : (
                    <DataTable data={data} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
