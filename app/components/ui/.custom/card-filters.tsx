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
import { Button } from "../button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@/app/hooks/use-debounce";

export type CardParamsType = { query: string; sort: string };

type CardFiltersType = {
  filters: { label: string; value: string }[];
};

export function CardFilters({ filters }: CardFiltersType) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [sort, setSort] = useState(searchParams.get("sort"));
  const [query, setQuery] = useState(searchParams.get("query"));
  const debouncedQuery = useDebounce(query);

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
    <div className="flex gap-4">
      <InputGroup className="min-w-84">
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
            {filters.map(({ value, label }) => (
              <React.Fragment key={value}>
                <DropdownMenuItem onClick={() => setSort(`${value}=asc`)}>
                  <ArrowUpIcon className="text-muted-foreground" />
                  {label}
                  {sort === `${value}=asc` && CheckContainer}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setSort(`${value}=desc`)}>
                  <ArrowDownIcon className="text-muted-foreground" />
                  {label}
                  {sort === `${value}=desc` && CheckContainer}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
