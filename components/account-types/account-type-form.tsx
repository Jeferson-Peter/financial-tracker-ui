"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// ✅ Schema & Types
const accountTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    is_default: z.boolean(),
});

type AccountTypeFormValues = z.infer<typeof accountTypeSchema>;

type Props = {
    slug?: string;
    defaultValues?: AccountTypeFormValues;
};

export default function AccountTypeForm({ slug, defaultValues }: Props) {
    const router = useRouter();

    const form = useForm<AccountTypeFormValues>({
        resolver: zodResolver(accountTypeSchema),
        defaultValues: {
            name: "",
            description: "",
            is_default: false,
        },
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [defaultValues]);

    const handleSubmit = async (data: AccountTypeFormValues) => {
        const toastId = toast.loading(slug ? "Updating account type..." : "Creating account type...");

        try {
            if (slug) {
                await axios.put(`/api/account-types/${slug}`, data);
                toast.success("Account type updated!", { id: toastId });
            } else {
                await axios.post("/api/account-types", data);
                toast.success("Account type created!", { id: toastId });
            }
            router.push("/account-types");
        } catch (error) {
            const err = error as AxiosError<{ detail?: string; error?: string }>;
            toast.error(
                err.response?.data?.detail || err.response?.data?.error || "Something went wrong.",
                { id: toastId }
            );
        }
    };

    return (
        <div className="w-full max-w-md rounded-lg shadow p-8 bg-card text-foreground border border-border">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center">
                        {slug ? "Edit Account Type" : "Create Account Type"}
                    </h1>

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Savings" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Optional" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Is default */}
                    <FormField
                        control={form.control}
                        name="is_default"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => field.onChange(!!checked)}
                                    />
                                </FormControl>
                                <FormLabel className="!m-0">Set as default</FormLabel>
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting
                            ? slug
                                ? "Updating..."
                                : "Creating..."
                            : slug
                                ? "Update"
                                : "Create"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
