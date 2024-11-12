/*
  Warnings:

  - Added the required column `gender` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "age" INTEGER DEFAULT 0,
    "gender" TEXT NOT NULL DEFAULT 'male',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pet" ("age", "createdAt", "id", "name", "type", "updatedAt") 
SELECT 
    COALESCE("age", 0) as "age", 
    "createdAt", 
    "id", 
    "name", 
    "type", 
    "updatedAt" 
FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
