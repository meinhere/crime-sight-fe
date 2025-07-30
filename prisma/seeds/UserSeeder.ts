import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function UserSeeder(prisma: PrismaClient) {
  console.log("Seeding users...");

  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.users.createMany({
    skipDuplicates: true,
    data: [
      {
        nama_lengkap: "Sabil Ahmad Hidayat",
        email: "sabilahmad@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        nama_lengkap: "Abdul Rahem Faqih",
        email: "abdulrahem@gmail.com",
        password: hashedPassword,
        role: "user",
      },
      {
        nama_lengkap: "Mocahmmad Hanafi",
        email: "mochammadhanafi@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
    ],
  });

  console.log("Users seeded successfully!");
}
