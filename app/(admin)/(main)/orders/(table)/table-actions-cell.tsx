"use client";

import { OrderStatus } from "@/generated/prisma/enums";
import { Row, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";
import Link from "next/link";
import { changeOrderStatus, fullOrder } from "@/app/lib/actions";
import { DeleteOrderModal } from "@/app/components/ui/orders/delete-order-modal";
import { DialogTrigger } from "@/app/components/ui/dialog";
import { statuses } from "./data";
import { Button } from "@/app/components/ui/button";
import { EditIcon, InfoIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import clsx from "clsx";

type TableActionsCellProps = {
  row: Row<{
    id: string;
    note: string | null;
    status: OrderStatus;
    customer_id: string;
    product_title: string;
    created_at: Date;
    updated_at: Date;
  }>;

  table: Table<{
    id: string;
    note: string | null;
    status: OrderStatus;
    customer_id: string;
    product_title: string;
    created_at: Date;
    updated_at: Date;
  }>;
};

export function TableActionsCell({ row, table }: TableActionsCellProps) {
  const { data } = useSession();

  const order = row.original;
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedOrders = selectedRows.map(row => row.original);
  const orderIds = selectedOrders.map(order => order.id);

  return (
    <DeleteOrderModal orderData={(selectedOrders.length ? selectedOrders : [order]) as fullOrder[]}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">О заказе</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <Link href={`/orders/${order.id}`}>
            <DropdownMenuItem>
              <EditIcon /> Редактировать
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              disabled={data?.user.role === "viewer"}
              className={clsx(data?.user.role === "viewer" && "opacity-70")}
            >
              <InfoIcon /> Статус
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {statuses.map(option => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={async () => {
                      const updatedStatus = option.value as OrderStatus;
                      const data = (orderIds.length ? orderIds : [order.id]) as string[];
                      await changeOrderStatus(data, updatedStatus);
                    }}
                  >
                    <div className={`size-3 rounded-2xl ${option.color}`} />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DialogTrigger asChild disabled={data?.user.role === "viewer"}>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon /> Удалить заказ
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteOrderModal>
  );
}
