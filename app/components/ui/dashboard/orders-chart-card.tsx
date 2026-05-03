"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart";
import { Bar, BarChart, XAxis } from "recharts";
import { Separator } from "../separator";
import { Prisma } from "@/generated/prisma/client";
import { WEEK } from "@/app/lib/constants";
import { use } from "react";
import { getRecentOrders } from "@/app/lib/data";

const chartData = [
  { week: "1 неделя", desktop: 186 },
  { week: "2 неделя", desktop: 305 },
  { week: "3 неделя", desktop: 237 },
  { week: "4 неделя", desktop: 73 },
  { week: "5 неделя", desktop: 209 },
  { week: "6 неделя", desktop: 214 },
  { week: "7 неделя", desktop: 214 },
  { week: "8 неделя", desktop: 255 }
];

type OrdersChartCardProps = {
  className: string;
  chartConfig: ChartConfig;
  recentOrdersUnersolved: ReturnType<typeof getRecentOrders>;
};

export function OrdersChartCard({ className, chartConfig, recentOrdersUnersolved }: OrdersChartCardProps) {
  const { ordersPerMonth } = use(recentOrdersUnersolved);

  const currentTime = Date.now();
  const totalOrders = ordersPerMonth.length;
  const averageCheck =
    ordersPerMonth.map(item => item.product.price).reduce((acc, price) => (acc += price), 0) / totalOrders;

  const chartData = [...new Array(8)].map((_, i) => ({ week: `${i + 1} неделя`, "За неделю": 0 }));

  ordersPerMonth.forEach(({ created_at }) => {
    const orderTime = created_at.getTime();
    const weeksAgo = [...new Array(8)].map((_, i) => currentTime - WEEK * (i + 1));

    if (orderTime >= weeksAgo[0]) chartData[7]["За неделю"]++;
    else if (orderTime >= weeksAgo[1]) chartData[6]["За неделю"]++;
    else if (orderTime >= weeksAgo[2]) chartData[5]["За неделю"]++;
    else if (orderTime >= weeksAgo[3]) chartData[4]["За неделю"]++;
    else if (orderTime >= weeksAgo[4]) chartData[3]["За неделю"]++;
    else if (orderTime >= weeksAgo[5]) chartData[2]["За неделю"]++;
    else if (orderTime >= weeksAgo[6]) chartData[1]["За неделю"]++;
    else if (orderTime >= weeksAgo[7]) chartData[0]["За неделю"]++;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Заказы</CardTitle>
        <CardDescription>График заказов за последние 2 месяца</CardDescription>
      </CardHeader>

      <CardContent className="h-[45%]">
        <ChartContainer config={chartConfig} className="w-full h-[115%]">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 5)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar radius={8} minPointSize={4} dataKey="За неделю" fill="var(--color-muted-foreground)" />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <div className="space-y-4 px-6">
        <Separator />

        <div className="flex gap-16 px-2">
          <div className="leading-5.5">
            <p className="text-muted-foreground">Новых закзов</p>
            <p className="font-medium">{totalOrders}</p>
          </div>

          <div className="leading-5.5">
            <p className="text-muted-foreground">Средний чек</p>
            <p className="font-medium">₽{averageCheck.toFixed()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
