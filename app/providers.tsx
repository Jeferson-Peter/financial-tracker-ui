"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar"; // 👈 Adicionado
import type { ReactNode } from "react";
import {TooltipProvider} from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
                <SidebarProvider>
                    {children}
                </SidebarProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}
