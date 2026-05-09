import { getCreateOrderData, getOrders } from "@/app/lib/data";
import { DataTable } from "./(table)/data-table";
import { columns } from "./(table)/columns";
import { Suspense } from "react";
import TableSkeleton from "@/app/components/ui/orders/table-skeleton";

export default async function Page() {
  const tableData = await getOrders();
  const orderData = getCreateOrderData();

  return (
    <div className="space-y-6">
      <div id="header" className="space-y-2">
        <h2 className="text-lg">Таблица закзазов</h2>
        <p className="text-muted-foreground text-sm">Тут отображаются все текущие заказы компании</p>
      </div>
      <div className="w-full">
        <Suspense fallback={<TableSkeleton />}>
          <DataTable columns={columns} data={tableData} includeTableActions createOrderData={orderData} />
        </Suspense>
      </div>
    </div>
  );
}
