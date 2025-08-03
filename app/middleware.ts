import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoutes = protectedRoutes.includes(path);
  const isPublicRoutes = publicRoutes.includes(path);

  const session = await getSession();
  const { role } = session;

  if (isProtectedRoutes && !session.id) {
    return NextResponse.redirect("/login");
  }

  if (isPublicRoutes && session.id) {
    if (role == "admin") {
      return NextResponse.redirect("/dashboard");
    }
    return NextResponse.redirect("/");
  }

  if (isProtectedRoutes && role !== "admin") {
    return NextResponse.redirect("/");
  }

  return NextResponse.next();
}
