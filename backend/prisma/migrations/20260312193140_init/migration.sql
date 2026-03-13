-- CreateEnum
CREATE TYPE "FruitType" AS ENUM ('Paramecia', 'Logia', 'Zoan');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'MYTHIC');

-- CreateTable
CREATE TABLE "devil_fruits" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "translatedName" TEXT NOT NULL,
    "type" "FruitType" NOT NULL,
    "description" TEXT NOT NULL,
    "ability" TEXT NOT NULL,
    "imageUrl" TEXT,
    "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
    "user" TEXT,
    "bounty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devil_fruits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devil_fruits_originalName_key" ON "devil_fruits"("originalName");
