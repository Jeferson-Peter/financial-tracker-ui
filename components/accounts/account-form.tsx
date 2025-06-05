"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useEffect } from "react";

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
import { AccountTypeCombobox } from "@/components/account-types/account-type-combobox";

// ✅ Schema & Types
const accountSchema = z.object({
    balance: z.coerce.number().nonnegative("Balance must be 0 or greater"),
    account_type: z.string().min(1, "Account type is required"),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

type Props = {
    id?: string;
    defaultValues?: AccountFormValues;
};

export default function AccountForm({ id, defaultValues }: Props) {
    const router = useRouter();

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            balance: 0,
            account_type: "",
        },
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                ...defaultValues,
                account_type: String(defaultValues.account_type), // 💡 Garante que o Combobox funcione
            });
        }
    }, [defaultValues, form]);

    const handleSubmit = async (data: AccountFormValues) => {
        const toastId = toast.loading(id ? "Updating account..." : "Creating account...");

        try {
            if (id) {
                await axios.put(`/api/accounts/${id}`, data);
                toast.success("Account updated!", { id: toastId });
            } else {
                await axios.post("/api/accounts", data);
                toast.success("Account created!", { id: toastId });
            }
            router.push("/accounts");
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
                        {id ? "Edit Account" : "Create Account"}
                    </h1>

                    {/* Account Type */}
                    <FormField
                        control={form.control}
                        name="account_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Type</FormLabel>
                                <FormControl>
                                    <AccountTypeCombobox
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Balance */}
                    <FormField
                        control={form.control}
                        name="balance"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Balance</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? id
                                ? "Updating..."
                                : "Creating..."
                            : id
                                ? "Update"
                                : "Create"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
