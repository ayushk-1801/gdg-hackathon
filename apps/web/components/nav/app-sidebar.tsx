"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { authClient } from "@/lib/auth-client";
import { PanelLeftIcon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();
  const { data: session } = authClient.useSession();

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
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="sm"
                onClick={toggleSidebar}
                tooltip={{
                  children: "Toggle Sidebar",
                  side: "right",
                }}
              >
                <PanelLeftIcon className="h-4 w-4" />
                <span>Toggle Sidebar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
