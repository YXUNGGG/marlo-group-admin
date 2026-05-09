"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues
} from "@tanstack/react-table";

import { useState } from "react";
import { DataTablePagination } from "./pagination-interface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ColumnFilter, SearchFilter } from "./filters";
import { statuses } from "./data";
import { CreateOrderModal } from "@/app/components/ui/orders/create-order-modal";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  includeTableActions?: boolean;
  createOrderData?: Promise<{
    customers: {
      id: string;
      name: string;
    }[];
    products: {
      id: string;
      title: string;
      price: number;
    }[];
  }>;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  createOrderData,
  includeTableActions = false
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection },
    initialState: {
      pagination: { pageSize: 10 }
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const tableActions = (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <SearchFilter table={table} />
        <ColumnFilter title="Фильтр по статусу" options={statuses} column={table.getColumn("status")} />
      </div>

      {createOrderData && <CreateOrderModal createOrderData={createOrderData} />}
    </div>
  );

  return (
    <div className="space-y-4">
      {includeTableActions && tableActions}

      <div className="overflow-hidden rounded-4xl border">
        <Table>
          <TableHeader className="bg-card select-none">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-card!">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
