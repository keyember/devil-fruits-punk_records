import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

// Prisma 7 lira automatiquement ton fichier prisma.config.ts
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Route pour récupérer tes fruits
app.get("/", async (req, res) => {
  try {
    const allFruits = await prisma.devilFruit.findMany();
    res.json(allFruits);
  } catch (error) {
    console.error(error); // Utile pour voir l'erreur exacte dans les logs Dokploy
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des fruits" });
  }
});

// Important : le "0.0.0.0" permet à Dokploy d'exposer le service correctement
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Punk Records API lancée sur le port ${PORT}`);
});
