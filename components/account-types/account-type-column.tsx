"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AccountType } from "@/types/account-types";
import {AccountTypeActions} from "@/components/account-types/account-type-actions";

export function accountTypeColumns(onDeleted: () => void): ColumnDef<AccountType>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
            filterFn: (row, id, value) => {
                const cellValue = row.getValue(id) as string;
                return cellValue?.toLowerCase().includes((value as string).toLowerCase());
            },
        },
        {
            accessorKey: "is_default",
            header: "Default?",
            cell: ({ row }) =>
                row.original.is_default ? (
                    <Badge>Yes</Badge>
                ) : (
                    <Badge variant="outline">No</Badge>
                ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => row.original.description || "-",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;
                return <AccountTypeActions item={item} onDeleted={onDeleted} />;
            },
        },
    ];
}
