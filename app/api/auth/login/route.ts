import { NextRequest, NextResponse } from "next/server";
import { djangoAPI } from "@/lib/api";
import type { AxiosError } from "axios";

export async function POST(req: NextRequest) {
    const body = await req.json();

    console.log("📩 Body recebido pelo Next.js API Route:", body);

    try {
        const { data } = await djangoAPI.post("/auth/login/", body);
        console.log("✅ Django respondeu com:", data);

        const response = NextResponse.json({ success: true });

        response.cookies.set("access", data.access, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
        });

        response.cookies.set("refresh", data.refresh, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
        });

        return response;
    } catch (err: unknown) {
        const axiosError = err as AxiosError<{ detail?: string; error?: string }>;

        console.error("❌ Erro ao fazer login com o Django:");
        console.error("📦 status:", axiosError.response?.status);
        console.error("📦 data:", axiosError.response?.data);
        console.error("📦 message:", axiosError.message);

        const errorMessage =
            axiosError.response?.data?.detail ||
            axiosError.response?.data?.error ||
            axiosError.message ||
            "Unknown error during login";

        return NextResponse.json(
            { error: errorMessage },
            { status: axiosError.response?.status || 500 }
        );
    }
}
