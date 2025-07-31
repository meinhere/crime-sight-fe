import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startYear = parseInt(searchParams.get("start_year") || "2020");
    const endYear = parseInt(searchParams.get("end_year") || "2025");
    const jenis_kejahatan = searchParams.get("jenis_kejahatan");
    const kabupaten = searchParams.get("kabupaten");

    // Build Prisma query
    const where: any = {
      tahun: {
        gte: startYear,
        lte: endYear,
      },
    };

    if (jenis_kejahatan) {
      where.jenis_kejahatan = jenis_kejahatan;
    }

    if (kabupaten) {
      const kabupatenData = await prisma.kabupaten.findFirst({
        where: { nama_kabupaten: kabupaten },
        select: { id: true },
      });

      if (kabupatenData) {
        where.kabupaten_id = kabupatenData.id;
      } else {
        // Jika kabupaten tidak ditemukan, return empty result
        return NextResponse.json(
          {
            labels: [],
            datasets: [],
            message: `Kabupaten "${kabupaten}" tidak ditemukan`,
          },
          { status: 404 }
        );
      }
    }

    const data = await prisma.putusan.findMany({
      where,
      select: {
        tahun: true,
        jenis_kejahatan: true,
        kabupaten: {
          select: {
            nama_kabupaten: true,
            provinsi: {
              select: {
                nama_provinsi: true,
              },
            },
          },
        },
      },
    });

    // Generate labels untuk tahun
    const labels: string[] = [];
    for (let year = startYear; year <= endYear; year++) {
      labels.push(year.toString());
    }

    // Jika ada filter jenis kejahatan spesifik
    if (jenis_kejahatan) {
      const trendData = labels.map((year) => {
        return (
          data.filter(
            (item) =>
              item.tahun.toString() === year &&
              item.jenis_kejahatan === jenis_kejahatan
          ).length || 0
        );
      });

      const label = kabupaten
        ? `Kasus ${jenis_kejahatan} di ${kabupaten}`
        : `Kasus ${jenis_kejahatan}`;

      return NextResponse.json(
        {
          labels,
          datasets: [
            {
              label,
              data: trendData,
            },
          ],
          meta: {
            total_cases: trendData.reduce((sum, val) => sum + val, 0),
            filter: {
              jenis_kejahatan,
              kabupaten: kabupaten || "Semua Kabupaten",
              tahun: `${startYear}-${endYear}`,
            },
          },
        },
        { status: 200 }
      );
    }

    // Jika tidak ada filter jenis kejahatan, tampilkan semua jenis kejahatan
    const jenisKejahatanList = [
      ...new Set(data.map((item) => item.jenis_kejahatan)),
    ].filter((jenis): jenis is string => jenis !== null);

    const datasets = jenisKejahatanList.map((jenis) => {
      const trendData = labels.map((year) => {
        return (
          data.filter(
            (item) =>
              item.tahun.toString() === year && item.jenis_kejahatan === jenis
          ).length || 0
        );
      });

      const label = kabupaten
        ? `Kasus ${jenis} di ${kabupaten}`
        : `Kasus ${jenis}`;

      return {
        label,
        data: trendData,
      };
    });

    // Calculate summary statistics
    const totalCases = data.length;
    const casesByType = jenisKejahatanList.reduce((acc, jenis) => {
      acc[jenis] = data.filter((item) => item.jenis_kejahatan === jenis).length;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(
      {
        labels,
        datasets,
        meta: {
          total_cases: totalCases,
          cases_by_type: casesByType,
          filter: {
            kabupaten: kabupaten || "Semua Kabupaten",
            tahun: `${startYear}-${endYear}`,
          },
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
  } finally {
    await prisma.$disconnect();
  }
}
