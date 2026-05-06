import { Card } from "@/app/components/ui/card";
import { CustomerFilter } from "@/app/components/ui/customer/customer-filter";
import { CustomerList } from "@/app/components/ui/customer/customer-list";
import { CustomerSkeleton } from "@/app/components/ui/customer/customer-skeleton";

import { Suspense } from "react";

// export type SortType = {
//   createdAtAsc: "created_at=asc";
//   createdAtDesc: "created_at=desc";
//   ordersQuantityAsc: "orders_quantity=asc";
//   ordersQuantityesc: "orders_quantity=desc";
// };

export type CustopmerParamsType = { query: string; sort: string };

export default function Page({ searchParams }: { searchParams: Promise<CustopmerParamsType> }) {
  return (
    <div className="space-y-6">
      <div id="header" className="space-y-2">
        <h2 className="text-lg">Таблица закзазов</h2>
        <p className="text-muted-foreground text-sm">Тут отображаются все текущие заказы компании</p>
      </div>

      <Card className="relative container min-h-56 max-h-[720px] max-w-2/3 pb-0">
        <CustomerFilter />

        <Suspense fallback={<CustomerSkeleton />}>
          <CustomerList params={searchParams} />
        </Suspense>

        <div className="absolute z-10 bottom-0 right-0 w-full h-12 bg-linear-to-t from-card to-transparent" />
      </Card>
    </div>
  );
}
