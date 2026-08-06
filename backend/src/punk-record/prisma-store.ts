import type { PrismaClient } from "../generated/prisma/client.js";
import type { PunkRecordEntity, PunkRecordResource, SyncStore } from "./types";

type PrismaModelDelegate = {
  findUnique(args: { where: Record<string, unknown> }): Promise<unknown>;
  upsert(args: {
    where: Record<string, unknown>;
    create: Record<string, unknown>;
    update: Record<string, unknown>;
  }): Promise<unknown>;
};

const modelNames: Record<PunkRecordResource, string> = {
  characters: "character",
  crews: "crew",
  "devil-fruits": "devilFruit",
  islands: "island",
  organizations: "organization",
  ships: "ship",
  sagas: "saga",
  arcs: "arc",
  chapters: "chapter",
  volumes: "volume",
  episodes: "episode",
};

function toDatabaseRecord(entity: PunkRecordEntity): Record<string, unknown> {
  const { id, ...payload } = entity;
  const name =
    typeof payload.name === "string" ? payload.name : `Unknown ${id}`;
  return {
    externalId: Number(id),
    name,
    rawData: entity,
    lastSyncedAt: new Date(),
    ...payload,
  };
}

export class PrismaPunkRecordStore<
  T extends PunkRecordEntity,
> implements SyncStore<T> {
  private readonly delegate: PrismaModelDelegate;

  constructor(prisma: PrismaClient, resource: PunkRecordResource) {
    const delegate = (prisma as unknown as Record<string, PrismaModelDelegate>)[
      modelNames[resource]
    ];
    if (!delegate)
      throw new Error(`Missing Prisma delegate for resource ${resource}`);
    this.delegate = delegate;
  }

  async upsert(entity: T): Promise<"created" | "updated"> {
    const data = toDatabaseRecord(entity);
    const existing = await this.delegate.findUnique({
      where: { externalId: data.externalId },
    });
    await this.delegate.upsert({
      where: { externalId: data.externalId },
      create: data,
      update: data,
    });
    return existing ? "updated" : "created";
  }
}
