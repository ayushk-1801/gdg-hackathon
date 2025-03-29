"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavUser
          user={{
            name: "Demo user",
            email: "demo@example.com",
            avatar: "",
          }}
        />
      </SidebarHeader>
      <SidebarContent >
        <SidebarGroup>
          <NavMain />
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <NavSecondary />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Optional footer content */}
      </SidebarFooter>
    </Sidebar>
  );
}
