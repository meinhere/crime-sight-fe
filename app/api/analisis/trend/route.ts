import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const startYearPutusan = await prisma.putusan.findFirst({
      select: { tahun: true },
      orderBy: { tahun: "asc" },
    });

    const { searchParams } = new URL(request.url);
    const startYear = parseInt(
      searchParams.get("start_year") ??
        startYearPutusan?.tahun?.toString() ??
        "2000"
    );
    const endYear = parseInt(
      searchParams.get("end_year") ?? new Date().getFullYear().toString()
    );
    const provinsi = searchParams.get("provinsi");

    // Build Prisma query
    const where: any = {
      tahun: {
        gte: startYear,
        lte: endYear,
      },
    };

    // Handle provinsi filter
    if (provinsi) {
      where.kabupaten = { kode_provinsi: provinsi };
    }

    // Fetch data with relations
    const data = await prisma.putusan.findMany({
      where,
      select: {
        id: true,
        tahun: true,
        jenis_kejahatan: true,
        waktu_kejadian: {
          select: {
            waktu_kejadian: true,
          },
        },
        lokasi_kejadian: {
          select: {
            nama_lokasi: true,
          },
        },
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

    // Process datasets untuk jenis kejahatan
    const jenisKejahatanList = [
      ...new Set(
        data
          .map((item) => item.jenis_kejahatan)
          .filter((jenis): jenis is string => !!jenis)
      ),
    ];
    const jenisKejahatanDatasets = jenisKejahatanList.map((jenis) => {
      const trendData = labels.map((year) => {
        return data.filter(
          (item) =>
            item.tahun.toString() === year && item.jenis_kejahatan === jenis
        ).length;
      });

      return {
        label: jenis,
        data: trendData,
      };
    });

    // Process datasets untuk waktu kejadian
    const waktuKejadianList = [
      ...new Set(
        data
          .map((item) => item.waktu_kejadian?.waktu_kejadian)
          .filter((waktu): waktu is string => !!waktu)
      ),
    ];
    const waktuKejadianDatasets = waktuKejadianList.map((waktu) => {
      const trendData = labels.map((year) => {
        return data.filter(
          (item) =>
            item.tahun.toString() === year &&
            item.waktu_kejadian?.waktu_kejadian === waktu
        ).length;
      });

      return {
        label: waktu,
        data: trendData,
      };
    });

    // Process datasets untuk lokasi kejadian
    const lokasiKejadianList = [
      ...new Set(
        data
          .map((item) => item.lokasi_kejadian?.nama_lokasi)
          .filter((lokasi): lokasi is string => !!lokasi)
      ),
    ];
    const lokasiKejadianDatasets = lokasiKejadianList.map((lokasi) => {
      const trendData = labels.map((year) => {
        return data.filter(
          (item) =>
            item.tahun.toString() === year &&
            item.lokasi_kejadian?.nama_lokasi === lokasi
        ).length;
      });

      return {
        label: lokasi,
        data: trendData,
      };
    });

    // Process datasets untuk wilayah
    let wilayahDatasets: any[] = [];
    if (provinsi) {
      // Jika provinsi dipilih, tampilkan data per kabupaten dalam provinsi tersebut
      const kabupatenList = [
        ...new Set(
          data
            .map((item) => item.kabupaten?.nama_kabupaten)
            .filter((kab): kab is string => !!kab)
        ),
      ];
      wilayahDatasets = kabupatenList.map((kab) => {
        const trendData = labels.map((year) => {
          return data.filter(
            (item) =>
              item.tahun.toString() === year &&
              item.kabupaten?.nama_kabupaten === kab
          ).length;
        });

        return {
          label: kab,
          data: trendData,
        };
      });
    } else {
      // Jika provinsi tidak dipilih, tampilkan data per provinsi
      const provinsiList = [
        ...new Set(
          data
            .map((item) => item.kabupaten?.provinsi?.nama_provinsi)
            .filter((prov): prov is string => !!prov)
        ),
      ];
      wilayahDatasets = provinsiList.map((prov) => {
        const trendData = labels.map((year) => {
          return data.filter(
            (item) =>
              item.tahun.toString() === year &&
              item.kabupaten?.provinsi?.nama_provinsi === prov
          ).length;
        });

        return {
          label: prov,
          data: trendData,
        };
      });
    }

    // Calculate statistics
    const totalRecords = data.length;

    const casesByType = jenisKejahatanList.reduce((acc, jenis) => {
      acc[jenis] = data.filter((item) => item.jenis_kejahatan === jenis).length;
      return acc;
    }, {} as Record<string, number>);

    const casesByWaktu = waktuKejadianList.reduce((acc, waktu) => {
      acc[waktu] = data.filter(
        (item) => item.waktu_kejadian?.waktu_kejadian === waktu
      ).length;
      return acc;
    }, {} as Record<string, number>);

    const casesByLokasi = lokasiKejadianList.reduce((acc, lokasi) => {
      acc[lokasi] = data.filter(
        (item) => item.lokasi_kejadian?.nama_lokasi === lokasi
      ).length;
      return acc;
    }, {} as Record<string, number>);

    let casesByWilayah: Record<string, number> = {};
    if (provinsi) {
      const kabupatenList = [
        ...new Set(
          data
            .map((item) => item.kabupaten?.nama_kabupaten)
            .filter((kab): kab is string => !!kab)
        ),
      ];
      casesByWilayah = kabupatenList.reduce((acc, kab) => {
        acc[kab] = data.filter(
          (item) => item.kabupaten?.nama_kabupaten === kab
        ).length;
        return acc;
      }, {} as Record<string, number>);
    } else {
      const provinsiList = [
        ...new Set(
          data
            .map((item) => item.kabupaten?.provinsi?.nama_provinsi)
            .filter((prov): prov is string => !!prov)
        ),
      ];
      casesByWilayah = provinsiList.reduce((acc, prov) => {
        acc[prov] = data.filter(
          (item) => item.kabupaten?.provinsi?.nama_provinsi === prov
        ).length;
        return acc;
      }, {} as Record<string, number>);
    }

    // Calculate cases per year for statistics
    const casesByYear = labels.map((year) => {
      return data.filter((item) => item.tahun.toString() === year).length;
    });

    // Calculate highest, lowest, and average crime rates
    const yearStats = {
      tertinggi: {
        tahun: "",
        jumlah: 0,
      },
      terendah: {
        tahun: "",
        jumlah: Number.MAX_SAFE_INTEGER,
      },
      rata_rata: 0,
    };

    // Find highest and lowest years
    casesByYear.forEach((count, index) => {
      const year = labels[index];

      if (count > yearStats.tertinggi.jumlah) {
        yearStats.tertinggi = {
          tahun: year,
          jumlah: count,
        };
      }

      if (count < yearStats.terendah.jumlah) {
        yearStats.terendah = {
          tahun: year,
          jumlah: count,
        };
      }
    });

    // Calculate average
    const totalCasesAllYears = casesByYear.reduce(
      (sum, count) => sum + count,
      0
    );
    yearStats.rata_rata =
      Math.round((totalCasesAllYears / casesByYear.length) * 100) / 100;

    // Reset terendah if no data found
    if (yearStats.terendah.jumlah === Number.MAX_SAFE_INTEGER) {
      yearStats.terendah = {
        tahun: "",
        jumlah: 0,
      };
    }

    // Calculate type statistics (highest, lowest, average for crime types)
    const typeStatsArray = Object.entries(casesByType).map(([type, count]) => ({
      jenis: type,
      jumlah: count,
    }));

    const typeStats = {
      tertinggi: typeStatsArray.reduce(
        (max, current) => (current.jumlah > max.jumlah ? current : max),
        { jenis: "", jumlah: 0 }
      ),
      terendah: typeStatsArray.reduce(
        (min, current) => (current.jumlah < min.jumlah ? current : min),
        { jenis: "", jumlah: Number.MAX_SAFE_INTEGER }
      ),
      rata_rata:
        typeStatsArray.length > 0
          ? Math.round(
              (typeStatsArray.reduce((sum, item) => sum + item.jumlah, 0) /
                typeStatsArray.length) *
                100
            ) / 100
          : 0,
    };

    // Reset terendah if no data
    if (typeStats.terendah.jumlah === Number.MAX_SAFE_INTEGER) {
      typeStats.terendah = { jenis: "", jumlah: 0 };
    }

    // Calculate type statistics (highest, lowest, average for waktu kejadian)
    const waktuStatsArray = Object.entries(casesByWaktu).map(
      ([waktu, count]) => ({
        waktu: waktu,
        jumlah: count,
      })
    );

    const waktuStats = {
      tertinggi: waktuStatsArray.reduce(
        (max, current) => (current.jumlah > max.jumlah ? current : max),
        { waktu: "", jumlah: 0 }
      ),
      terendah: waktuStatsArray.reduce(
        (min, current) => (current.jumlah < min.jumlah ? current : min),
        { waktu: "", jumlah: Number.MAX_SAFE_INTEGER }
      ),
      rata_rata:
        waktuStatsArray.length > 0
          ? Math.round(
              (waktuStatsArray.reduce((sum, item) => sum + item.jumlah, 0) /
                waktuStatsArray.length) *
                100
            ) / 100
          : 0,
    };

    // Reset terendah if no data
    if (waktuStats.terendah.jumlah === Number.MAX_SAFE_INTEGER) {
      waktuStats.terendah = { waktu: "", jumlah: 0 };
    }

    // Calculate type statistics (highest, lowest, average for lokasi kejadian)
    const lokasiStatsArray = Object.entries(casesByLokasi).map(
      ([lokasi, count]) => ({
        lokasi: lokasi,
        jumlah: count,
      })
    );

    const lokasiStats = {
      tertinggi: lokasiStatsArray.reduce(
        (max, current) => (current.jumlah > max.jumlah ? current : max),
        { lokasi: "", jumlah: 0 }
      ),
      terendah: lokasiStatsArray.reduce(
        (min, current) => (current.jumlah < min.jumlah ? current : min),
        { lokasi: "", jumlah: Number.MAX_SAFE_INTEGER }
      ),
      rata_rata:
        lokasiStatsArray.length > 0
          ? Math.round(
              (lokasiStatsArray.reduce((sum, item) => sum + item.jumlah, 0) /
                lokasiStatsArray.length) *
                100
            ) / 100
          : 0,
    };

    // Reset terendah if no data
    if (lokasiStats.terendah.jumlah === Number.MAX_SAFE_INTEGER) {
      lokasiStats.terendah = { lokasi: "", jumlah: 0 };
    }

    // Calculate type statistics (highest, lowest, average for wilayah)
    const wilayahStatsArray = Object.entries(casesByWaktu).map(
      ([wilayah, count]) => ({
        wilayah: wilayah,
        jumlah: count,
      })
    );

    const wilayahStats = {
      tertinggi: wilayahStatsArray.reduce(
        (max, current) => (current.jumlah > max.jumlah ? current : max),
        { wilayah: "", jumlah: 0 }
      ),
      terendah: wilayahStatsArray.reduce(
        (min, current) => (current.jumlah < min.jumlah ? current : min),
        { wilayah: "", jumlah: Number.MAX_SAFE_INTEGER }
      ),
      rata_rata:
        wilayahStatsArray.length > 0
          ? Math.round(
              (wilayahStatsArray.reduce((sum, item) => sum + item.jumlah, 0) /
                wilayahStatsArray.length) *
                100
            ) / 100
          : 0,
    };

    // Reset terendah if no data
    if (wilayahStats.terendah.jumlah === Number.MAX_SAFE_INTEGER) {
      wilayahStats.terendah = { wilayah: "", jumlah: 0 };
    }

    return NextResponse.json(
      {
        meta: {
          total_records: totalRecords,
          labels,
          details: {
            jenis_kejahatan: casesByType,
            waktu_kejadian: casesByWaktu,
            lokasi_kejadian: casesByLokasi,
            wilayah: casesByWilayah,
          },
          statistics: {
            tahun: {
              tertinggi: yearStats.tertinggi,
              terendah: yearStats.terendah,
              rata_rata: yearStats.rata_rata,
            },
            jenis_kejahatan: {
              tertinggi: typeStats.tertinggi,
              terendah: typeStats.terendah,
              rata_rata: typeStats.rata_rata,
            },
            waktu_kejadian: {
              tertinggi: waktuStats.tertinggi,
              terendah: waktuStats.terendah,
              rata_rata: waktuStats.rata_rata,
            },
            lokasi_kejadian: {
              tertinggi: lokasiStats.tertinggi,
              terendah: lokasiStats.terendah,
              rata_rata: lokasiStats.rata_rata,
            },
            wilayah: {
              tertinggi: wilayahStats.tertinggi,
              terendah: wilayahStats.terendah,
              rata_rata: wilayahStats.rata_rata,
            },
          },
          filters: {
            provinsi: provinsi || "Semua Provinsi",
            tahun: `${startYear}-${endYear}`,
          },
        },
        data: {
          tahun: casesByYear,
          jenis_kejahatan: jenisKejahatanDatasets,
          waktu_kejadian: waktuKejadianDatasets,
          lokasi_kejadian: lokasiKejadianDatasets,
          wilayah: wilayahDatasets,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
