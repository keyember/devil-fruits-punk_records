import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import 'dotenv/config';
import { OnePieceClient } from './client.js';
import { syncAll } from './sync-all.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool as any) });
const client = new OnePieceClient({
  baseUrl: process.env.ONE_PIECE_API_URL ?? 'https://api.api-onepiece.com',
  language: process.env.ONE_PIECE_API_LANGUAGE ?? 'fr',
});

try {
  const results = await syncAll(prisma, client, ['devil-fruits']);
  console.table(results.map(({ resource, fetched, created, updated, failed }) => ({ resource, fetched, created, updated, failed })));
} catch (error) {
  console.error('Punk Records synchronization failed', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
  await pool.end();
}
