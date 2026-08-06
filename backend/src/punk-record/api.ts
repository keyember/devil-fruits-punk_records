import type { PrismaClient } from "../generated/prisma/client.js";
export type DevilFruitListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
};

export type DevilFruitPage<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

function positiveInteger(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && (value as number) > 0
    ? (value as number)
    : fallback;
}

export function normalizeDevilFruitQuery(query: DevilFruitListQuery) {
  return {
    page: positiveInteger(query.page, DEFAULT_PAGE),
    limit: Math.min(positiveInteger(query.limit, DEFAULT_LIMIT), MAX_LIMIT),
    search: query.search?.trim() || undefined,
    type: query.type?.trim() || undefined,
  };
}

export async function listDevilFruits(
  prisma: PrismaClient,
  query: DevilFruitListQuery = {},
): Promise<DevilFruitPage<unknown>> {
  const normalized = normalizeDevilFruitQuery(query);
  const skip = (normalized.page - 1) * normalized.limit;
  const model = prisma.devilFruit;
  const where = {
    ...(normalized.search
      ? { name: { contains: normalized.search, mode: "insensitive" as const } }
      : {}),
    ...(normalized.type ? { type: normalized.type } : {}),
  };

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: normalized.limit,
      orderBy: { name: "asc" },
    }),
    model.count({ where }),
  ]);

  return {
    data,
    page: normalized.page,
    limit: normalized.limit,
    total,
    totalPages: Math.ceil(total / normalized.limit),
  };
}

export function getDevilFruitByExternalId(
  prisma: PrismaClient,
  externalId: number,
) {
  return prisma.devilFruit.findUnique({ where: { externalId } });
}
