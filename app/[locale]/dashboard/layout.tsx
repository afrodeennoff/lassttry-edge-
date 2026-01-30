import Navbar from "./components/navbar";
import { createClient } from "@/server/auth";
import { redirect } from "next/navigation";
import { DashboardProvider } from "./dashboard-context";
import { DashboardSidebar } from "@/components/sidebar/dashboard-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/authentication");
  }

  return (
    <DashboardProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          <Navbar />
          {children}
        </SidebarInset>
      </div>
    </DashboardProvider>
  );
}
