import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

import { navigation } from "@/config/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link to="/">
          <img src="https://pub-99de907071b34c5b818be772a36c0976.r2.dev/ethericsolution-logo-final.jpeg" className="h-8" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
