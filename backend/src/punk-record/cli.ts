import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { syncPriorityResources } from './priority-sync';

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to run the priority sync');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const stats = await syncPriorityResources(prisma);

    for (const result of stats) {
      console.log(
        `[punk-record] ${result.resource}: fetched=${result.fetched} created=${result.created} updated=${result.updated} failed=${result.failed}`,
      );
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('[punk-record] priority sync failed', error);
  process.exitCode = 1;
});
