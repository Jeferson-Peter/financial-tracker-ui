"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AccountTypeForm from "@/components/account-types/account-type-form";

export default function EditAccountTypePage() {
    const { slug } = useParams();
    const [accountType, setAccountType] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/account-types/${slug}`);
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data?.detail || "Failed to fetch.");
                }
                const data = await res.json();
                setAccountType(data);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchData();
    }, [slug]);

    if (error) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }

    if (!accountType) return <p>Loading...</p>;

    return <AccountTypeForm slug={slug as string} defaultValues={accountType} />;
}
