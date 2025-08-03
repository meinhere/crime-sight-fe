import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();
const registerSchema = z
  .object({
    nama_lengkap: z.string().min(3, "Nama lengkap is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
  });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nama_lengkap = String(formData.get("nama_lengkap"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const confirm_password = String(formData.get("confirm_password"));
    const user = { nama_lengkap, email, password, confirm_password };

    // Zod validation
    const parseResult = registerSchema.safeParse(user);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    // if user found with same email
    const foundUser = await prisma.users.findFirst({ where: { email } });
    if (foundUser) {
      return NextResponse.json(
        { error: "Email has an alredy registered!" },
        { status: 401 }
      );
    }

    await prisma.users.create({
      data: {
        nama_lengkap: nama_lengkap,
        email,
        password: await bcrypt.hash(password, 10),
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Redirect to dashboard (change URL as needed)
    return NextResponse.json(
      { message: "Register successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "An error occurred during register" },
      { status: 500 }
    );
  }
}
