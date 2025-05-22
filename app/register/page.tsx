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

const registerSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleRegister = async (data: RegisterFormValues) => {
        try {
            await axios.post("/api/auth/register", data);
            toast.success("User registered successfully!");
            router.push("/login");
        } catch (error) {
            const err = error as AxiosError<{ detail?: string; error?: string }>;
            toast.error(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Unknown error during registration."
            );
        }
    };

    const renderField = (
        name: keyof RegisterFormValues,
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
                <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center">Register</h1>

                    {renderField("email", "Email", "text", "email", "Your email")}
                    {renderField("password", "Password", "password", "new-password", "Create a password")}

                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </Form>
        </div>
    );
}
