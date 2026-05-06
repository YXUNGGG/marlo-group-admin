import { prisma } from "@/app/lib/prisma";
import { getCreateOrderData } from "@/app/lib/data";
import { DataTable } from "./(table)/data-table";
import { columns } from "./(table)/columns";
import { Suspense } from "react";
import TableSkeleton from "@/app/components/ui/orders/table-skeleton";

export default async function Page() {
  const createOrderData = getCreateOrderData();

  const tableData = await prisma.order.findMany({
    include: {
      customer: { select: { name: true } },
      product: { select: { price: true } }
    }
  });

  return (
    <div className="space-y-6">
      <div id="header" className="space-y-2">
        <h2 className="text-lg">Таблица закзазов</h2>
        <p className="text-muted-foreground text-sm">Тут отображаются все текущие заказы компании</p>
      </div>
      <div className="max-w-none container">
        <Suspense fallback={<TableSkeleton includeTableActions />}>
          <DataTable
            columns={columns}
            data={tableData}
            createOrderData={createOrderData}
            includeTableActions
          />
        </Suspense>
      </div>
    </div>
  );
}
