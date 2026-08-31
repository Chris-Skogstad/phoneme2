/*
  Warnings:

  - You are about to drop the column `lineStatus` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lineStatus",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "LineStatus";

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "phonemes" TEXT[],
    "hint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordSearch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "gridSize" INTEGER NOT NULL,
    "outputSettings" JSONB,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wordle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "outputSettings" JSONB,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wordle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WordSearchWords" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WordSearchWords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WordleWords" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WordleWords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_text_locale_key" ON "Word"("text", "locale");

-- CreateIndex
CREATE INDEX "_WordSearchWords_B_index" ON "_WordSearchWords"("B");

-- CreateIndex
CREATE INDEX "_WordleWords_B_index" ON "_WordleWords"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "WordSearch" ADD CONSTRAINT "WordSearch_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wordle" ADD CONSTRAINT "Wordle_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordSearchWords" ADD CONSTRAINT "_WordSearchWords_A_fkey" FOREIGN KEY ("A") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordSearchWords" ADD CONSTRAINT "_WordSearchWords_B_fkey" FOREIGN KEY ("B") REFERENCES "WordSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordleWords" ADD CONSTRAINT "_WordleWords_A_fkey" FOREIGN KEY ("A") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordleWords" ADD CONSTRAINT "_WordleWords_B_fkey" FOREIGN KEY ("B") REFERENCES "Wordle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
