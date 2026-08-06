import type { PrismaClient } from '@prisma/client';

export type PunkRecordListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

export type PunkRecordPage<T> = {
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
  return Number.isInteger(value) && (value as number) > 0 ? (value as number) : fallback;
}

export function normalizePunkRecordQuery(query: PunkRecordListQuery) {
  return {
    page: positiveInteger(query.page, DEFAULT_PAGE),
    limit: Math.min(positiveInteger(query.limit, DEFAULT_LIMIT), MAX_LIMIT),
    search: query.search?.trim() || undefined,
    category: query.category?.trim() || undefined,
  };
}

export async function listPunkRecords(
  prisma: PrismaClient,
  query: PunkRecordListQuery = {},
): Promise<PunkRecordPage<unknown>> {
  const normalized = normalizePunkRecordQuery(query);
  const skip = (normalized.page - 1) * normalized.limit;
  const model = (prisma as unknown as { punkRecord: {
    findMany(args: unknown): Promise<unknown[]>;
    count(args: unknown): Promise<number>;
  } }).punkRecord;

  const where: Record<string, unknown> = {};
  if (normalized.search) where.name = { contains: normalized.search, mode: 'insensitive' };
  if (normalized.category) where.category = normalized.category;

  const [data, total] = await Promise.all([
    model.findMany({ where, skip, take: normalized.limit, orderBy: { name: 'asc' } }),
    model.count({ where }),
  ]);

  return { data, page: normalized.page, limit: normalized.limit, total, totalPages: Math.ceil(total / normalized.limit) };
}

export async function getPunkRecordById(prisma: PrismaClient, id: string): Promise<unknown | null> {
  const model = (prisma as unknown as { punkRecord: { findUnique(args: unknown): Promise<unknown | null> } }).punkRecord;
  return model.findUnique({ where: { id } });
}
