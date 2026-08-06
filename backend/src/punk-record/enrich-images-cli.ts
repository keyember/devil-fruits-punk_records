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
type FandomPage = { thumbnail?: { source?: string } };

type FandomResponse = { query?: { pages?: Record<string, FandomPage> } };

const onePieceApiUrl = process.env.ONE_PIECE_IMAGE_API_URL ?? 'https://www.onepieceapi.com/api/devil-fruits';
const fandomApiUrl = process.env.FANDOM_IMAGE_API_URL ?? 'https://onepiece.fandom.com/api.php';

function names(value: RemoteName): string[] {
  if (!value) return [];
  if (typeof value === 'string') return [value];
  return [value.en, value.romaji, value.jp].filter((item): item is string => Boolean(item));
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchRemoteFruits(): Promise<RemoteFruit[]> {
  const fruits: RemoteFruit[] = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${onePieceApiUrl}?page=${page}&limit=100`);
    if (!response.ok) throw new Error(`OnePieceAPI returned ${response.status}`);
    const payload = await response.json() as unknown;
    const batch = Array.isArray(payload) ? payload : payload && typeof payload === 'object' && 'data' in payload && Array.isArray(payload.data) ? payload.data : [];
    fruits.push(...batch as RemoteFruit[]);
    if (batch.length < 100) return fruits;
  }
}

async function fetchFandomImage(fruit: LocalFruit): Promise<string | null> {
  const searchTerms = [fruit.romanizedName, fruit.name].filter((value): value is string => Boolean(value));
  for (const searchTerm of searchTerms) {
    const url = new URL(fandomApiUrl);
    url.search = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: `${searchTerm} Devil Fruit`, gsrlimit: '5', prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '1000', format: 'json', formatversion: '2', origin: '*' }).toString();
    const response = await fetch(url);
    if (!response.ok) continue;
    const payload = await response.json() as FandomResponse;
    const pages = Object.values(payload.query?.pages ?? {});
    const image = pages.find((page) => page.thumbnail?.source)?.thumbnail?.source;
    if (image) return image;
  }
  return null;
}

async function isImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/') === true;
  } catch {
    return false;
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
    const apiMatch = remoteFruits.find((candidate) => names(candidate.name).concat(names(candidate.model)).some((value) => localNames.includes(normalize(value))));
    let imageUrl = apiMatch?.image_url ?? null;
    let imageSource = imageUrl ? 'onepieceapi.com' : null;

    if (!imageUrl) {
      imageUrl = await fetchFandomImage(fruit);
      imageSource = imageUrl ? 'onepiece.fandom.com' : null;
      await sleep(300);
    }
    if (!imageUrl || !(await isImageUrl(imageUrl))) continue;

    const rawData = fruit.rawData && typeof fruit.rawData === 'object' ? fruit.rawData as Record<string, unknown> : {};
    await prisma.devilFruit.update({
      where: { id: fruit.id },
      data: {
        imageUrl,
        rawData: { ...rawData, imageSource, imageCheckedAt: new Date().toISOString() },
      },
    });
    enriched += 1;
  }

  console.log(`Images enrichies : ${enriched}/${localFruits.length}`);
} finally {
  await prisma.$disconnect();
  await pool.end();
}
