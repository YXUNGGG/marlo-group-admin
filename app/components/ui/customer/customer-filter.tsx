"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/app/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/app/components/ui/dropdown-menu";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, SearchIcon, SortDescIcon } from "lucide-react";
import { CardAction } from "../card";
import { Button } from "../button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/app/hooks/use-debounce";

export function CustomerFilter() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [query, setQuery] = useState(searchParams.get("query"));
  const debouncedQuery = useDebounce(query);
  const [sort, setSort] = useState(searchParams.get("sort"));

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else params.delete("query");

    if (params.get("sort") || params.get("query")) replace(`${path}?${params.toString()}`);
    else replace(path);
  }, [debouncedQuery, sort]);

  const CheckContainer = (
    <div className="flex-1 flex justify-end">
      <CheckIcon className="text-muted-foreground" />
    </div>
  );

  return (
    <CardAction className="px-6 w-full flex justify-between">
      <InputGroup className="w-2/5">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Поиск клиентов..."
          value={query ?? ""}
          onChange={e => setQuery(e.target.value)}
        />
      </InputGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <SortDescIcon /> Сортировать
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSort("created_at=asc")}>
              <ArrowUpIcon className="text-muted-foreground" />
              Дата регистрации
              {sort === "created_at=asc" && CheckContainer}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setSort("created_at=desc")}>
              <ArrowDownIcon className="text-muted-foreground" />
              Дата регистрации
              {sort === "created_at=desc" && CheckContainer}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setSort("orders_quantity=asc")}>
              <ArrowUpIcon className="text-muted-foreground" />
              Количество заказов
              {sort === "orders_quantity=asc" && CheckContainer}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setSort("orders_quantity=desc")}>
              <ArrowDownIcon className="text-muted-foreground" />
              Количество заказов
              {sort === "orders_quantity=desc" && CheckContainer}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardAction>
  );
}
