import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware is working");
  const token = request.cookies.get("token")?.value;

  console.log("TOKEN", token);

  const { pathname } = request.nextUrl;

  switch (true) {
    case !token && pathname !== "/login":
      return NextResponse.redirect(new URL("/login", request.url));

    case token && pathname === "/login":
    case token && pathname === "/":
      return NextResponse.redirect(new URL("/files", request.url));

    default:
      return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/files", "/login"],
};
