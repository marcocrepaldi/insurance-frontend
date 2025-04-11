"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { useQuoteChartData } from "../api/useQuoteChartData"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const { data, isLoading } = useQuoteChartData()

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    const ref = new Date()
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startDate = new Date(ref)
    startDate.setDate(ref.getDate() - days)
    return data.filter((item) => new Date(item.date) >= startDate)
  }, [data, timeRange])

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Cotações por Tipo de Serviço</CardTitle>
          <CardDescription>Carregando gráfico...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const chartKeys = Object.keys(filteredData[0] || {}).filter(k => k !== "date")
  const chartConfig: ChartConfig = chartKeys.reduce((acc, key, index) => {
    acc[key] = {
      label: key, // já está vindo formatado pelo hook!
      color: `hsl(var(--chart-${(index % 10) + 1}))`,
    }
    return acc
  }, {} as ChartConfig)

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Cotações por Tipo de Serviço</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Últimos {timeRange}</span>
          <span className="@[540px]/card:hidden">Últimos {timeRange}</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            value={timeRange}
            onValueChange={setTimeRange}
            type="single"
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="7d" className="h-8 px-2.5">7 dias</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">30 dias</ToggleGroupItem>
            <ToggleGroupItem value="90d" className="h-8 px-2.5">90 dias</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40">
              <SelectValue placeholder="Intervalo" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-6">
            Nenhuma cotação encontrada para o período selecionado.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {chartKeys.map((key) => (
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
              {chartKeys.map((key) => (
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
        )}
      </CardContent>
    </Card>
  )
}
