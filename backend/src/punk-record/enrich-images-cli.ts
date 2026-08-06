import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import 'dotenv/config';

type LocalFruit = {
  id: number;
  name: string;
  romanizedName: string | null;
  imageUrl: string | null;
  rawData: unknown;
};

type RemoteName = string | { en?: string; jp?: string; romaji?: string } | null;
type RemoteFruit = { name?: RemoteName; model?: RemoteName; image_url?: string | null };

const baseUrl = process.env.ONE_PIECE_IMAGE_API_URL ?? 'https://www.onepieceapi.com/api/devil-fruits';

function names(value: RemoteName): string[] {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  return [value.en, value.romaji, value.jp].filter((item): item is string => Boolean(item));
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function fetchRemoteFruits(): Promise<RemoteFruit[]> {
  const fruits: RemoteFruit[] = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${baseUrl}?page=${page}&limit=100`);
    if (!response.ok) throw new Error(`Image API returned ${response.status}`);
    const payload = await response.json() as unknown;
    const batch = Array.isArray(payload) ? payload : payload && typeof payload === 'object' && 'data' in payload && Array.isArray(payload.data) ? payload.data : [];
    fruits.push(...batch as RemoteFruit[]);
    if (batch.length < 100) return fruits;
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool as any) });

try {
  const [localFruits, remoteFruits] = await Promise.all([
    prisma.devilFruit.findMany({ where: { imageUrl: null }, select: { id: true, name: true, romanizedName: true, imageUrl: true, rawData: true } }),
    fetchRemoteFruits(),
  ]);
  let enriched = 0;

  for (const fruit of localFruits as LocalFruit[]) {
    const localNames = [fruit.name, fruit.romanizedName].filter((value): value is string => Boolean(value)).map(normalize);
    const match = remoteFruits.find((candidate) => names(candidate.name).concat(names(candidate.model)).some((value) => localNames.includes(normalize(value))));
    if (!match?.image_url) continue;

    const rawData = fruit.rawData && typeof fruit.rawData === 'object' ? fruit.rawData as Record<string, unknown> : {};
    await prisma.devilFruit.update({
      where: { id: fruit.id },
      data: {
        imageUrl: match.image_url,
        rawData: { ...rawData, imageSource: 'onepieceapi.com', imageCheckedAt: new Date().toISOString() },
      },
    });
    enriched += 1;
  }

  console.log(`Images enrichies : ${enriched}/${localFruits.length}`);
} finally {
  await prisma.$disconnect();
  await pool.end();
}
