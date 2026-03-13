import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧬 PUNK RECORDS : Tentative de connexion...");
  const allFruits = await prisma.devilFruit.findMany();
  console.log("✅ Connexion réussie !");
  console.log(`Données archivées : ${allFruits.length} fruits.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
