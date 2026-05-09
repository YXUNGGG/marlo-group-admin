import { ShoppingBagIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";
import { formatTime } from "@/app/lib/utils";
import { prisma } from "@/app/lib/prisma";
import { Separator } from "../separator";
import { CardBottomGradient } from "../.custom/card-bottom-gradient";

type RecentActionsCardProps = {
  className: string;
};

export default async function RecentActionsCard({ className }: RecentActionsCardProps) {
  const [userActions, orderActions, productActions, customerActions] = await prisma.$transaction([
    prisma.user.findMany({ orderBy: [{ created_at: "desc" }], take: 3 }),
    prisma.order.findMany({ orderBy: [{ created_at: "desc" }, { updated_at: "desc" }], take: 10 }),
    prisma.product.findMany({ orderBy: [{ created_at: "desc" }, { updated_at: "desc" }], take: 10 }),
    prisma.customer.findMany({ orderBy: [{ created_at: "desc" }, { updated_at: "desc" }], take: 10 })
  ]);

  const mappedActions = [
    ...userActions.map(item => ({ ...item, action: "Создание пользователя" })),
    ...orderActions.map(item => ({ ...item, action: "Создание/обновление заказа" })),
    ...productActions.map(item => ({ ...item, action: "Создание/обновление продукта" })),
    ...customerActions.map(item => ({ ...item, action: "Регистрация/обновление клиента" }))
  ];

  const recentActions = mappedActions
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 10);

  type ActionItem = (typeof recentActions)[number];

  const getActionPayload = (action: ActionItem) => {
    if ("role" in action) return action.role === "editor" ? "Админ" : "Наблюдатель";
    else if ("price" in action) return `₽${action.price}`;
    else if ("status" in action) return `Статус: ${action.status}`;
    else return `Успешно!`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Недавние действия</CardTitle>
        <CardDescription>Последняя активность команды</CardDescription>
      </CardHeader>

      <CardContent className="h-full overflow-y-auto scroll-">
        {recentActions.map(action => (
          <div key={action.id}>
            <div className="py-4 px-3 flex justify-between items-center">
              <div className="flex-2 flex gap-4 items-center">
                <div className="p-2.5 bg-secondary rounded-xl">
                  <ShoppingBagIcon size="20" />
                </div>
                <div>
                  <div>
                    {(
                      ("name" in action && action.name) ||
                      ("title" in action && action.title) ||
                      ("product_title" in action && action.product_title) ||
                      ""
                    ).replace(/(^.{24}).*/, "$1...")}
                  </div>
                  <div className="text-muted-foreground">{action.action}</div>
                </div>
              </div>
              <p className="flex-1 text-center text-muted-foreground">
                {formatTime(
                  "updated_at" in action && action.updated_at < action.created_at
                    ? action.updated_at
                    : action.created_at
                )}
              </p>
              <p className="flex-1 font-semibold text-right">{getActionPayload(action)}</p>
            </div>
            <Separator />
          </div>
        ))}
      </CardContent>

      <CardBottomGradient />
    </Card>
  );
}
