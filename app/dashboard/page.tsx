export default function DashboardPage() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-lg border p-4 shadow-sm">
                    <h2 className="font-semibold text-lg">Balance</h2>
                    <p className="text-2xl text-green-600 mt-2">$5,230.00</p>
                </div>

                <div className="rounded-lg border p-4 shadow-sm">
                    <h2 className="font-semibold text-lg">Expenses</h2>
                    <p className="text-2xl text-red-500 mt-2">$1,870.00</p>
                </div>

                <div className="rounded-lg border p-4 shadow-sm">
                    <h2 className="font-semibold text-lg">Income</h2>
                    <p className="text-2xl text-blue-500 mt-2">$3,600.00</p>
                </div>
            </div>

            <div className="rounded-lg border p-4 shadow-sm">
                <h2 className="font-semibold text-lg mb-2">Latest Transactions</h2>
                <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                        <span>🛒 Amazon Purchase</span>
                        <span className="text-red-500">– $150.00</span>
                    </li>
                    <li className="flex justify-between text-sm">
                        <span>💼 Freelance Work</span>
                        <span className="text-green-600">+ $500.00</span>
                    </li>
                    <li className="flex justify-between text-sm">
                        <span>☕ Coffee Shop</span>
                        <span className="text-red-500">– $7.00</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
