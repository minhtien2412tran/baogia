-- JetBay Ops Platform: Aircraft, FlightLeg, Pricing, RBAC, Contracts (additive)

-- Airport extensions
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "countryCode" TEXT;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "countryName" TEXT;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "continentCode" TEXT;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "continentName" TEXT;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(10,7);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(10,7);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "canParkAircraft" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "landingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "parkingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "overnightFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "handlingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "feeCurrency" TEXT DEFAULT 'USD';
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "feeUpdatedAt" TIMESTAMP(3);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "operationalNotes" TEXT;

CREATE INDEX IF NOT EXISTS "Airport_continentCode_idx" ON "Airport"("continentCode");
CREATE INDEX IF NOT EXISTS "Airport_countryCode_idx" ON "Airport"("countryCode");
CREATE INDEX IF NOT EXISTS "Airport_status_idx" ON "Airport"("status");

-- Operator extensions
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "legalName" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "registrationNumber" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "contactName" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "paymentTerms" TEXT;
ALTER TABLE "Operator" ADD COLUMN IF NOT EXISTS "cancellationPolicy" TEXT;

-- Aircraft instance
CREATE TABLE IF NOT EXISTS "Aircraft" (
    "id" SERIAL NOT NULL,
    "registration" TEXT NOT NULL,
    "aircraftModelId" INTEGER NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "baseAirportId" INTEGER,
    "currentAirportId" INTEGER,
    "availabilityStatus" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "operationalStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "availableFrom" TIMESTAMP(3),
    "hourlyRate" DECIMAL(12,2),
    "hourlyRateCurrency" TEXT NOT NULL DEFAULT 'USD',
    "minimumBillableHours" DECIMAL(4,2) NOT NULL DEFAULT 1.0,
    "locationUpdatedAt" TIMESTAMP(3),
    "locationUpdatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Aircraft_registration_key" ON "Aircraft"("registration");
CREATE INDEX IF NOT EXISTS "Aircraft_currentAirportId_idx" ON "Aircraft"("currentAirportId");
CREATE INDEX IF NOT EXISTS "Aircraft_availabilityStatus_idx" ON "Aircraft"("availabilityStatus");
CREATE INDEX IF NOT EXISTS "Aircraft_operatorId_idx" ON "Aircraft"("operatorId");

DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_aircraftModelId_fkey" FOREIGN KEY ("aircraftModelId") REFERENCES "AircraftModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_baseAirportId_fkey" FOREIGN KEY ("baseAirportId") REFERENCES "Airport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_currentAirportId_fkey" FOREIGN KEY ("currentAirportId") REFERENCES "Airport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "AircraftLocationHistory" (
    "id" SERIAL NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "fromAirportId" INTEGER,
    "toAirportId" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "updatedByUserId" INTEGER,
    "metadata" JSONB,
    CONSTRAINT "AircraftLocationHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AircraftLocationHistory_aircraftId_changedAt_idx" ON "AircraftLocationHistory"("aircraftId", "changedAt");
DO $$ BEGIN
  ALTER TABLE "AircraftLocationHistory" ADD CONSTRAINT "AircraftLocationHistory_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "AircraftLocationHistory" ADD CONSTRAINT "AircraftLocationHistory_fromAirportId_fkey" FOREIGN KEY ("fromAirportId") REFERENCES "Airport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "AircraftLocationHistory" ADD CONSTRAINT "AircraftLocationHistory_toAirportId_fkey" FOREIGN KEY ("toAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "AircraftLocationHistory" ADD CONSTRAINT "AircraftLocationHistory_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Booking extensions
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "aircraftId" INTEGER;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bookingCode" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "customerRouteSummary" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "estimatedPriceTotal" DECIMAL(12,2);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "estimatedPriceCurrency" TEXT DEFAULT 'USD';
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cancelReason" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cancelNote" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cancellationFee" DECIMAL(12,2);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "cancelledByUserId" INTEGER;
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_bookingCode_key" ON "Booking"("bookingCode");
DO $$ BEGIN
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "BookingFlightLeg" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "aircraftId" INTEGER,
    "fromAirportId" INTEGER NOT NULL,
    "toAirportId" INTEGER NOT NULL,
    "legType" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "departureAt" TIMESTAMP(3),
    "arrivalAt" TIMESTAMP(3),
    "estimatedFlightMinutes" INTEGER,
    "estimatedDistanceKm" DECIMAL(10,2),
    "hasPassengers" BOOLEAN NOT NULL DEFAULT false,
    "passengerCount" INTEGER NOT NULL DEFAULT 0,
    "hourlyRateSnapshot" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "estimatedBaseCost" DECIMAL(12,2),
    "airportFees" DECIMAL(12,2),
    "handlingFees" DECIMAL(12,2),
    "parkingFees" DECIMAL(12,2),
    "crewFees" DECIMAL(12,2),
    "otherFees" DECIMAL(12,2),
    "estimatedTotalCost" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookingFlightLeg_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "BookingFlightLeg_bookingId_sequence_idx" ON "BookingFlightLeg"("bookingId", "sequence");
DO $$ BEGIN
  ALTER TABLE "BookingFlightLeg" ADD CONSTRAINT "BookingFlightLeg_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "BookingFlightLeg" ADD CONSTRAINT "BookingFlightLeg_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "BookingFlightLeg" ADD CONSTRAINT "BookingFlightLeg_fromAirportId_fkey" FOREIGN KEY ("fromAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "BookingFlightLeg" ADD CONSTRAINT "BookingFlightLeg_toAirportId_fkey" FOREIGN KEY ("toAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "PricingEstimate" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER,
    "quoteRequestId" INTEGER,
    "aircraftId" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billableHours" DECIMAL(8,2) NOT NULL,
    "hourlyRateSnapshot" DECIMAL(12,2) NOT NULL,
    "flightHourCost" DECIMAL(12,2) NOT NULL,
    "airportFeesTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "handlingFeesTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "parkingFeesTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "crewFeesTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "otherFeesTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxesTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "markupTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estimatedTotal" DECIMAL(12,2) NOT NULL,
    "formulaVersion" TEXT NOT NULL DEFAULT 'v1',
    "snapshot" JSONB NOT NULL,
    "createdByUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PricingEstimate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "PricingEstimate_bookingId_idx" ON "PricingEstimate"("bookingId");
CREATE INDEX IF NOT EXISTS "PricingEstimate_aircraftId_idx" ON "PricingEstimate"("aircraftId");
DO $$ BEGIN
  ALTER TABLE "PricingEstimate" ADD CONSTRAINT "PricingEstimate_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "PricingEstimate" ADD CONSTRAINT "PricingEstimate_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "PricingEstimate" ADD CONSTRAINT "PricingEstimate_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- AuditLog extensions
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "entityType" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "entityId" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "beforeData" JSONB;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "afterData" JSONB;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "sessionId" TEXT;
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- RBAC
CREATE TABLE IF NOT EXISTS "RolePermission" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "RolePermission_role_permission_key" ON "RolePermission"("role", "permission");
CREATE INDEX IF NOT EXISTS "RolePermission_role_idx" ON "RolePermission"("role");

CREATE TABLE IF NOT EXISTS "UserPermissionOverride" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "permission" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" INTEGER,
    CONSTRAINT "UserPermissionOverride_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "UserPermissionOverride_userId_permission_key" ON "UserPermissionOverride"("userId", "permission");
CREATE INDEX IF NOT EXISTS "UserPermissionOverride_userId_idx" ON "UserPermissionOverride"("userId");
DO $$ BEGIN
  ALTER TABLE "UserPermissionOverride" ADD CONSTRAINT "UserPermissionOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "UserAirportScope" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "scopeType" TEXT NOT NULL,
    "continentCode" TEXT,
    "countryCode" TEXT,
    "airportId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "UserAirportScope_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "UserAirportScope_userId_idx" ON "UserAirportScope"("userId");
CREATE INDEX IF NOT EXISTS "UserAirportScope_scopeType_idx" ON "UserAirportScope"("scopeType");
DO $$ BEGIN
  ALTER TABLE "UserAirportScope" ADD CONSTRAINT "UserAirportScope_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "UserAirportScope" ADD CONSTRAINT "UserAirportScope_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Contracts
CREATE TABLE IF NOT EXISTS "ContractTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "operatorId" INTEGER,
    "aircraftCategoryCode" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "version" INTEGER NOT NULL DEFAULT 1,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileUrl" TEXT,
    "placeholders" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdBy" INTEGER,
    "approvedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContractTemplate_status_idx" ON "ContractTemplate"("status");
DO $$ BEGIN
  ALTER TABLE "ContractTemplate" ADD CONSTRAINT "ContractTemplate_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "OperatorContract" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "contractTemplateId" INTEGER,
    "contractNumber" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "amount" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "documentPath" TEXT,
    "createdByUserId" INTEGER,
    "submittedByUserId" INTEGER,
    "approvedByUserId" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "rejectedByUserId" INTEGER,
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "docusignEnvelopeId" TEXT,
    "sentAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "voidedAt" TIMESTAMP(3),
    "supersededContractId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OperatorContract_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "OperatorContract_bookingId_idx" ON "OperatorContract"("bookingId");
CREATE INDEX IF NOT EXISTS "OperatorContract_status_idx" ON "OperatorContract"("status");
CREATE INDEX IF NOT EXISTS "OperatorContract_docusignEnvelopeId_idx" ON "OperatorContract"("docusignEnvelopeId");
CREATE INDEX IF NOT EXISTS "OperatorContract_aircraftId_idx" ON "OperatorContract"("aircraftId");
DO $$ BEGIN
  ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_contractTemplateId_fkey" FOREIGN KEY ("contractTemplateId") REFERENCES "ContractTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "OperatorContract" ADD CONSTRAINT "OperatorContract_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "ContractApprovalHistory" (
    "id" SERIAL NOT NULL,
    "contractId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "actorUserId" INTEGER,
    "note" TEXT,
    "beforeStatus" TEXT,
    "afterStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContractApprovalHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContractApprovalHistory_contractId_createdAt_idx" ON "ContractApprovalHistory"("contractId", "createdAt");
DO $$ BEGIN
  ALTER TABLE "ContractApprovalHistory" ADD CONSTRAINT "ContractApprovalHistory_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "OperatorContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "SignatureWebhookEvent" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'MOCK',
    "contractId" INTEGER,
    "envelopeId" TEXT,
    "eventType" TEXT NOT NULL,
    "payload" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SignatureWebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SignatureWebhookEvent_eventId_key" ON "SignatureWebhookEvent"("eventId");
CREATE INDEX IF NOT EXISTS "SignatureWebhookEvent_envelopeId_idx" ON "SignatureWebhookEvent"("envelopeId");
DO $$ BEGIN
  ALTER TABLE "SignatureWebhookEvent" ADD CONSTRAINT "SignatureWebhookEvent_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "OperatorContract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
