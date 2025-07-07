-- CreateTable
CREATE TABLE "Donor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "mnemonic" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 4,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "mnemonic" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Donor_phone_key" ON "Donor"("phone");
