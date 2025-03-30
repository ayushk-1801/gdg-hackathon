"use client";

import React from "react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  LucideIcon,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/types";

type DropdownOption = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
};

type DropdownSection = {
  items: DropdownOption[];
  hasDivider?: boolean;
};

const DROPDOWN_SECTIONS = ({
  setTheme,
  theme,
  handleLogout,
}: {
  setTheme: (theme: string) => void;
  theme?: string;
  handleLogout: () => void;
}) => [
  {
    items: [
      {
        icon: Sparkles,
        label: "Upgrade to Pro",
        onClick: () => console.log("Upgrade clicked"),
      },
    ],
    hasDivider: true,
  },
  {
    items: [
      {
        icon: Settings,
        label: "Settings",
        onClick: () => console.log("Settings clicked"),
      },
      {
        icon: theme === "dark" ? Sun : Moon,
        label: theme === "dark" ? "Light Mode" : "Dark Mode",
        onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
    ],
    hasDivider: true,
  },
  {
    items: [
      {
        icon: LogOut,
        label: "Log out",
        onClick: handleLogout,
      },
    ],
  },
];

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin"); 
        },
      },
    });
  };

  const dropdownSections = DROPDOWN_SECTIONS({
    setTheme,
    theme,
    handleLogout,
  });

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = getInitials(user.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {dropdownSections.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                <DropdownMenuGroup>
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem key={itemIndex} onClick={item.onClick}>
                        <Icon />
                        {item.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
                {section.hasDivider && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
