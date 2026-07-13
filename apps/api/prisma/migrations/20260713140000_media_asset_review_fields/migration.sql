-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "sourcePageUrl" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "wordpressMediaId" INTEGER;
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "usageContexts" JSONB;
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "focalPointX" DOUBLE PRECISION;
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "focalPointY" DOUBLE PRECISION;
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "objectPositionDesktop" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "objectPositionMobile" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN IF NOT EXISTS "approvedForStaging" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "MediaAsset_rightsStatus_approvedForStaging_idx" ON "MediaAsset"("rightsStatus", "approvedForStaging");
CREATE INDEX IF NOT EXISTS "MediaAsset_wordpressMediaId_idx" ON "MediaAsset"("wordpressMediaId");
