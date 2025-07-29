// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { UserSeeder } from "./seeds/UserSeeder";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...\n");
  await UserSeeder(prisma);

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
