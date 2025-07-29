import { PrismaClient } from "@prisma/client";

export async function UserSeeder(prisma: PrismaClient) {
  console.log("Seeding users...");

  await prisma.users.createMany({
    data: [
      {
        namaLengkap: "Sabil Ahmad Hidayat",
        email: "sabilahmad@gmail.com",
        password: "password",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        namaLengkap: "Abdul Rahem Faqih",
        email: "abdulrahem@gmail.com",
        password: "password",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        namaLengkap: "Mocahmmad Hanafi",
        email: "mochammadhanafi@gmail.com",
        password: "password",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log("Users seeded successfully!");
}
