import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { djangoAPI } from "@/lib/api";
import type { AxiosError } from "axios";

export async function POST() {
    const refresh = (await cookies()).get("refresh")?.value;

    if (!refresh) {
        return NextResponse.json({ error: "Refresh token not found." }, { status: 400 });
    }

    try {
        await djangoAPI.post(
            "/auth/logout/",
            { refresh },
            {
                headers: {
                    Authorization: `Bearer ${(await cookies()).get("access")?.value || ""}`,
                },
            }
        );


        const response = NextResponse.json({ success: true });

        response.cookies.set("access", "", { maxAge: 0, path: "/" });
        response.cookies.set("refresh", "", { maxAge: 0, path: "/" });

        return response;
    } catch (err: unknown) {
        const axiosError = err as AxiosError<{ detail?: string; error?: string }>;
        console.error("Logout error:", axiosError.response?.data);

        const errorMessage =
            axiosError.response?.data?.detail ||
            axiosError.response?.data?.error ||
            "Unexpected error during logout.";

        return NextResponse.json({ error: errorMessage }, { status: axiosError.response?.status || 500 });
    }
}
