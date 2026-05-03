import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator
} from "@/app/components/ui/sidebar";

import { BellIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { LogoutModal } from "../components/ui/layout/logout-modal";
import { PageList } from "../components/ui/layout/page-list";
import { HeaderBreadcrumb } from "../components/ui/layout/header-breadcrumb";
import { Suspense } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div className="sidebar-logo flex gap-2 items-center text-lg font-medium px-2 py-1">
            <div className="logo bg-primary size-8 rounded-sm text-sm font-bold flex justify-center items-center">
              MG
            </div>
            MARLO GROUP
          </div>
        </SidebarHeader>
        <SidebarSeparator className="w-[93.5%]!" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Главная</SidebarGroupLabel>
            <SidebarGroupContent>
              <PageList category="Главная" />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Управление</SidebarGroupLabel>
            <SidebarGroupContent>
              <PageList category="Управление" />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <Suspense fallback={null}>
            <LogoutModal />
          </Suspense>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="h-16 mx-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Separator orientation="vertical" className="h-5" />
          </div>

          <HeaderBreadcrumb />

          <Button variant="outline" className="size-9">
            <BellIcon className="bg-text-secondary" />
          </Button>
        </header>

        <div className="h-full page-container px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
