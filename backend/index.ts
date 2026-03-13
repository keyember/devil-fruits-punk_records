import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
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
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des fruits" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Punk Records API lancée sur http://0.0.0.0:${PORT}`);
});
