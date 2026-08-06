import type { PrismaClient } from '@prisma/client';
import { OnePieceClient } from './client';
import { syncAll } from './sync-all';
import type { SyncStats } from './types';

export interface PrioritySyncOptions {
  baseUrl?: string;
  language?: string;
  fetcher?: typeof fetch;
}

const PRIORITY_RESOURCES = ['devil-fruits', 'characters'] as const;

export function createOnePieceClient(options: PrioritySyncOptions = {}): OnePieceClient {
  const baseUrl = options.baseUrl ?? process.env.ONE_PIECE_API_URL ?? 'https://api.api-onepiece.com';
  const language = options.language ?? process.env.ONE_PIECE_API_LANGUAGE ?? 'fr';
  return new OnePieceClient({ baseUrl, language, fetcher: options.fetcher });
}

export async function syncPriorityResources(
  prisma: PrismaClient,
  options: PrioritySyncOptions = {},
): Promise<SyncStats[]> {
  const client = createOnePieceClient(options);
  return syncAll(prisma, client, [...PRIORITY_RESOURCES]);
}
