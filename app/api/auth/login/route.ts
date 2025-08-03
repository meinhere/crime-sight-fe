import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSession } from "@/lib/session";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const loginSchema = z.object({
  email: z.email("Invalid email address").trim(),
  password: z.string().min(8, "Password must be at least 8 characters").trim(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const result = loginSchema.safeParse(data);

    // Zod validation
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((e) => {
        if (e.path.length > 0) {
          errors[String(e.path[0])] = e.message;
        }
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Check if user exists
    const { email, password } = result.data;
    const foundUser = await prisma.users.findFirst({
      where: { email },
    });

    // Compare password
    if (foundUser && !(await bcrypt.compare(password, foundUser.password))) {
      return NextResponse.json(
        { errors: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If user not found or password doesn't match
    if (!foundUser) {
      return NextResponse.json(
        { errors: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    await createSession(foundUser);

    // Redirect to dashboard (change URL as needed)
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
