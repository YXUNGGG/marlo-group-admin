"use client";

import { PagesType } from "@/app/(admin)/layout";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/app/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";
import { PAGES } from "@/app/lib/constants";

export function HeaderBreadcrumb() {
  const path = usePathname();
  const currentPage = PAGES.find(({ href }) => href.includes(path));
  const crumbs = [currentPage?.category, currentPage?.name].filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i, arr) =>
          i !== arr.length - 1 ? (
            <Fragment key={i}>
              <BreadcrumbItem>
                <BreadcrumbLink href={currentPage?.href}>{crumb}</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
            </Fragment>
          ) : (
            <BreadcrumbItem key={i} className="text-foreground">
              <BreadcrumbLink href={currentPage?.href}>{crumb}</BreadcrumbLink>
            </BreadcrumbItem>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
