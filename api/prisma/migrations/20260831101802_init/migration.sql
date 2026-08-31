-- CreateEnum
CREATE TYPE "LineStatus" AS ENUM ('online', 'offline');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lineStatus" "LineStatus" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
