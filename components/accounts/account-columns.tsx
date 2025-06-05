"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Account } from "@/types/account";
import { AccountActions } from "./account-actions";

export function accountColumns(onDeleted: () => void): ColumnDef<Account>[] {
    return [
        {
            accessorKey: "account_type_name",
            header: "Type",
            cell: ({ row }) => row.original.account_type_name,
        },
        {
            accessorKey: "balance",
            header: "Balance",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                return <AccountActions item={item} onDeleted={onDeleted} />;
            },
        },
    ];
}
