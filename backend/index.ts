import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import pkgPg from "pg";
const { Pool } = pkgPg;
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Configuration de la connexion
const connectionString = process.env.DATABASE_URL;

// On force le type 'any' ici pour stopper la guerre entre les versions de @types/pg
const pool = new Pool({ connectionString }) as any;
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const allFruits = await prisma.devilFruit.findMany();
    res.json(allFruits);
  } catch (error) {
    console.error("Erreur Prisma:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des fruits",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Punk Records API lancée sur le port ${PORT}`);
});
