import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const user_id = String(formData.get("user_id"));
    const judul = "New Session";
    const is_active = true;

    const res = await prisma.sesiChat.create({
      data: {
        user_id,
        judul,
        is_active,
        created_at: new Date(),
      },
    });

    const sessionId = res.id;

    return NextResponse.json(
      { message: "Session created successfully", sessionId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating session:", error);

    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
