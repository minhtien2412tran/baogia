-- CR Wave 1–2: Airport geo/fees, Aircraft fleet, FlightLeg, Booking pricing

-- Airport extensions
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "countryCode" TEXT;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "continentCode" TEXT;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(10,7);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(10,7);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "canParkAircraft" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "landingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "parkingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "overnightFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "handlingFee" DECIMAL(12,2);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "feeCurrency" TEXT DEFAULT 'USD';
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "feeUpdatedAt" TIMESTAMP(3);
ALTER TABLE "Airport" ADD COLUMN IF NOT EXISTS "opsNotes" TEXT;

CREATE INDEX IF NOT EXISTS "Airport_continentCode_idx" ON "Airport"("continentCode");
CREATE INDEX IF NOT EXISTS "Airport_countryCode_idx" ON "Airport"("countryCode");

-- Booking pricing fields
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "estimatedCost" DECIMAL(12,2);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "estimatedPrice" DECIMAL(12,2);
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD';
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "selectedAircraftId" INTEGER;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "pricingStatus" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "contractStatus" TEXT;

-- Aircraft fleet
CREATE TABLE IF NOT EXISTS "Aircraft" (
    "id" SERIAL NOT NULL,
    "registration" TEXT NOT NULL,
    "aircraftModelId" INTEGER NOT NULL,
    "operatorId" INTEGER,
    "baseAirportId" INTEGER NOT NULL,
    "currentAirportId" INTEGER NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "availabilityStatus" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "hourlyRate" DECIMAL(12,2) NOT NULL,
    "hourlyRateCurrency" TEXT NOT NULL DEFAULT 'USD',
    "minimumBillableHours" DECIMAL(4,1) NOT NULL DEFAULT 2,
    "locationUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Aircraft_registration_key" ON "Aircraft"("registration");
CREATE INDEX IF NOT EXISTS "Aircraft_currentAirportId_availabilityStatus_idx" ON "Aircraft"("currentAirportId", "availabilityStatus");
CREATE INDEX IF NOT EXISTS "Aircraft_availabilityStatus_idx" ON "Aircraft"("availabilityStatus");

-- Location history
CREATE TABLE IF NOT EXISTS "AircraftLocationHistory" (
    "id" SERIAL NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "fromAirportId" INTEGER,
    "toAirportId" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "note" TEXT,
    "createdBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AircraftLocationHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AircraftLocationHistory_aircraftId_createdAt_idx" ON "AircraftLocationHistory"("aircraftId", "createdAt");

-- FlightLeg
CREATE TABLE IF NOT EXISTS "FlightLeg" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER,
    "quoteRequestId" INTEGER,
    "aircraftId" INTEGER,
    "fromAirportId" INTEGER NOT NULL,
    "toAirportId" INTEGER NOT NULL,
    "legType" TEXT NOT NULL,
    "departureAt" TIMESTAMP(3) NOT NULL,
    "arrivalAt" TIMESTAMP(3),
    "estimatedFlightMinutes" INTEGER NOT NULL,
    "distanceKm" DECIMAL(10,2),
    "hasPassengers" BOOLEAN NOT NULL DEFAULT false,
    "passengerCount" INTEGER NOT NULL DEFAULT 0,
    "hourlyRateApplied" DECIMAL(12,2),
    "estimatedCost" DECIMAL(12,2),
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlightLeg_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "FlightLeg_bookingId_idx" ON "FlightLeg"("bookingId");
CREATE INDEX IF NOT EXISTS "FlightLeg_quoteRequestId_idx" ON "FlightLeg"("quoteRequestId");

-- FKs (idempotent via DO block)
DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_aircraftModelId_fkey" FOREIGN KEY ("aircraftModelId") REFERENCES "AircraftModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_baseAirportId_fkey" FOREIGN KEY ("baseAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Aircraft" ADD CONSTRAINT "Aircraft_currentAirportId_fkey" FOREIGN KEY ("currentAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

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
  ALTER TABLE "FlightLeg" ADD CONSTRAINT "FlightLeg_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "FlightLeg" ADD CONSTRAINT "FlightLeg_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "FlightLeg" ADD CONSTRAINT "FlightLeg_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "FlightLeg" ADD CONSTRAINT "FlightLeg_fromAirportId_fkey" FOREIGN KEY ("fromAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "FlightLeg" ADD CONSTRAINT "FlightLeg_toAirportId_fkey" FOREIGN KEY ("toAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_selectedAircraftId_fkey" FOREIGN KEY ("selectedAircraftId") REFERENCES "Aircraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
