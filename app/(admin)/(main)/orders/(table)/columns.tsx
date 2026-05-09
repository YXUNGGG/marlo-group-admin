"use client";

import { Order } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";

import { TableActionsCell } from "./table-actions-cell";
import { StatusBadge } from "@/app/components/ui/status-badge";
import { formatTime } from "@/app/lib/utils";

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
    cell: ({ row, table }) => <TableActionsCell row={row} table={table} />
  }
];
