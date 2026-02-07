import { verify } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./auth";

const PUBLIC_ROUTES = ["/auth", "/auth/login", "/auth/signup"];
const AUTH_ROUTES = ["/app/dashboard", "/profile", "/settings"];

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname);
    const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname);

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isAuthRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        try {
            await verifyJWT();
        } catch (error) {
            const response = NextResponse.redirect(new URL("/auth/login", request.url));
            response.cookies.delete("token");
            return response;
        }
    }
    return NextResponse.next();
}
