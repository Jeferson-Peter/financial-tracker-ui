"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { refetchUser } = useAuth();


    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleLogin = async (data: LoginFormValues) => {
        try {
            await axios.post("/api/auth/login", data);
            toast.success("Login successful!");
            router.replace("/dashboard");
            router.refresh()
            await refetchUser();
        } catch (error) {
            const err = error as AxiosError<{ error?: string; detail?: string }>;


            toast.error(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Invalid credentials or unknown error."
            );
        }
    };
    const renderField = (
        name: keyof LoginFormValues,
        label: string,
        type: "text" | "password",
        autoComplete: string,
        placeholder: string
    ) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            autoComplete={autoComplete}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <div className="w-full max-w-md rounded-lg shadow-lg p-8 bg-card text-foreground border border-border">
        <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center">Login</h1>

                    {renderField("username", "Username", "text", "username", "Your username")}
                    {renderField("password", "Password", "password", "current-password", "Password")}

                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    );
}
