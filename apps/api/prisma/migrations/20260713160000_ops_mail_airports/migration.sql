-- AlterTable
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "canParkAircraft" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "isBaseAirport" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "parkingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "overnightFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "landingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "feeCurrency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "operationalNotes" TEXT;

-- AlterTable Operator
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "legalName" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "contactName" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE IF NOT EXISTS "OperatorUser" (
    "id" SERIAL NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERATOR_STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OperatorUser_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "OperatorUser_operatorId_userId_key" ON "OperatorUser"("operatorId", "userId");
CREATE INDEX IF NOT EXISTS "OperatorUser_userId_idx" ON "OperatorUser"("userId");

DO $$ BEGIN
  ALTER TABLE "OperatorUser" ADD CONSTRAINT "OperatorUser_operatorId_fkey"
    FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "OperatorUser" ADD CONSTRAINT "OperatorUser_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable EmailTemplate
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "textBody" TEXT,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "EmailTemplate_key_locale_key" ON "EmailTemplate"("key", "locale");
CREATE INDEX IF NOT EXISTS "EmailTemplate_key_idx" ON "EmailTemplate"("key");
