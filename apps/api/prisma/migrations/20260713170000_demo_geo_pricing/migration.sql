-- AlterTable Airport: geo + parking/base fees
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "lat" DOUBLE PRECISION;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "lng" DOUBLE PRECISION;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "canParkAircraft" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "isBaseAirport" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "parkingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "overnightFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "landingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "feeCurrency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "operationalNotes" TEXT;

-- CreateTable OperatorAircraft
CREATE TABLE IF NOT EXISTS "OperatorAircraft" (
    "id" SERIAL NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "aircraftModelId" INTEGER NOT NULL,
    "tailNumber" TEXT NOT NULL,
    "baseAirportId" INTEGER NOT NULL,
    "currentAirportId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OperatorAircraft_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "OperatorAircraft_tailNumber_key" ON "OperatorAircraft"("tailNumber");
CREATE INDEX IF NOT EXISTS "OperatorAircraft_operatorId_idx" ON "OperatorAircraft"("operatorId");
CREATE INDEX IF NOT EXISTS "OperatorAircraft_status_idx" ON "OperatorAircraft"("status");

DO $$ BEGIN
  ALTER TABLE "OperatorAircraft" ADD CONSTRAINT "OperatorAircraft_operatorId_fkey"
    FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "OperatorAircraft" ADD CONSTRAINT "OperatorAircraft_aircraftModelId_fkey"
    FOREIGN KEY ("aircraftModelId") REFERENCES "AircraftModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "OperatorAircraft" ADD CONSTRAINT "OperatorAircraft_baseAirportId_fkey"
    FOREIGN KEY ("baseAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "OperatorAircraft" ADD CONSTRAINT "OperatorAircraft_currentAirportId_fkey"
    FOREIGN KEY ("currentAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- CreateTable AircraftContract
CREATE TABLE IF NOT EXISTS "AircraftContract" (
    "id" SERIAL NOT NULL,
    "operatorAircraftId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "hourlyRate" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "minHours" DECIMAL(6,2),
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AircraftContract_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AircraftContract_code_key" ON "AircraftContract"("code");
CREATE INDEX IF NOT EXISTS "AircraftContract_operatorAircraftId_status_idx" ON "AircraftContract"("operatorAircraftId", "status");

DO $$ BEGIN
  ALTER TABLE "AircraftContract" ADD CONSTRAINT "AircraftContract_operatorAircraftId_fkey"
    FOREIGN KEY ("operatorAircraftId") REFERENCES "OperatorAircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
