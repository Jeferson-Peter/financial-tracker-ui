"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
                <AuthProvider>
                    <SidebarProvider>
                            {children}
                    </SidebarProvider>
                </AuthProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}
