"use client";

import { Sparkles, Home, Plus, Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

export function NavMain() {
  const pathname = usePathname();
  const primaryUrls = ["/dashboard/", "/dashboard/create"];

  const mappedItems = navMain.map((item) => ({
    ...item,
    isPrimary: primaryUrls.includes(item.url),
    isActive: 
      item.title === "Create" ? false :
      pathname === item.url || 
      (item.url !== "#" && pathname.startsWith(item.url) && item.url !== "/dashboard/" ? true : 
       item.url === "/dashboard/" && pathname === "/dashboard"),
  }));

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {mappedItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.isActive}
              className={
                item.title === "Create"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90"
                  : ""
              }
              tooltip={{
                children: item.title,
                side: "right",
              }}
            >
              <Link href={item.url}>
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}

const navMain = [
  {
    title: "Ask AI",
    url: "#",
    icon: Sparkles,
  },
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: Compass,
  },
  {
    title: "Create",
    url: "/dashboard/create",
    icon: Plus,
  },
];