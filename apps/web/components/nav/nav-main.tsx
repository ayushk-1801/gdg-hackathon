"use client";

import { Search, Sparkles, Home, Plus } from "lucide-react";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain() {
  const primaryUrls = ["/dashboard/", "/dashboard/create"];

  const mappedItems = navMain.map((item) => ({
    ...item,
    isPrimary: primaryUrls.includes(item.url),
  }));

  return (
    <SidebarMenu>
      {mappedItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.isActive}
            className={
              item.isPrimary
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90"
                : ""
            }
            tooltip={{
              children: item.title,
              hidden: true,
            }}
          >
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
              {/* {item.badge && <span className="ml-auto">{item.badge}</span>} */}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

const navMain = [
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Ask AI",
    url: "#",
    icon: Sparkles,
  },
  {
    title: "Home",
    url: "/dashboard/",
    icon: Home,
    isActive: true,
  },
  {
    title: "Create",
    url: "/dashboard/create",
    icon: Plus,
  },
];
