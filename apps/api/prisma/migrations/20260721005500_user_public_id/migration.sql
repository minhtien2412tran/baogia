CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE "User"
  ADD COLUMN "publicId" TEXT NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");
