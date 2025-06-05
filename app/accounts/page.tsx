"use client";

import Link from "next/link";

import { AccountTable } from "@/components/accounts/account-table";
import { Button } from "@/components/ui/button";


export default function AccountTypesPage() {

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Accounts</h1>
                <Link href="/accounts/create">
                    <Button>Create New</Button>
                </Link>
            </div>
            <AccountTable/>
        </div>
    );
}
