"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    const { loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (loading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <main className="w-full flex min-h-screen bg-background">
            <AppSidebar />
            <div className="flex-1 min-h-screen p-6 flex justify-center">
                <div className="w-full max-w-4xl px-4">{children}</div>
            </div>
            <Toaster richColors position="top-right" />
        </main>
    );
}
