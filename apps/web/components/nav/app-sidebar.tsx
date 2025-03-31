"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (state === "expanded") {
      toggleSidebar();
    }
  }, [state, toggleSidebar]);

  return (
    <Sidebar collapsible="icon" {...props} className="z-50">
      <SidebarHeader>
        <NavUser
          user={{
            name: session?.user?.name || "Guest User",
            email: session?.user?.email || "guest@example.com",
            avatar: session?.user?.image || "",
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <NavMain />
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <NavSecondary />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{/* Optional footer content */}</SidebarFooter>
    </Sidebar>
  );
}
