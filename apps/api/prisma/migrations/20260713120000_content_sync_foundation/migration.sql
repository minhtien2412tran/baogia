-- Content sync / rights / site settings (additive)

CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "locale" TEXT,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key");
CREATE INDEX IF NOT EXISTS "SiteSetting_locale_idx" ON "SiteSetting"("locale");

CREATE TABLE IF NOT EXISTS "ContentSource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "authType" TEXT NOT NULL DEFAULT 'NONE',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "syncMode" TEXT NOT NULL DEFAULT 'SAFE_REFERENCE_MODE',
    "defaultLocale" TEXT NOT NULL DEFAULT 'en',
    "allowedDomains" JSONB NOT NULL,
    "rateLimitPerMin" INTEGER NOT NULL DEFAULT 30,
    "lastTestAt" TIMESTAMP(3),
    "lastTestOk" BOOLEAN,
    "lastError" TEXT,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContentSource_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentSource_syncMode_isEnabled_idx" ON "ContentSource"("syncMode", "isEnabled");

CREATE TABLE IF NOT EXISTS "ContentSourceRecord" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "externalId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "canonicalUrl" TEXT,
    "contentType" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT,
    "rawMetadata" JSONB,
    "publishedAt" TIMESTAMP(3),
    "modifiedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentHash" TEXT,
    "etag" TEXT,
    "lastModifiedHeader" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISCOVERED',
    CONSTRAINT "ContentSourceRecord_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ContentSourceRecord_sourceId_externalId_locale_key" ON "ContentSourceRecord"("sourceId", "externalId", "locale");
CREATE INDEX IF NOT EXISTS "ContentSourceRecord_status_idx" ON "ContentSourceRecord"("status");
CREATE INDEX IF NOT EXISTS "ContentSourceRecord_contentType_idx" ON "ContentSourceRecord"("contentType");

CREATE TABLE IF NOT EXISTS "ContentProvenance" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "sourceId" INTEGER,
    "sourceUrl" TEXT,
    "externalId" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importJobId" INTEGER,
    "transformationMode" TEXT NOT NULL,
    "rightsStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "rightsEvidence" TEXT,
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    CONSTRAINT "ContentProvenance_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentProvenance_entityType_entityId_idx" ON "ContentProvenance"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "ContentProvenance_rightsStatus_idx" ON "ContentProvenance"("rightsStatus");

CREATE TABLE IF NOT EXISTS "ContentRights" (
    "id" SERIAL NOT NULL,
    "assetType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "storageKey" TEXT,
    "rightsStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "rightsOwner" TEXT,
    "licenseType" TEXT,
    "licenseDocument" TEXT,
    "licenseStartAt" TIMESTAMP(3),
    "licenseEndAt" TIMESTAMP(3),
    "usageScope" TEXT,
    "notes" TEXT,
    "approvedForPublish" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ContentRights_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentRights_rightsStatus_approvedForPublish_idx" ON "ContentRights"("rightsStatus", "approvedForPublish");
CREATE INDEX IF NOT EXISTS "ContentRights_storageKey_idx" ON "ContentRights"("storageKey");

CREATE TABLE IF NOT EXISTS "ContentSyncJob" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "fetchedCount" INTEGER NOT NULL DEFAULT 0,
    "newCount" INTEGER NOT NULL DEFAULT 0,
    "changedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "blockedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "dryRun" BOOLEAN NOT NULL DEFAULT true,
    "triggeredBy" INTEGER,
    "errorSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentSyncJob_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentSyncJob_sourceId_createdAt_idx" ON "ContentSyncJob"("sourceId", "createdAt");
CREATE INDEX IF NOT EXISTS "ContentSyncJob_status_idx" ON "ContentSyncJob"("status");

CREATE TABLE IF NOT EXISTS "ContentSyncItem" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "externalId" TEXT,
    "targetEntityType" TEXT,
    "targetEntityId" TEXT,
    "action" TEXT NOT NULL,
    "beforeData" JSONB,
    "proposedData" JSONB,
    "diff" JSONB,
    "rightsStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "reviewStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentSyncItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentSyncItem_jobId_reviewStatus_idx" ON "ContentSyncItem"("jobId", "reviewStatus");
CREATE INDEX IF NOT EXISTS "ContentSyncItem_rightsStatus_idx" ON "ContentSyncItem"("rightsStatus");

CREATE TABLE IF NOT EXISTS "ContentVersion" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "sourceJobId" INTEGER,
    CONSTRAINT "ContentVersion_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ContentVersion_entityType_entityId_version_key" ON "ContentVersion"("entityType", "entityId", "version");
CREATE INDEX IF NOT EXISTS "ContentVersion_entityType_entityId_idx" ON "ContentVersion"("entityType", "entityId");

CREATE TABLE IF NOT EXISTS "MediaAsset" (
    "id" SERIAL NOT NULL,
    "originalFilename" TEXT,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fileSize" INTEGER,
    "checksum" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'UPLOAD',
    "sourceUrl" TEXT,
    "rightsStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "rightsEvidence" TEXT,
    "altText" TEXT,
    "locale" TEXT,
    "approvedForPublish" BOOLEAN NOT NULL DEFAULT false,
    "uploadedBy" INTEGER,
    "reviewedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");
CREATE INDEX IF NOT EXISTS "MediaAsset_rightsStatus_approvedForPublish_idx" ON "MediaAsset"("rightsStatus", "approvedForPublish");

DO $$ BEGIN
  ALTER TABLE "ContentSourceRecord" ADD CONSTRAINT "ContentSourceRecord_sourceId_fkey"
    FOREIGN KEY ("sourceId") REFERENCES "ContentSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ContentSyncJob" ADD CONSTRAINT "ContentSyncJob_sourceId_fkey"
    FOREIGN KEY ("sourceId") REFERENCES "ContentSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ContentSyncItem" ADD CONSTRAINT "ContentSyncItem_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "ContentSyncJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
