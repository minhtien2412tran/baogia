-- CreateTable
CREATE TABLE "TravelCreditPackage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "creditAmount" DECIMAL(12,2) NOT NULL,
    "priceUsd" DECIMAL(12,2) NOT NULL,
    "bonusPct" DECIMAL(5,2),
    "validityMonths" INTEGER NOT NULL DEFAULT 12,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelCreditPackage_pkey" PRIMARY KEY ("id")
);

-- Seed default packages (match previous hard-coded catalog)
INSERT INTO "TravelCreditPackage" ("name", "creditAmount", "priceUsd", "bonusPct", "validityMonths", "currency", "active", "updatedAt")
VALUES
  ('Starter', 1000, 1000, NULL, 12, 'USD', true, CURRENT_TIMESTAMP),
  ('Business', 5000, 4500, 10, 18, 'USD', true, CURRENT_TIMESTAMP),
  ('Enterprise', 15000, 12000, 20, 24, 'USD', true, CURRENT_TIMESTAMP);
