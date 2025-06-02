import AccountTypeForm from "@/components/account-types/account-type-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateAccountTypePage() {
    return (
        <div className="p-6 max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Create Account Type</h1>
                <Link href="/account-types">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <AccountTypeForm />
        </div>
    );
}
