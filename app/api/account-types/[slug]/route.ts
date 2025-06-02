import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { djangoAPI } from "@/lib/api";
import type { AxiosError } from "axios";

// GET


export async function GET(req: Request, { params }: { params: { slug: string } }) {
    const token = (await cookies()).get("access")?.value;

    if (!token) {
        return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    try {
        const res = await djangoAPI.get(`/account-types/${params.slug}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(res.data);
    } catch (err) {
        const error = err as AxiosError;
        return NextResponse.json(error.response?.data || { detail: "Unexpected error" }, {
            status: error.response?.status || 500,
        });
    }
}

// PUT
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
    const token = (await cookies()).get("access")?.value;
    if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    try {
        const { data } = await djangoAPI.put(`/account-types/${params.slug}/`, body, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json(data);
    } catch (error) {
        const err = error as AxiosError;
        return NextResponse.json(
            err.response?.data || { detail: "Error updating account type" },
            { status: err.response?.status || 500 }
        );
    }
}

// DELETE
export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
    const token = (await cookies()).get("access")?.value;
    if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

    try {
        await djangoAPI.delete(`/account-types/${params.slug}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return NextResponse.json({ detail: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return NextResponse.json(
            err.response?.data || { detail: "Error deleting account type" },
            { status: err.response?.status || 500 }
        );
    }
}
