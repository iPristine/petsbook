-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pet" ("age", "createdAt", "gender", "id", "name", "type", "updatedAt") SELECT "age", "createdAt", "gender", "id", "name", "type", "updatedAt" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
