"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Account } from "@/types/account";

type Props = {
    item: Account;
    onDeleted: () => void;
};

export function AccountActions({ item, onDeleted }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [confirmInput, setConfirmInput] = useState("");

    const handleDelete = async () => {
        const toastId = toast.loading("Deleting account...");

        try {
            await axios.delete(`/api/accounts/${item.id}`);
            toast.success("Account deleted!", { id: toastId });
            setOpen(false);
            onDeleted();
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const message =
                error.response?.data?.detail || `Failed to delete account.`;
            toast.error(message, { id: toastId });
        }
    };

    const isMatch = confirmInput === item.account_type_name;

    return (
        <>
            <div className="flex justify-end gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/accounts/edit/${item.id}`)}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setOpen(true)}
                >
                    Delete
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        To confirm, type <strong>{item.account_type_name}</strong> below:
                    </p>

                    <Input
                        placeholder="Type the account type name..."
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                    />

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={!isMatch}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
