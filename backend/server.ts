import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

app.get("/api/fruits", async (req, res) => {
  const fruits = await prisma.devilFruit.findMany({
    orderBy: { originalName: "asc" },
  });
  res.json(fruits);
});

app.listen(3000, () => {
  console.log("🧬 PUNK RECORDS API — http://localhost:3000");
});
