"use client";

import { useIdleTimer } from "react-idle-timer";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const TIMEOUT = 5 * 60 * 1000; // 15 minutes
const WARNING_TIME = 3 * 60; // 3 minutes in seconds

export function InactivityWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    const [showDialog, setShowDialog] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WARNING_TIME);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const logoutInProgress = useRef(false);

    // const logout = useCallback(async () => {
    //     if (logoutInProgress.current || !isAuthenticated) return;
    //     logoutInProgress.current = true;
    //
    //     try {
    //         await axios.post("/api/auth/logout", null, { withCredentials: true });
    //     } catch (error) {
    //         console.warn("Logout failed:", error);
    //     } finally {
    //         setShowDialog(false);
    //         router.replace("/login");
    //         router.refresh();
    //     }
    // }, [router, isAuthenticated]);

    const logout = useCallback(async () => {
        if (logoutInProgress.current) return;
        logoutInProgress.current = true;

        try {
            await axios.post("/api/auth/logout", null, { withCredentials: true });
        } catch (error) {
            console.warn("Logout failed:", error);
        } finally {
            setShowDialog(false);
            router.replace("/login");
            router.refresh();
        }
    }, [router]);

    const handleContinue = () => {
        setShowDialog(false);
        setTimeLeft(WARNING_TIME);
        idleTimer.reset();

        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    };

    const handleOnIdle = () => {
        logout();
    };

    const handleOnPrompt = () => {
        if (countdownRef.current) return;

        setShowDialog(true);
        setTimeLeft(WARNING_TIME);

        countdownRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current!);
                    countdownRef.current = null;
                    logout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleOnActive = () => {
        if (showDialog) {
            handleContinue();
        }
    };

    const idleTimer = useIdleTimer({
        timeout: TIMEOUT,
        promptBeforeIdle: WARNING_TIME * 1000,
        onPrompt: handleOnPrompt,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        debounce: 500,
        disabled: !isAuthenticated,
    });

    useEffect(() => {
        if (!showDialog && countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    }, [showDialog]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    
    if (loading || !isAuthenticated) return <>{children}</>;

    return (
        <>
            {children}

            <Dialog open={showDialog} onOpenChange={setShowDialog} modal>
                <DialogContent
                    className="max-w-md text-center bg-background shadow-xl border border-border"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <div className="flex items-center justify-center gap-2">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <DialogTitle className="text-xl font-semibold text-foreground">
                                Inactive Session
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground mt-1">
                        You will be logged out due to inactivity in:
                    </p>

                    <div className="flex items-center justify-center gap-2 my-4">
                        <div className="bg-muted text-foreground px-4 py-2 rounded-md shadow-sm text-3xl font-semibold font-mono min-w-[60px]">
                            {minutes}
                        </div>
                        <span className="text-3xl font-semibold text-muted-foreground">:</span>
                        <div className="bg-muted text-foreground px-4 py-2 rounded-md shadow-sm text-3xl font-semibold font-mono min-w-[60px]">
                            {seconds}
                        </div>
                    </div>

                    <div className="relative w-full h-2 bg-muted rounded overflow-hidden mt-2 mb-4">
                        <div
                            className="absolute left-0 top-0 h-full bg-destructive transition-all duration-300"
                            style={{ width: `${(timeLeft / WARNING_TIME) * 100}%` }}
                        />
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
                        <Button variant="outline" onClick={handleContinue}>
                            Continue Session
                        </Button>
                        <Button variant="destructive" onClick={logout}>
                            Logout Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
