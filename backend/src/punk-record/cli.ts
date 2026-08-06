import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { syncPriorityResources } from './priority-sync';

async function main(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const stats = await syncPriorityResources(prisma);

    for (const result of stats) {
      console.log(
        `[punk-record] ${result.resource}: fetched=${result.fetched} created=${result.created} updated=${result.updated} failed=${result.failed}`,
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('[punk-record] priority sync failed', error);
  process.exitCode = 1;
});
