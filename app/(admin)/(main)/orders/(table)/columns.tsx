"use client";

import { Order, OrderStatus } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { ChevronsUpDownIcon, Edit, InfoIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";

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
import { formatTime } from "@/app/lib/utils";
import { StatusBadge } from "@/app/components/ui/status-badge";
import Link from "next/link";
import { changeOrderStatus } from "@/app/lib/actions";
import { DeleteOrderModal } from "@/app/components/ui/orders/delete-order-modal";
import { DialogTrigger } from "@/app/components/ui/dialog";
import { statuses } from "./data";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "id",
    header: "ID"
  },
  {
    accessorKey: "product_title",
    header: "Тема"
  },
  {
    accessorKey: "customer.name",
    header: "Клиент"
  },
  {
    id: "price",
    accessorKey: "product.price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Сумма
          <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="px-5 font-medium">₽{row.getValue("price")}</div>
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Дата создания
          <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-6 text-muted-foreground">{formatTime(row.getValue("created_at"))}</div>
    )
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const order = row.original;
      const selectedRows = table.getSelectedRowModel().rows;
      const selectedOrders = selectedRows.map(row => row.original);
      const orderIds = selectedOrders.map(order => order.id);

      return (
        <DeleteOrderModal orderData={selectedOrders.length ? selectedOrders : [order]}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">О заказе</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <Link href={`/orders/${order.id}`}>
                <DropdownMenuItem>
                  <Edit /> Редактировать
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <InfoIcon /> Статус
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {statuses.map(option => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={async () => {
                          const updatedStatus = option.value as OrderStatus;
                          const data = (orderIds.length ? orderIds : [order]) as string[];
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

              <DialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon /> Удалить заказ
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </DeleteOrderModal>
      );
    }
  }
];
