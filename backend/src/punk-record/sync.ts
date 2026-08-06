import type { PunkRecordEntity, PunkRecordResource, SyncStats, SyncStore } from './types';
import { OnePieceClient } from './client';

export async function syncResource<T extends PunkRecordEntity>(
  client: OnePieceClient,
  resource: PunkRecordResource,
  store: SyncStore<T>,
): Promise<SyncStats> {
  const startedAt = new Date().toISOString();
  const stats: SyncStats = { resource, fetched: 0, created: 0, updated: 0, failed: 0, startedAt, errors: [] };
  const entities = await client.list<T>(resource);
  stats.fetched = entities.length;

  for (const entity of entities) {
    try {
      const result = await store.upsert(entity);
      stats[result] += 1;
    } catch (error) {
      stats.failed += 1;
      stats.errors.push({ id: entity.id, message: error instanceof Error ? error.message : String(error) });
    }
  }

  stats.finishedAt = new Date().toISOString();
  return stats;
}
