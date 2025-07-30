import { PrismaClient } from "@prisma/client";
import { provinsi } from "./data/provinsi";

export async function ProvinsiSeeder(prisma: PrismaClient) {
  console.log("Seeding provinces...");

  await prisma.provinsi.createMany({
    skipDuplicates: true,
    data: [...provinsi],
  });

  console.log("Provinces seeded successfully!");
}
