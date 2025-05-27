import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/login", "/register", "/"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access")?.value;
    const refreshToken = request.cookies.get("refresh")?.value;
    const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname);
    const res = NextResponse.next();
    res.headers.set("x-pathname", request.nextUrl.pathname);

    const verifyToken = async (token: string) => {
        try {
            await jwtVerify(token, JWT_SECRET);
            return true;
        } catch {
            return false;
        }
    };

    if (!accessToken) {
        if (refreshToken && await verifyToken(refreshToken)) {
            return res;
        }

        if (!isPublic) {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.set("access", "", { maxAge: 0, path: "/" });
            response.cookies.set("refresh", "", { maxAge: 0, path: "/" });
            return response;
        }

        return res;
    }

    if (!(await verifyToken(accessToken))) {
        if (refreshToken && await verifyToken(refreshToken)) {
            return res;
        } else {
            const response = NextResponse.redirect(new URL("/login", request.url));
            response.cookies.set("access", "", { maxAge: 0, path: "/" });
            response.cookies.set("refresh", "", { maxAge: 0, path: "/" });
            return response;
        }
    }

    if (request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
