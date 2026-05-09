import { Card, CardAction } from "@/app/components/ui/card";
import { CardBottomGradient } from "@/app/components/ui/.custom/card-bottom-gradient";
import { CustomerSkeleton } from "@/app/components/ui/customer/customer-skeleton";

import { Suspense } from "react";
import { CardFilters, CardParamsType } from "@/app/components/ui/.custom/card-filters";
import { CreateCustomerModal } from "@/app/components/ui/customer/create-customer-modal";
import { CardList } from "@/app/components/ui/.custom/card-list";
import { getCustomers, getUser } from "@/app/lib/data";

export default async function Page({ searchParams }: { searchParams: Promise<CardParamsType> }) {
  const user = await getUser();

  return (
    <div className="space-y-6">
      <div id="header" className="space-y-2">
        <h2 className="text-lg">Таблица закзазов</h2>
        <p className="text-muted-foreground text-sm">Тут отображаются все текущие заказы компании</p>
      </div>

      <Card className="relative container min-h-56 max-h-[720px] max-w-2/3 pb-0">
        <CardAction className="px-6 w-full flex justify-between">
          <CardFilters
            filters={[
              {
                label: "Дата регистрации",
                value: "created_at"
              },
              {
                label: "Количество заказов",
                value: "orders_quantity"
              }
            ]}
          />
          <fieldset disabled={user?.role === "viewer"}>
            <CreateCustomerModal />
          </fieldset>
        </CardAction>

        <Suspense fallback={<CustomerSkeleton />}>
          <CardList params={searchParams} getItems={getCustomers} />
        </Suspense>

        <CardBottomGradient />
      </Card>
    </div>
  );
}
