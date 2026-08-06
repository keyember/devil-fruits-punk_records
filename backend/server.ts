import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import { createDevilFruitRouter } from './src/punk-record/routes.js';

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

app.use('/api/punk-records', createDevilFruitRouter(prisma));

const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, () => {
  console.log(`🧬 PUNK RECORDS API — http://localhost:${port}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  await pool.end();
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
