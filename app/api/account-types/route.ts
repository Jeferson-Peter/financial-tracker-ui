import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { djangoAPI } from "@/lib/api";
import type { AxiosError } from "axios";

// CREATE
export async function POST(req: NextRequest) {
    const token = (await cookies()).get("access")?.value;

    if (!token) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    try {
        const { data } = await djangoAPI.post("/account-types/", body, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        const err = error as AxiosError;
        return NextResponse.json(err.response?.data || { detail: "Error creating account type" }, {
            status: err.response?.status || 500,
        });
    }
}

// LIST
export async function GET(req: NextRequest) {
    const token = (await cookies()).get("access")?.value;

    if (!token) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const search = req.nextUrl.search; // pega a querystring, como ?page=2

    try {
        const { data } = await djangoAPI.get(`/account-types/${search}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return NextResponse.json(
            err.response?.data || { detail: "Error fetching account types" },
            { status: err.response?.status || 500 }
        );
    }
}
