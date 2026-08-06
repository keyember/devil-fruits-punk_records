import type { PrismaClient } from '../generated/prisma/client.js';
import type { PunkRecordEntity, PunkRecordResource, SyncStore } from './types.js';

type PrismaModelDelegate = {
  findUnique(args: { where: Record<string, unknown> }): Promise<unknown | null>;
  upsert(args: { where: Record<string, unknown>; create: Record<string, unknown>; update: Record<string, unknown> }): Promise<unknown>;
};

const modelNames: Record<PunkRecordResource, string> = {
  characters: 'character',
  crews: 'crew',
  'devil-fruits': 'devilFruit',
  islands: 'island',
  organizations: 'organization',
  ships: 'ship',
  sagas: 'saga',
  arcs: 'arc',
  chapters: 'chapter',
  volumes: 'volume',
  episodes: 'episode',
};

function toDatabaseRecord(entity: PunkRecordEntity, resource: PunkRecordResource): Record<string, unknown> {
  const { id, ...payload } = entity;

  if (resource === 'devil-fruits') {
    const raw = payload as Record<string, unknown>;
    const name = typeof raw.name === 'string' ? raw.name.trim() : `Unknown ${id}`;
    const originalName = typeof raw.originalName === 'string' ? raw.originalName : null;
    const romanizedName = typeof raw.romanizedName === 'string'
      ? raw.romanizedName
      : typeof raw.roman_name === 'string'
        ? raw.roman_name
        : null;
    const imageUrl = typeof raw.imageUrl === 'string'
      ? raw.imageUrl
      : typeof raw.filename === 'string'
        ? raw.filename
        : null;
    const type = typeof raw.type === 'string' ? raw.type : null;
    const description = typeof raw.description === 'string' ? raw.description : null;
    const status = typeof raw.status === 'string' ? raw.status : null;

    return {
      externalId: Number(id),
      name,
      originalName,
      romanizedName,
      type,
      description,
      imageUrl,
      status,
      rawData: entity,
      lastSyncedAt: new Date(),
    };
  }

  const name = typeof payload.name === 'string' ? payload.name : `Unknown ${id}`;
  return {
    externalId: Number(id),
    name,
    rawData: entity,
    lastSyncedAt: new Date(),
    ...payload,
  };
}

export class PrismaPunkRecordStore<T extends PunkRecordEntity> implements SyncStore<T> {
  private readonly delegate: PrismaModelDelegate;
  private readonly resource: PunkRecordResource;

  constructor(prisma: PrismaClient, resource: PunkRecordResource) {
    const delegate = (prisma as unknown as Record<string, PrismaModelDelegate>)[modelNames[resource]];
    if (!delegate) throw new Error(`Missing Prisma delegate for resource ${resource}`);
    this.delegate = delegate;
    this.resource = resource;
  }

  async upsert(entity: T): Promise<'created' | 'updated'> {
    const data = toDatabaseRecord(entity, this.resource);
    const where = { externalId: data.externalId };
    const existing = await this.delegate.findUnique({ where });

    await this.delegate.upsert({
      where,
      create: data,
      update: data,
    });

    return existing ? 'updated' : 'created';
  }
}
