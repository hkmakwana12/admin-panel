import type { JSX } from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function AppLayout(): JSX.Element {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 58)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <SiteHeader />
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
