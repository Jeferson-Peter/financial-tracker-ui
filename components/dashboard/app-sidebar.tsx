"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Home,
    LineChart,
    CreditCard,
    LogOut,
    Menu,
    User2,
} from "lucide-react";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {toast} from "sonner";
import {AxiosError} from "axios";
import {useAuth} from "@/hooks/useAuth";

export function AppSidebar() {
    const pathname = usePathname();
    const { state, toggleSidebar } = useSidebar();
    const router = useRouter();
    const { user } = useAuth();

    const isCollapsed = state === "collapsed";

    const menuItems = [
        {
            label: "Overview",
            href: "/dashboard",
            icon: Home,
        },
        {
            label: "Account Types",
            href: "/account-types",
            icon: LineChart,
        },
        {
            label: "Transactions",
            href: "/dashboard/transactions",
            icon: CreditCard,
        },
    ];


    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Logged out successfully");
                router.replace("/login");
                router.refresh();
            } else {
                toast.error(data?.error || "Logout failed");
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ detail?: string; error?: string }>;

            const message =
                error.response?.data?.detail ||
                error.response?.data?.error ||
                error.message ||
                "Unexpected error during logout";

            toast.error(message);
        }
    };


    return (
        <Sidebar collapsible="icon" className="border-r bg-background">
            <SidebarHeader>
                <div className="flex items-center justify-between px-4 py-2">
                    {!isCollapsed && (
                        <span className="text-lg font-bold truncate">
          Financial Tracker
        </span>
                    )}
                    <SidebarTrigger onClick={toggleSidebar}>
                        <Menu className="h-5 w-5 text-muted-foreground" />
                    </SidebarTrigger>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {menuItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        const content = (
                            <Link
                                href={href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {!isCollapsed && <span className="truncate">{label}</span>}
                            </Link>
                        );

                        return (
                            <SidebarMenuItem key={href}>
                                {isCollapsed ? (
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                                        <TooltipContent side="right">{label}</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    content
                                )}
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu className="flex flex-col gap-1">
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full justify-start">
                                    <User2 className="h-4 w-4" />
                                    {!isCollapsed && (
                                        <span className="ml-2 truncate">{user?.username || "User"}</span>
                                    )}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        {isCollapsed ? (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center justify-center px-2 py-2">
                                        <ModeToggle />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">Theme</TooltipContent>
                            </Tooltip>
                        ) : (
                            <div className="flex items-center justify-start px-2 py-2">
                                <ModeToggle />
                            </div>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
