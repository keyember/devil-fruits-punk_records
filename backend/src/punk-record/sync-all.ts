import type { PrismaClient } from '@prisma/client';
import { OnePieceClient } from './client';
import { PrismaPunkRecordStore } from './prisma-store';
import { syncResource } from './sync';
import type { PunkRecordEntity, PunkRecordResource, SyncStats } from './types';

export const defaultSyncOrder: PunkRecordResource[] = [
  'devil-fruits',
  'characters',
  'crews',
  'islands',
  'organizations',
  'ships',
  'sagas',
  'arcs',
  'chapters',
  'volumes',
  'episodes',
];

export async function syncAll(
  prisma: PrismaClient,
  client: OnePieceClient,
  resources: PunkRecordResource[] = defaultSyncOrder,
): Promise<SyncStats[]> {
  const results: SyncStats[] = [];

  for (const resource of resources) {
    const run = await prisma.syncRun.create({ data: { resource, status: 'RUNNING' } });

    try {
      const store = new PrismaPunkRecordStore<PunkRecordEntity>(prisma, resource);
      const stats = await syncResource(client, resource, store);
      const status = stats.failed === 0 ? 'SUCCESS' : stats.created + stats.updated > 0 ? 'PARTIAL' : 'FAILED';

      await prisma.syncRun.update({
        where: { id: run.id },
        data: {
          status,
          fetched: stats.fetched,
          created: stats.created,
          updated: stats.updated,
          failed: stats.failed,
          errors: stats.errors,
          finishedAt: stats.finishedAt,
        },
      });
      results.push(stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await prisma.syncRun.update({
        where: { id: run.id },
        data: { status: 'FAILED', failed: 1, errors: [{ message }], finishedAt: new Date() },
      });
      throw error;
    }
  }

  return results;
}
