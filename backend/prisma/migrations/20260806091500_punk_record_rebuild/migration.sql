-- Punk Record rebuild migration.
-- Destructive by design: this branch intentionally replaces the legacy data model.

DROP TABLE IF EXISTS "CharacterEpisode" CASCADE;
DROP TABLE IF EXISTS "CharacterArc" CASCADE;
DROP TABLE IF EXISTS "CharacterIsland" CASCADE;
DROP TABLE IF EXISTS "CharacterShip" CASCADE;
DROP TABLE IF EXISTS "CharacterOrganization" CASCADE;
DROP TABLE IF EXISTS "CharacterCrew" CASCADE;
DROP TABLE IF EXISTS "CharacterFruit" CASCADE;
DROP TABLE IF EXISTS "CrewShip" CASCADE;
DROP TABLE IF EXISTS "SyncRun" CASCADE;
DROP TABLE IF EXISTS "Episode" CASCADE;
DROP TABLE IF EXISTS "Chapter" CASCADE;
DROP TABLE IF EXISTS "Volume" CASCADE;
DROP TABLE IF EXISTS "Arc" CASCADE;
DROP TABLE IF EXISTS "Saga" CASCADE;
DROP TABLE IF EXISTS "Ship" CASCADE;
DROP TABLE IF EXISTS "Organization" CASCADE;
DROP TABLE IF EXISTS "Island" CASCADE;
DROP TABLE IF EXISTS "Crew" CASCADE;
DROP TABLE IF EXISTS "DevilFruit" CASCADE;
DROP TABLE IF EXISTS "Character" CASCADE;
DROP TYPE IF EXISTS "SyncStatus";

CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'PARTIAL', 'FAILED');

CREATE TABLE "Character" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "romanizedName" TEXT,
  "nickname" TEXT,
  "description" TEXT,
  "imageUrl" TEXT,
  "bounty" BIGINT,
  "height" TEXT,
  "birthday" TEXT,
  "status" TEXT,
  "rawData" JSONB,
  "lastSyncedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Character_externalId_key" ON "Character"("externalId");

CREATE TABLE "DevilFruit" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "originalName" TEXT,
  "romanizedName" TEXT,
  "type" TEXT,
  "description" TEXT,
  "imageUrl" TEXT,
  "status" TEXT,
  "rawData" JSONB,
  "lastSyncedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DevilFruit_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DevilFruit_externalId_key" ON "DevilFruit"("externalId");

CREATE TABLE "Crew" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "status" TEXT,
  "rawData" JSONB,
  "lastSyncedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Crew_externalId_key" ON "Crew"("externalId");

CREATE TABLE "Island" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "sea" TEXT,
  "rawData" JSONB,
  "lastSyncedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Island_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Island_externalId_key" ON "Island"("externalId");

CREATE TABLE "Organization" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "rawData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Organization_externalId_key" ON "Organization"("externalId");

CREATE TABLE "Ship" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "rawData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Ship_externalId_key" ON "Ship"("externalId");

CREATE TABLE "Saga" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "order" INTEGER,
  "rawData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Saga_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Saga_externalId_key" ON "Saga"("externalId");

CREATE TABLE "Arc" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "sagaId" INTEGER,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT,
  "order" INTEGER,
  "rawData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Arc_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Arc_externalId_key" ON "Arc"("externalId");

CREATE TABLE "Chapter" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "arcId" INTEGER,
  "name" TEXT,
  "number" INTEGER,
  "releaseDate" TIMESTAMP(3),
  "rawData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Chapter_externalId_key" ON "Chapter"("externalId");

CREATE TABLE "Volume" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "name" TEXT,
  "number" INTEGER,
  "description" TEXT,
  "imageUrl" TEXT,
  "releaseDate" TIMESTAMP(3),
  "rawData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Volume_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Volume_externalId_key" ON "Volume"("externalId");

CREATE TABLE "Episode" (
  "id" SERIAL NOT NULL,
  "externalId" INTEGER NOT NULL,
  "arcId" INTEGER,
  "name" TEXT,
  "number" INTEGER,
  "description" TEXT,
  "imageUrl" TEXT,
  "releaseDate" TIMESTAMP(3),
  "rawData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Episode_externalId_key" ON "Episode"("externalId");

CREATE TABLE "SyncRun" (
  "id" SERIAL NOT NULL,
  "resource" TEXT NOT NULL,
  "status" "SyncStatus" NOT NULL DEFAULT 'RUNNING',
  "fetched" INTEGER NOT NULL DEFAULT 0,
  "created" INTEGER NOT NULL DEFAULT 0,
  "updated" INTEGER NOT NULL DEFAULT 0,
  "failed" INTEGER NOT NULL DEFAULT 0,
  "errors" JSONB,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  CONSTRAINT "SyncRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CharacterFruit" ("characterId" INTEGER NOT NULL, "fruitId" INTEGER NOT NULL, "role" TEXT, CONSTRAINT "CharacterFruit_pkey" PRIMARY KEY ("characterId", "fruitId"));
CREATE TABLE "CharacterCrew" ("characterId" INTEGER NOT NULL, "crewId" INTEGER NOT NULL, "role" TEXT, CONSTRAINT "CharacterCrew_pkey" PRIMARY KEY ("characterId", "crewId"));
CREATE TABLE "CharacterOrganization" ("characterId" INTEGER NOT NULL, "organizationId" INTEGER NOT NULL, "role" TEXT, CONSTRAINT "CharacterOrganization_pkey" PRIMARY KEY ("characterId", "organizationId"));
CREATE TABLE "CharacterShip" ("characterId" INTEGER NOT NULL, "shipId" INTEGER NOT NULL, "role" TEXT, CONSTRAINT "CharacterShip_pkey" PRIMARY KEY ("characterId", "shipId"));
CREATE TABLE "CharacterIsland" ("characterId" INTEGER NOT NULL, "islandId" INTEGER NOT NULL, "relation" TEXT, CONSTRAINT "CharacterIsland_pkey" PRIMARY KEY ("characterId", "islandId"));
CREATE TABLE "CharacterArc" ("characterId" INTEGER NOT NULL, "arcId" INTEGER NOT NULL, CONSTRAINT "CharacterArc_pkey" PRIMARY KEY ("characterId", "arcId"));
CREATE TABLE "CharacterEpisode" ("characterId" INTEGER NOT NULL, "episodeId" INTEGER NOT NULL, CONSTRAINT "CharacterEpisode_pkey" PRIMARY KEY ("characterId", "episodeId"));
CREATE TABLE "CrewShip" ("crewId" INTEGER NOT NULL, "shipId" INTEGER NOT NULL, "role" TEXT, CONSTRAINT "CrewShip_pkey" PRIMARY KEY ("crewId", "shipId"));

ALTER TABLE "Arc" ADD CONSTRAINT "Arc_sagaId_fkey" FOREIGN KEY ("sagaId") REFERENCES "Saga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "Arc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "Arc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CharacterFruit" ADD CONSTRAINT "CharacterFruit_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterFruit" ADD CONSTRAINT "CharacterFruit_fruitId_fkey" FOREIGN KEY ("fruitId") REFERENCES "DevilFruit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterCrew" ADD CONSTRAINT "CharacterCrew_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterCrew" ADD CONSTRAINT "CharacterCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterOrganization" ADD CONSTRAINT "CharacterOrganization_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterOrganization" ADD CONSTRAINT "CharacterOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterShip" ADD CONSTRAINT "CharacterShip_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterShip" ADD CONSTRAINT "CharacterShip_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterIsland" ADD CONSTRAINT "CharacterIsland_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterIsland" ADD CONSTRAINT "CharacterIsland_islandId_fkey" FOREIGN KEY ("islandId") REFERENCES "Island"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterArc" ADD CONSTRAINT "CharacterArc_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterArc" ADD CONSTRAINT "CharacterArc_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "Arc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterEpisode" ADD CONSTRAINT "CharacterEpisode_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CharacterEpisode" ADD CONSTRAINT "CharacterEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CrewShip" ADD CONSTRAINT "CrewShip_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;
