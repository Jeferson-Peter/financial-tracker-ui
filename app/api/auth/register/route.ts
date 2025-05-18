import { NextRequest, NextResponse } from "next/server";
import { djangoAPI } from "@/lib/api";
import type { AxiosError } from "axios";

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        await djangoAPI.post("/auth/register/", body);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const axiosError = err as AxiosError<{ detail?: string; error?: string }>;

        const errorMessage =
            axiosError.response?.data?.detail ||
            axiosError.response?.data?.error ||
            "Unknown error during registration.";

        return NextResponse.json(
            { error: errorMessage },
            { status: axiosError.response?.status || 500 }
        );
    }
}
