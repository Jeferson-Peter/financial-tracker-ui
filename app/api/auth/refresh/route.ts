import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { djangoAPI } from "@/lib/api";
import type { AxiosError } from "axios";

export async function POST() {
    const refresh = (await cookies()).get("refresh")?.value;

    if (!refresh) {
        return NextResponse.json({ error: "Refresh token not found" }, { status: 400 });
    }

    try {
        const response = await djangoAPI.post("/auth/token/refresh/", {
            refresh,
        });

        const { access, refresh: newRefresh } = response.data;

        const res = NextResponse.json({ success: true });

        res.cookies.set("access", access, {
            httpOnly: true,
            path: "/",
        });

        if (newRefresh) {
            res.cookies.set("refresh", newRefresh, {
                httpOnly: true,
                path: "/",
            });
        }

        return res;
    } catch (err: unknown) {
        const axiosError = err as AxiosError<{ detail?: string; error?: string }>;

        const message =
            axiosError.response?.data?.detail ||
            axiosError.response?.data?.error ||
            "Unexpected error during refresh";

        return NextResponse.json({ error: message }, { status: 401 });
    }
}
