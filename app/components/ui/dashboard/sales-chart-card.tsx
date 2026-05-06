"use client";

import { Badge } from "../badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart";
import { Area, AreaChart } from "recharts";
import { WEEK } from "@/app/lib/constants";
import { getRecentOrders } from "@/app/lib/data";
import { use } from "react";

type SalesChartCardProps = {
  className: string;
  chartConfig: ChartConfig;
  recentOrdersUnresolved: ReturnType<typeof getRecentOrders>;
};

export function SalesChartCard({ className, chartConfig, recentOrdersUnresolved }: SalesChartCardProps) {
  const { percentDifference, recentOrders } = use(recentOrdersUnresolved);

  const chartData = Array.from({ length: 4 }, () => ({ "За неделю": 0 }));
  const currentTime = Date.now();

  recentOrders.forEach(({ created_at }) => {
    const orderTime = created_at.getTime();
    const weeksAgo = [...new Array(4)].map((_, i) => currentTime - WEEK * (i + 1));

    if (orderTime >= weeksAgo[0]) chartData[3]["За неделю"]++;
    else if (orderTime >= weeksAgo[1]) chartData[2]["За неделю"]++;
    else if (orderTime >= weeksAgo[2]) chartData[1]["За неделю"]++;
    else if (orderTime >= weeksAgo[3]) chartData[0]["За неделю"]++;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Динамика продаж</CardTitle>
        <CardDescription>Продажи за последний месяц</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            {percentDifference > 0 ? `+${percentDifference}` : percentDifference}% с прошедш. мес.
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 h-[82%]">
        <ChartContainer config={chartConfig} className="h-[105%] w-[101.5%] -m-1.5">
          <AreaChart accessibilityLayer data={chartData} className="select-none pointer-events-none">
            {/* <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} /> */}
            <Area
              dataKey="За неделю"
              type="natural"
              fill="var(--color-muted-foreground)"
              fillOpacity={0.4}
              stroke="var(--color-foreground)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
