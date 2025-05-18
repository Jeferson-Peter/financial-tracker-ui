"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await axios.post("/api/auth/register", { email, password });
            toast.success("User registered successfully!");
            router.push("/login");
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ detail?: string; error?: string }>;
            toast.error(
                axiosError.response?.data?.error ||
                axiosError.response?.data?.detail ||
                "Unknown error during registration."
            );
        }
    };

    return (
        // <main className="max-w-md mx-auto mt-20">
        <Card className="w-full max-w-lg p-6">
            <CardHeader>
                <CardTitle className="text-xl">Register</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleRegister} className="w-full">
                    Register
                </Button>
            </CardContent>
        </Card>
        // </main>
    );
}
