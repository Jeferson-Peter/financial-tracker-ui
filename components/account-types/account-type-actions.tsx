"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { AccountType } from "@/types/account-types";

type Props = {
    item: AccountType;
    onDeleted: () => void;
};

export function AccountTypeActions({ item, onDeleted }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [confirmInput, setConfirmInput] = useState("");

    const handleDelete = async () => {
        const toastId = toast.loading("Deleting account type...");

        try {
            await axios.delete(`/api/account-types/${item.slug}`);
            toast.success("Account type deleted!", { id: toastId });
            setOpen(false);
            onDeleted();
        } catch (err) {
            const error = err as AxiosError<{ detail?: string }>;
            const message =
                error.response?.data?.detail || `Failed to delete ${item.name}.`;

            toast.error(message, { id: toastId });
        }

    };

    const isMatch = confirmInput === item.name;

    return (
        <>
            <div className="flex justify-end gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/account-types/edit/${item.slug}`)}
                >
                    Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
                    Delete
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        To confirm, type <strong>{item.name}</strong> below:
                    </p>

                    <Input
                        placeholder="Type the name exactly..."
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
