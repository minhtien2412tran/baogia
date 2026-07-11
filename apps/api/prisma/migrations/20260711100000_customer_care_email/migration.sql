-- Customer care email automation
CREATE TABLE "EmailSubscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "userId" INTEGER,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "source" TEXT NOT NULL DEFAULT 'NEWSLETTER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailCampaignLog" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "userId" INTEGER,
    "campaignKey" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL DEFAULT '',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailCampaignLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EmailSubscriber_email_key" ON "EmailSubscriber"("email");
CREATE INDEX "EmailSubscriber_status_createdAt_idx" ON "EmailSubscriber"("status", "createdAt");

CREATE UNIQUE INDEX "EmailCampaignLog_campaignKey_email_referenceId_key" ON "EmailCampaignLog"("campaignKey", "email", "referenceId");
CREATE INDEX "EmailCampaignLog_status_scheduledAt_idx" ON "EmailCampaignLog"("status", "scheduledAt");
CREATE INDEX "EmailCampaignLog_email_idx" ON "EmailCampaignLog"("email");
