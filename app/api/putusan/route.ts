import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");
    const tahun = searchParams.get("tahun");
    const search = searchParams.get("search");

    // Build filters
    const where: any = {};
    if (tahun) {
      where.tahun = parseInt(tahun);
    }
    if (search) {
      where.OR = [
        { nomor_putusan: { contains: search, mode: "insensitive" } },
        { judul_putusan: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.putusan.count({ where });

    // Get paginated data
    const data = await prisma.putusan.findMany({
      where,
      skip: (page - 1) * per_page,
      take: per_page,
      select: {
        id: true,
        nomor_putusan: true,
        uri_dokumen: true,
        judul_putusan: true,
        tahun: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(
      {
        data,
        meta: {
          total,
          page,
          per_page,
          total_pages: Math.ceil(total / per_page),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
