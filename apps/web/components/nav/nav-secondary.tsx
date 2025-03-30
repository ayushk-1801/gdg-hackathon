import * as React from "react";
import { Send } from "lucide-react";

import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FeedbackDialog } from "@/components/nav/feedback-dialog";
import { useFeedbackStore } from "@/stores/feedback-store";

const navSecondary = [
  {
    title: "Feedback",
    icon: Send,
  },
];

export function NavSecondary(
  props: React.ComponentPropsWithoutRef<typeof SidebarGroupContent>
) {
  const { open } = useFeedbackStore();

  return (
    <SidebarGroupContent {...props}>
      <FeedbackDialog />
      <SidebarMenu>
        {navSecondary.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              size="sm"
              tooltip={{
                children: item.title,
                side: "right",
              }}
            >
              <button onClick={open}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}
