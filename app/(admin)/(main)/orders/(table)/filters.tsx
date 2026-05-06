import { Table, type Column } from "@tanstack/react-table";
import { Check, PlusCircle, Trash2Icon } from "lucide-react";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Input } from "@/app/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";

type FiltersProps<TData> = {
  table: Table<TData>;
};

export function SearchFilter<TData>({ table }: FiltersProps<TData>) {
  return (
    <Input
      placeholder="Поиск по Теме заказа..."
      value={(table.getColumn("product_title")?.getFilterValue() as string) ?? ""}
      onChange={event => table.getColumn("product_title")?.setFilterValue(event.target.value)}
      className="w-sm"
    />
  );
}

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    color: string;
  }[];
};

export function ColumnFilter<TData, TValue>({
  column,
  title,
  options
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="h-9 border-zinc-800 border border-dashed bg-card hover:bg-secondary/70">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} выбрано
                  </Badge>
                ) : (
                  options
                    .filter(option => selectedValues.has(option.value))
                    .map(option => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className={`${option.color} rounded-sm px-1.5 font-normal`}
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        <DropdownMenuGroup>
          {options.map(option => {
            const isSelected = selectedValues.has(option.value);
            return (
              <DropdownMenuItem
                key={option.value}
                className="w-full"
                onSelect={e => {
                  e.preventDefault();

                  if (isSelected) {
                    selectedValues.delete(option.value);
                  } else {
                    selectedValues.add(option.value);
                  }
                  const filterValues = Array.from(selectedValues);
                  column?.setFilterValue(filterValues.length ? filterValues : undefined);
                }}
              >
                <div className={`size-3 rounded-2xl ${option.color}`} />
                <span>{option.label}</span>
                <span className="flex flex-1 size-4 items-center justify-end font-mono text-xs text-muted-foreground">
                  {isSelected ? <Check /> : facets?.get(option.value) || 0}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => column?.setFilterValue(undefined)}
                className="justify-center text-center"
              >
                <Trash2Icon />
                Очистить фильтры
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
