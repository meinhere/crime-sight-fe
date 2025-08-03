import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoutes = protectedRoutes.includes(path);
  const isPublicRoutes = publicRoutes.includes(path);

  // Get cookies from request (not from next/headers in middleware)
  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);
  
  console.log("Path:", path);
  console.log("Cookie:", cookie ? "Present" : "Not found");
  console.log("Session:", session);

  // If session is null/undefined, treat as unauthenticated
  if (!session || !session.id) {
    if (isProtectedRoutes) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const { role } = session;

  // If user is authenticated and trying to access public routes
  if (isPublicRoutes) {
    console.log("User is already logged in, redirecting to dashboard");
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If accessing protected routes and not admin
  if (isProtectedRoutes && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
