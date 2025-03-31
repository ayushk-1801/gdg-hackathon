import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="">
          {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
