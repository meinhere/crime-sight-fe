import { PrismaClient } from "@prisma/client";
import { waktuKejadian } from "./data/waktuKejadian";

export async function WaktuKejadianSeeder(prisma: PrismaClient) {
  console.log("Seeding waktu kejadian...");

  await prisma.waktuKejadian.createMany({
    skipDuplicates: true,
    data: [...waktuKejadian],
  });

  console.log("Waktu kejadian seeded successfully!");
}
