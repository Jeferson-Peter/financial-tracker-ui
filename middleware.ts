import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access")?.value;
    const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname);

    // 🔧 Cria a resposta padrão
    const res = NextResponse.next();

    // 🔁 Injeta o pathname para que o layout possa decidir sobre a sidebar
    res.headers.set("x-pathname", request.nextUrl.pathname);

    // 🔒 Redireciona se não autenticado e rota protegida
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 🔁 Evita mostrar login para quem já está autenticado
    if (token && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return res;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
    ],
};
