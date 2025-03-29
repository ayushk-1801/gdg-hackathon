"use client";

import { type LucideIcon } from "lucide-react";
import { Search, Sparkles, Home, Inbox } from "lucide-react";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain() {
    return (
        <SidebarMenu>
            {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                        <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                            {item.badge && <span className="ml-auto">{item.badge}</span>}
                        </a>
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
        url: "#",
        icon: Home,
        isActive: true,
    },
    {
        title: "Create",
        url: "#",
        icon: Inbox,
    },
];
