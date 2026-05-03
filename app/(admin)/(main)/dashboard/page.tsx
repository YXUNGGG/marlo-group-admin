import { SalesChartCard } from "@/app/components/ui/dashboard/sales-chart-card";
import { OrdersChartCard } from "@/app/components/ui/dashboard/orders-chart-card";
import { TopCustomersCard } from "@/app/components/ui/dashboard/top-customers-card";
import { ChartConfig } from "@/app/components/ui/chart";
import { TopProductCard } from "@/app/components/ui/dashboard/top-product-card";
import RecentActionsCard from "@/app/components/ui/dashboard/recent-actions-card";
import { TotalRevenueCard } from "@/app/components/ui/dashboard/total-revenue-card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Suspense } from "react";
import { getRecentOrders, getTopPositions } from "@/app/lib/data";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default async function Page() {
  const recentOrders = getRecentOrders();
  const topPositions = getTopPositions();

  return (
    <div className="space-y-6 pb-2">
      <div className="flex gap-4 h-[325px]">
        <SalesChartCard
          className="flex-2" 
          chartConfig={chartConfig}
          recentOrdersUnresolved={recentOrders}
        />

        <TotalRevenueCard className="flex-1" />

        <OrdersChartCard 
          className="flex-1"
          recentOrdersUnersolved={recentOrders}
          chartConfig={chartConfig} 
        />
      </div>

      <div className="flex gap-4">
        <TopCustomersCard className="flex-1 h-fit" />

        <TopProductCard 
          className="flex-1"
          chartConfig={chartConfig}
          topProductsUnresolved={topPositions}
        />

        <Suspense fallback={<Skeleton className="w-1/2" />}>
          <RecentActionsCard 
            className="w-1/2 pb-0 h-122 relative" 
          />
        </Suspense>
      </div>
    </div>
  );
}