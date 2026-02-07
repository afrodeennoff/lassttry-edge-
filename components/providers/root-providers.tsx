"use client"

import { ThemeProvider } from "@/context/theme-provider";
import { DataProvider } from "@/context/data-provider";
import { SyncContextProvider } from "@/context/sync-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export function RootProviders({ children }: { children: React.ReactNode }) {
    return (
        <TooltipProvider>
            <ThemeProvider>
                <DataProvider>
                    <SyncContextProvider>
                        <SidebarProvider>
                            <Toaster />
                            {children}
                        </SidebarProvider>
                    </SyncContextProvider>
                </DataProvider>
            </ThemeProvider>
        </TooltipProvider>
    );
}
