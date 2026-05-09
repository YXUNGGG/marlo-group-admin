import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card";
import { PublicationData } from "./data";
import { PublicationListItem } from "@/app/components/ui/content/publication-list-item";
import { CardBottomGradient } from "@/app/components/ui/.custom/card-bottom-gradient";
import { CardFilters, CardParamsType } from "@/app/components/ui/.custom/card-filters";
import { Suspense } from "react";
import { CustomerSkeleton } from "@/app/components/ui/customer/customer-skeleton";
import { CardList } from "@/app/components/ui/.custom/card-list";
import { getProducts, getUser } from "@/app/lib/data";
import { CreateProductModal } from "@/app/components/ui/content/create-product-modal";

export default async function Page({ searchParams }: { searchParams: Promise<CardParamsType> }) {
  const user = await getUser();

  return (
    <div className="space-y-6">
      <div id="header" className="space-y-2">
        <h2 className="text-lg">Таблица закзазов</h2>
        <p className="text-muted-foreground text-sm">Тут отображаются все текущие заказы компании</p>
      </div>

      <div className="flex gap-4 max-h-[762px]">
        <Card className="flex-1 relative pb-0">
          <CardHeader>
            <CardTitle>Товары</CardTitle>
            <CardDescription>Список всех товаров, которые предоставляет компания</CardDescription>
          </CardHeader>

          <CardAction className="px-6 w-full flex justify-between">
            <CardFilters
              filters={[
                {
                  label: "Стоимость",
                  value: "price"
                },
                {
                  label: "Количество",
                  value: "quantity"
                }
              ]}
            />
            <fieldset disabled={user?.role === "viewer"}>
              <CreateProductModal />
            </fieldset>
          </CardAction>

          <Suspense fallback={<CustomerSkeleton />}>
            <CardList params={searchParams} getItems={getProducts} />
          </Suspense>

          <CardBottomGradient />
        </Card>

        <Card className="flex-1 relative pb-0">
          <CardHeader>
            <CardTitle>Публикации</CardTitle>
            <CardDescription>Последняя активность команды в медиа</CardDescription>
          </CardHeader>

          <CardContent className="overflow-y-auto pb-4">
            {PublicationData.map(publication => (
              <PublicationListItem key={publication.href} data={publication} />
            ))}
          </CardContent>

          <CardBottomGradient />
        </Card>
      </div>
    </div>
  );
}
