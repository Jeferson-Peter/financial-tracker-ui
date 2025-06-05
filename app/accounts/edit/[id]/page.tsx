"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AccountForm from "@/components/accounts/account-form";
import { AccountFormValues } from "@/components/accounts/account-form";

export default function EditAccountPage() {
    const { id } = useParams();
    const [account, setAccount] = useState<AccountFormValues | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || typeof id !== "string") return;

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/accounts/${id}`, {
                    signal: controller.signal,
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data?.detail || "Failed to fetch.");
                }
                const data = await res.json();
                setAccount(data);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [id]);

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Loading account...
            </div>
        );
    }

    return <AccountForm id={id as string} defaultValues={account} />;
}
