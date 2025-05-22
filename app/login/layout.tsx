export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-full flex items-center justify-center min-h-screen bg-background p-4">
            {/*<div className="w-full max-w-md bg-white shadow rounded-lg p-8">*/}
                {children}
            {/*</div>*/}
        </main>
    );
}
