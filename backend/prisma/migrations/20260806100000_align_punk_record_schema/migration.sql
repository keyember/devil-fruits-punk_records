-- Align the database with schema.prisma after the Punk Record rebuild.
-- The legacy table was mapped as devil_fruits by the previous Prisma model.

DROP TABLE IF EXISTS "devil_fruits" CASCADE;

ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3);
ALTER TABLE "Ship" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3);
ALTER TABLE "Saga" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3);
ALTER TABLE "Arc" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3);
ALTER TABLE "Chapter" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3);
ALTER TABLE "Volume" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3);
ALTER TABLE "Episode" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP(3);
