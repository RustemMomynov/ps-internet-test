import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isValidJWT(token: string): boolean {
  const parts = token.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  const isTokenValid = token && isValidJWT(token);

  switch (true) {
    case !isTokenValid && pathname !== "/login":
      return NextResponse.redirect(new URL("/login", request.url));

    case isTokenValid && pathname === "/login":
    case isTokenValid && pathname === "/":
      return NextResponse.redirect(new URL("/files", request.url));

    default:
      return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/files", "/login"],
};
