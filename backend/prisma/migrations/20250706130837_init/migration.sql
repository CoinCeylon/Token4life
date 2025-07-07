-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletAddress" TEXT NOT NULL,
    "mnemonic" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Admin" ("createdAt", "id", "mnemonic", "walletAddress") SELECT "createdAt", "id", "mnemonic", "walletAddress" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
