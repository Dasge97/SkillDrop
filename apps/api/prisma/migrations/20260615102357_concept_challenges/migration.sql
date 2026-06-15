-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'PROJECT',
    "conceptConfig" TEXT,
    "title" TEXT NOT NULL,
    "brief" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "objective" TEXT NOT NULL DEFAULT '',
    "targetUser" TEXT NOT NULL DEFAULT '',
    "restrictions" TEXT NOT NULL DEFAULT '[]',
    "deliverables" TEXT NOT NULL DEFAULT '[]',
    "checklist" TEXT NOT NULL DEFAULT '[]',
    "commonMistakes" TEXT NOT NULL DEFAULT '[]',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "timeLimitMinutes" INTEGER NOT NULL DEFAULT 45,
    "skills" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Challenge_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("brief", "checklist", "commonMistakes", "context", "createdAt", "deliverables", "difficulty", "id", "lessonId", "objective", "restrictions", "skills", "targetUser", "timeLimitMinutes", "title") SELECT "brief", "checklist", "commonMistakes", "context", "createdAt", "deliverables", "difficulty", "id", "lessonId", "objective", "restrictions", "skills", "targetUser", "timeLimitMinutes", "title" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE UNIQUE INDEX "Challenge_lessonId_key" ON "Challenge"("lessonId");
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "figmaUrl" TEXT,
    "liveUrl" TEXT,
    "code" TEXT NOT NULL DEFAULT '',
    "answer" TEXT NOT NULL DEFAULT '',
    "screenshots" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("challengeId", "code", "createdAt", "figmaUrl", "id", "liveUrl", "notes", "screenshots", "status", "updatedAt", "userId", "version") SELECT "challengeId", "code", "createdAt", "figmaUrl", "id", "liveUrl", "notes", "screenshots", "status", "updatedAt", "userId", "version" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
CREATE INDEX "Submission_userId_challengeId_idx" ON "Submission"("userId", "challengeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
