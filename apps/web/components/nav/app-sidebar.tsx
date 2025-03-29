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
        <NavMain />
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup className="flex-grow" />
        <SidebarGroup className="flex-grow" />
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
