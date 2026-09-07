-- DropForeignKey
ALTER TABLE "WordSearch" DROP CONSTRAINT "WordSearch_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Wordle" DROP CONSTRAINT "Wordle_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "WordSearch" ADD CONSTRAINT "WordSearch_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wordle" ADD CONSTRAINT "Wordle_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
