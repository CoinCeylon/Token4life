/*
  Warnings:

  - You are about to drop the column `mnemonic` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Donor` table. All the data in the column will be lost.
  - Added the required column `privateKey` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "utxos" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Donor" ("createdAt", "id", "phone", "walletAddress") SELECT "createdAt", "id", "phone", "walletAddress" FROM "Donor";
DROP TABLE "Donor";
ALTER TABLE "new_Donor" RENAME TO "Donor";
CREATE UNIQUE INDEX "Donor_phone_key" ON "Donor"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
