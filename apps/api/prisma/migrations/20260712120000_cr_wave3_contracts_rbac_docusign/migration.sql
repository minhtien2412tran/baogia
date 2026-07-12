-- CR Wave 3–5: OperatorContract, DocuSign, RBAC / airport scope

CREATE TABLE "ContractTemplate" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContractTemplate_code_key" ON "ContractTemplate"("code");

CREATE TABLE "OperatorContract" (
    "id" SERIAL NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "bookingId" INTEGER,
    "templateId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" INTEGER NOT NULL,
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatorContract_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OperatorContract_aircraftId_status_idx" ON "OperatorContract"("aircraftId", "status");
CREATE INDEX "OperatorContract_status_idx" ON "OperatorContract"("status");

CREATE TABLE "DocuSignEnvelope" (
    "id" SERIAL NOT NULL,
    "operatorContractId" INTEGER NOT NULL,
    "externalEnvelopeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "recipients" JSONB,
    "sentAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "voidedAt" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "rawLastEvent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocuSignEnvelope_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DocuSignEnvelope_externalEnvelopeId_key" ON "DocuSignEnvelope"("externalEnvelopeId");
CREATE INDEX "DocuSignEnvelope_operatorContractId_idx" ON "DocuSignEnvelope"("operatorContractId");

CREATE TABLE "DocuSignWebhookEvent" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "envelopeId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocuSignWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DocuSignWebhookEvent_eventId_key" ON "DocuSignWebhookEvent"("eventId");
CREATE INDEX "DocuSignWebhookEvent_envelopeId_idx" ON "DocuSignWebhookEvent"("envelopeId");

CREATE TABLE "UserPermissionOverride" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPermissionOverride_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserPermissionOverride_userId_permissionKey_key" ON "UserPermissionOverride"("userId", "permissionKey");
CREATE INDEX "UserPermissionOverride_userId_idx" ON "UserPermissionOverride"("userId");

CREATE TABLE "UserAirportScope" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "scopeType" TEXT NOT NULL DEFAULT 'ALL',
    "continentCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "countryCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "airportIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAirportScope_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserAirportScope_userId_key" ON "UserAirportScope"("userId");

ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContractTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DocuSignEnvelope" ADD CONSTRAINT "DocuSignEnvelope_operatorContractId_fkey" FOREIGN KEY ("operatorContractId") REFERENCES "OperatorContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserPermissionOverride" ADD CONSTRAINT "UserPermissionOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAirportScope" ADD CONSTRAINT "UserAirportScope_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
