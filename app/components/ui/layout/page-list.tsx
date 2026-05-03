"use client";

import Link from "next/link";
import { Button } from "../button";
import { CategoryType, PAGES } from "@/app/lib/constants";

type PageListProps = {
  category: CategoryType;
};

export function PageList({ category }: PageListProps) {
  return (
    <>
      {PAGES.filter(page => page.category === category).map(page => (
        <Link href={page.href} key={page.href}>
          <Button variant="ghost" className="w-full justify-start">
            <page.icon strokeWidth={2.25} />
            {page.name}
          </Button>
        </Link>
      ))}
    </>
  );
}
