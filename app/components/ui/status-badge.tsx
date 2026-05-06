import { OrderStatus } from "@/generated/prisma/enums";
import { Badge } from "./badge";

type StatusBadgeProps = {
  status: OrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  let badgeConfig: { className: string; text: string };

  switch (status) {
    case "Создан":
      badgeConfig = { className: "bg-secondary", text: "Создан" };
      break;
    case "В_работе":
      badgeConfig = { className: "bg-[#153F9B]", text: "В работе" };
      break;
    case "Выполнен":
      badgeConfig = { className: "bg-[#159B48]", text: "Выполнен" };
      break;
    case "Проблема":
      badgeConfig = { className: "", text: "Проблема" };
      break;
  }

  return <Badge className={badgeConfig.className}>{badgeConfig.text}</Badge>;
}
