-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "figmaUrl" TEXT,
    "liveUrl" TEXT,
    "code" TEXT NOT NULL DEFAULT '',
    "screenshots" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("challengeId", "createdAt", "figmaUrl", "id", "notes", "screenshots", "status", "updatedAt", "userId", "version") SELECT "challengeId", "createdAt", "figmaUrl", "id", "notes", "screenshots", "status", "updatedAt", "userId", "version" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE INDEX "Submission_userId_challengeId_idx" ON "Submission"("userId", "challengeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
