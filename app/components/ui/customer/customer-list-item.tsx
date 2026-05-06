"use client";

import { formatTime } from "@/app/lib/utils";
import { Customer } from "@/generated/prisma/client";
import { Separator } from "../separator";
import { useRouter } from "next/navigation";

type CustomerListItemProps = {
  customer: Customer;
};

export function CustomerListItem({ customer }: CustomerListItemProps) {
  const { replace } = useRouter();

  const getShortName = (name: string) => {
    const wordArr = name.split(" ", 2);
    if (wordArr.length === 1) return wordArr[0][0] + wordArr[0][1];
    return wordArr.map(word => word[0]).join("");
  };

  return (
    <div
      onClick={() => replace(`/customers/${customer.id}`)}
      className="px-6 py-4 flex justify-between items-center rounded-2xl bg-muted hover:bg-muted/70 duration-150 cursor-pointer"
    >
      <div className="flex gap-4">
        <div className="size-12 flex justify-center items-center border border-border rounded-xl text-lg font-medium">
          {getShortName(customer.name)}
        </div>

        <div className="space-y-1">
          <p className="font-medium">{customer.name}</p>
          <div className="flex gap-2 text-muted-foreground">
            <p>{customer.orders_quantity} заказ(ов)</p>
            <Separator orientation="vertical" />
            <p>Зарегистрирован с {formatTime(customer.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-muted-foreground">Общий чек</p>
        <p className="font-semibold">₽{customer.total_revenue}</p>
      </div>
    </div>
  );
}
