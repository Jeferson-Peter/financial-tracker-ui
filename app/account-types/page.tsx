"use client";

import Link from "next/link";

import { AccountTypeTable } from "@/components/account-types/account-type-table";
import { Button } from "@/components/ui/button";


export default function AccountTypesPage() {

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Account Types</h1>
                <Link href="/account-types/create">
                    <Button>Create New</Button>
                </Link>
            </div>
            <AccountTypeTable/>
        </div>
    );
}
