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
import type { ControllerRenderProps } from "react-hook-form";

// ✅ Schema de validação com `username`
const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type FieldProps<T extends keyof LoginFormValues> = {
    field: ControllerRenderProps<LoginFormValues, T>;
};

export default function LoginPage() {
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            await axios.post("/api/auth/login", values);
            toast.success("Login successful!");
            router.push("/dashboard");
        } catch (err: unknown) {
            const axiosError = err as AxiosError<{ detail?: string; error?: string }>;
            toast.error(
                axiosError.response?.data?.error ||
                axiosError.response?.data?.detail ||
                "Invalid credentials or unknown error."
            );
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center">Login</h1>

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }: FieldProps<"username">) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        autoComplete="username"
                                        placeholder="Your username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }: FieldProps<"password">) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    );
}
