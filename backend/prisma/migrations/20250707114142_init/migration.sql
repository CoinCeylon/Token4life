/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `type` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `utxos` on the `Donor` table. All the data in the column will be lost.
  - Added the required column `name` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Admin";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DonationTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "utxos" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DonationTransaction_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Donor" ("createdAt", "id", "phone", "privateKey", "walletAddress") SELECT "createdAt", "id", "phone", "privateKey", "walletAddress" FROM "Donor";
DROP TABLE "Donor";
ALTER TABLE "new_Donor" RENAME TO "Donor";
CREATE UNIQUE INDEX "Donor_phone_key" ON "Donor"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
