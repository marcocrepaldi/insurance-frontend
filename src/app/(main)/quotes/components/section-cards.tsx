"use client"

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {[
        {
          title: "$1,250.00",
          description: "Total Revenue",
          change: "+12.5%",
          trend: "Trending up this month",
          icon: <TrendingUpIcon className="size-4" />,
          badgeIcon: <TrendingUpIcon className="size-3" />,
        },
        {
          title: "1,234",
          description: "New Customers",
          change: "-20%",
          trend: "Down 20% this period",
          icon: <TrendingDownIcon className="size-4" />,
          badgeIcon: <TrendingDownIcon className="size-3" />,
        },
        {
          title: "45,678",
          description: "Active Accounts",
          change: "+12.5%",
          trend: "Strong user retention",
          icon: <TrendingUpIcon className="size-4" />,
          badgeIcon: <TrendingUpIcon className="size-3" />,
        },
        {
          title: "4.5%",
          description: "Growth Rate",
          change: "+4.5%",
          trend: "Steady performance",
          icon: <TrendingUpIcon className="size-4" />,
          badgeIcon: <TrendingUpIcon className="size-3" />,
        },
      ].map((card, i) => (
        <Card key={i} className="bg-card text-card-foreground border">
          <CardHeader className="relative @container/card">
            <CardDescription className="text-muted-foreground">
              {card.description}
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-primary">
              {card.title}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs border-border text-foreground"
              >
                {card.badgeIcon}
                {card.change}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.trend} {card.icon}
            </div>
            <div className="text-muted-foreground">Insights based on last 6 months</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
