"use client";

import { Bar, BarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart";
import { MONTH } from "@/app/lib/constants";
import { use } from "react";
import { getTopPositions } from "@/app/lib/data";

type TopProductCardProps = {
  className?: string;
  chartConfig: ChartConfig;
  topProductsUnresolved: ReturnType<typeof getTopPositions>;
};

export function TopProductCard({ topProductsUnresolved, chartConfig, className }: TopProductCardProps) {
  const { topProducts } = use(topProductsUnresolved);

  const createChartData = (ordersData: { created_at: Date }[]) => {
    const chartData = Array.from({ length: 4 }, () => ({ "За месяц": 0 }));

    ordersData.forEach(({ created_at }) => {
      const orderTime = created_at.getTime();

      const thisMonth = Date.now() - MONTH;
      const monthAgo = Date.now() - MONTH * 2;
      const twoMonthAgo = Date.now() - MONTH * 3;
      const threeMonthAgo = Date.now() - MONTH * 4;

      if (orderTime >= thisMonth) chartData[3]["За месяц"]++;
      else if (orderTime >= monthAgo) chartData[2]["За месяц"]++;
      else if (orderTime >= twoMonthAgo) chartData[1]["За месяц"]++;
      else if (orderTime >= threeMonthAgo) chartData[0]["За месяц"]++;
    });

    return chartData;
  };

  return (
    <Card className={className ?? ""}>
      <CardHeader>
        <CardTitle>Востребованные услуги</CardTitle>
        <CardDescription>Рейтинг самых продающихся товаров и услуг</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {topProducts.map(product => (
          <div
            key={product.id}
            className="h-19.5 p-3 bg-muted flex gap-2.5 justify-between items-center rounded-xl"
          >
            <div>
              <p className="w-28">{product.title.replace(/(^.{21}).*/, "$1...")}</p>
              <p className="text-muted-foreground">{product._count.orders} заказов</p>
            </div>

            <ChartContainer config={chartConfig} className="size-full">
              <BarChart accessibilityLayer data={createChartData(product.orders)}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="За месяц" minPointSize={4} fill="var(--color-muted-foreground)" radius={6} />
              </BarChart>
            </ChartContainer>

            <div className="font-semibold">₽{product.price * product._count.orders}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
