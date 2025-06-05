import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccountForm from "@/components/accounts/account-form";

export default function CreateAccountPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <Link href="/accounts">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>
            <AccountForm />
        </div>
    );
}
