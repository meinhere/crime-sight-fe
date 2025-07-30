// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { UserSeeder } from "./seeds/UserSeeder";
import { ProvinsiSeeder } from "./seeds/ProvinsiSeeder";
import { KabupatenSeeder } from "./seeds/KabupatenSeeder";
import { LokasiKejadianSeeder } from "./seeds/LokasiKejadianSeeder";
import { WaktuKejadianSeeder } from "./seeds/WaktuKejadianSeeder";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...\n");

  await UserSeeder(prisma);
  await ProvinsiSeeder(prisma);
  await KabupatenSeeder(prisma);
  await LokasiKejadianSeeder(prisma);
  await WaktuKejadianSeeder(prisma);

  console.log("\nDatabase seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
