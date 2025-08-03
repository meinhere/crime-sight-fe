import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function GET() {
  try {
    // Destroy the session
    await deleteSession();

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
