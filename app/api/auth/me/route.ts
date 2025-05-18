import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { djangoAPI } from "@/lib/api";
import type { AxiosError } from "axios";

export async function GET() {
    const token = (await cookies()).get("access")?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const { data } = await djangoAPI.get("/auth/user/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json({ user: data });
    } catch (err: unknown) {
        const axiosError = err as AxiosError;

        return NextResponse.json({ user: null }, { status: axiosError.response?.status || 401 });
    }
}
