"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { useQuoteChartData } from "../hooks/useQuoteChartData"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartConfig,
} from "@/components/ui/chart"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [mode, setMode] = React.useState<"diario" | "acumulado">("diario")
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])

  const { data, isLoading } = useQuoteChartData()

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    const ref = new Date()
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startDate = new Date(ref)
    startDate.setDate(ref.getDate() - days)
    const base = data.filter((item) => new Date(item.date) >= startDate)

    if (mode === "acumulado") {
      const acumulado: Record<string, number> = {}
      return base.map((item) => {
        const entry: any = { date: item.date }
        for (const key of Object.keys(item).filter(k => k !== "date")) {
          const value = typeof item[key] === "number" ? item[key] : 0
          acumulado[key] = (acumulado[key] || 0) + value
          entry[key] = acumulado[key]
        }
        return entry
      })
    }

    return base
  }, [data, timeRange, mode])

  const chartKeys = React.useMemo(() => {
    if (filteredData.length === 0) return []
    const keys = Object.keys(filteredData[0]).filter(k => k !== "date")
    const usedKeys = keys.filter((key) =>
      filteredData.some((point) => typeof point[key] === "number" && point[key] > 0)
    )
    return usedKeys
  }, [filteredData])

  // Aplica filtro por tipo de serviço selecionado
  const visibleKeys = selectedKeys.length > 0 ? selectedKeys : chartKeys

  const chartConfig: ChartConfig = visibleKeys.reduce((acc, key, index) => {
    acc[key] = {
      label: key,
      color: `hsl(var(--chart-${(index % 10) + 1}))`,
    }
    return acc
  }, {} as ChartConfig)

  const percentualDiff = React.useMemo(() => {
    if (data.length === 0 || chartKeys.length === 0) return []
    const today = new Date()
    const currentDays = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startCurrent = new Date(today)
    const startPrev = new Date(today)
    startCurrent.setDate(today.getDate() - currentDays)
    startPrev.setDate(today.getDate() - currentDays * 2)

    const total = (from: Date, to: Date) =>
      chartKeys.map(key => {
        const sum = data
          .filter(d => {
            const dDate = new Date(d.date)
            return dDate >= from && dDate < to
          })
          .reduce((acc, curr) => acc + (curr[key] as number || 0), 0)
        return { key, sum }
      })

    const current = total(startCurrent, today)
    const previous = total(startPrev, startCurrent)

    return current.map((c, i) => {
      const p = previous[i].sum || 1
      const variation = ((c.sum - previous[i].sum) / p) * 100
      return {
        key: c.key,
        label: c.key,
        variation: variation.toFixed(1),
        current: c.sum,
        previous: previous[i].sum,
      }
    }).filter(v => visibleKeys.includes(v.key))
  }, [data, timeRange, chartKeys, visibleKeys])

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Cotações por Tipo de Produto</CardTitle>
          <CardDescription>Carregando gráfico...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative space-y-2">
        <CardTitle>Cotações por Tipo de Produto</CardTitle>
        <CardDescription>
          <span className="text-muted-foreground">Últimos {timeRange} | Modo: {mode}</span>
        </CardDescription>
        <div className="flex flex-wrap gap-2 justify-between">
          <ToggleGroup value={timeRange} onValueChange={setTimeRange} type="single" variant="outline">
            <ToggleGroupItem value="7d">7 dias</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 dias</ToggleGroupItem>
            <ToggleGroupItem value="90d">90 dias</ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup value={mode} onValueChange={(val) => setMode(val as any)} type="single" variant="outline">
            <ToggleGroupItem value="diario">Diário</ToggleGroupItem>
            <ToggleGroupItem value="acumulado">Acumulado</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-6">
            Nenhuma cotação encontrada para o período selecionado.
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  {visibleKeys.map((key) => (
                    <linearGradient id={`fill-${key}`} key={key} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.05} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
                <YAxis domain={[0, "dataMax + 2"]} allowDecimals={false} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ label, payload }) => (
                    <div className="rounded-md border bg-background p-2 shadow-sm">
                      <div className="mb-1 text-sm font-medium">
                        {new Date(label as string).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      {payload?.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{chartConfig[entry.name as string]?.label}</span>
                          <span className="font-semibold">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
                {visibleKeys.map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    fill={`url(#fill-${key})`}
                    stroke={chartConfig[key].color}
                    strokeWidth={2}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </AreaChart>
            </ChartContainer>

            {/* Legenda + Filtro + Variação */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-wrap gap-4 justify-start">
                {chartKeys.map((key) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={selectedKeys.includes(key)}
                      onCheckedChange={(checked) => {
                        setSelectedKeys((prev) =>
                          checked
                            ? [...prev, key]
                            : prev.filter((k) => k !== key)
                        )
                      }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: chartConfig[key]?.color || "gray" }}
                    />
                    <span>{chartConfig[key]?.label || key}</span>
                  </label>
                ))}
              </div>

              {/* Variação entre períodos */}
              {percentualDiff.length > 0 && (
                <div className="grid sm:grid-cols-3 gap-2 text-sm text-muted-foreground pt-2">
                  {percentualDiff.map((v) => (
                    <div key={v.key}>
                      <span className="font-medium">{v.label}</span>:{" "}
                      <span className={+v.variation >= 0 ? "text-green-600" : "text-red-600"}>
                        {+v.variation >= 0 ? "+" : ""}
                        {v.variation}%
                      </span>
                      {" "}
                      ({v.previous} → {v.current})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
