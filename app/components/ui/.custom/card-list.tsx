import { formatTime } from "@/app/lib/utils";
import { CardContent } from "../card";
import { Separator } from "../separator";
import { CardParamsType } from "./card-filters";
import { CardListItem } from "./card-list-item";
import { Customer, Product } from "@/generated/prisma/client";

type CardListProps = {
  params: Promise<CardParamsType>;
  getItems: (params: CardParamsType) => Promise<Customer[] | Product[]>;
};

export async function CardList({ params, getItems }: CardListProps) {
  const searchParams = await params;
  const items = await getItems(searchParams);

  const mappedItems = items.map(item => {
    if ("title" in item)
      return {
        title: item.title,
        href: `/content/${item.title}`,
        description: (
          <p>
            Количество: <span className="text-foreground">{item.quantity ?? "Неограничено"}</span>
          </p>
        ),
        action: {
          title: "Стоимость",
          value: item.price
        }
      };
    else
      return {
        title: item.name,
        href: `/customers/${item.id}`,
        description: (
          <>
            <p>{item.orders_quantity} заказ(ов)</p>
            <Separator orientation="vertical" />
            <p>Зарегистрирован с {formatTime(item.created_at)}</p>
          </>
        ),
        action: {
          title: "Общий чек",
          value: item.total_revenue
        }
      };
  });

  if (!items.length) return <div className="py-6 mx-auto text-muted-foreground">Ничего не найдено</div>;
  return (
    <CardContent className="space-y-4 overflow-y-auto pb-6">
      {mappedItems.map(item => (
        <CardListItem key={item.href} {...item} />
      ))}
    </CardContent>
  );
}
