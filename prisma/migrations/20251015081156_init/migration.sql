-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "eventDescription" TEXT NOT NULL,
    "marketSlug" TEXT NOT NULL,
    "fundingWallet" TEXT,
    "marketEndTime" DATETIME,
    "tweetSearchPhrase" TEXT NOT NULL,
    "yesTokenMint" TEXT NOT NULL,
    "noTokenMint" TEXT NOT NULL,
    "pmxLink" TEXT,
    "jupiterLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Video_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConspiraInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "imgSrc" TEXT,
    "date" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConspiraInfo_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Market_marketSlug_key" ON "Market"("marketSlug");
