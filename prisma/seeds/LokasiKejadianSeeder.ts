import { PrismaClient } from "@prisma/client";
import { lokasiKejadian } from "./data/lokasiKejadian";

export async function LokasiKejadianSeeder(prisma: PrismaClient) {
  console.log("Seeding lokasi kejadian...");

  await prisma.lokasiKejadian.createMany({
    skipDuplicates: true,
    data: [...lokasiKejadian],
  });

  console.log("Lokasi kejadian seeded successfully!");
}
