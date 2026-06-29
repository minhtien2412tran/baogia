-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "companyId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuthProvider" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerSubject" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuthProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "legalName" TEXT NOT NULL,
    "billingEmail" TEXT NOT NULL,
    "taxCountry" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyAuthorizedUser" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "permissionSet" TEXT NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyAuthorizedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "tripType" TEXT NOT NULL DEFAULT 'ONE_WAY',
    "sourcePage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "message" TEXT,
    "isConsentAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteLeg" (
    "id" SERIAL NOT NULL,
    "quoteRequestId" INTEGER NOT NULL,
    "seq" INTEGER NOT NULL DEFAULT 0,
    "fromAirportId" INTEGER NOT NULL,
    "toAirportId" INTEGER NOT NULL,
    "departureLocalAt" TIMESTAMP(3) NOT NULL,
    "passengers" INTEGER NOT NULL DEFAULT 1,
    "relatedMatchId" INTEGER,

    CONSTRAINT "QuoteLeg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteOffer" (
    "id" SERIAL NOT NULL,
    "quoteRequestId" INTEGER NOT NULL,
    "aircraftModelId" INTEGER NOT NULL,
    "operatorId" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "pricingBreakdown" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "quoteOfferId" INTEGER,
    "quoteRequestId" INTEGER,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "bookingType" TEXT NOT NULL DEFAULT 'CHARTER',
    "agreementStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "bookingStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingPassenger" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "passportNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,

    CONSTRAINT "BookingPassenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3),
    "signerId" INTEGER,
    "fileUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" SERIAL NOT NULL,
    "iata" TEXT NOT NULL,
    "icao" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AircraftCategory" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "maxPassengers" INTEGER NOT NULL DEFAULT 8,

    CONSTRAINT "AircraftCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AircraftModel" (
    "id" SERIAL NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "rangeKm" INTEGER,
    "speedKmh" INTEGER,
    "sleepCapacity" INTEGER,
    "cabinWidth" DECIMAL(4,2),
    "cabinHeight" DECIMAL(4,2),
    "cabinLength" DECIMAL(4,2),

    CONSTRAINT "AircraftModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "complianceProfile" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedPriceRoute" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "fromAirportId" INTEGER NOT NULL,
    "toAirportId" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FixedPriceRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedPriceOption" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "paxLimit" INTEGER NOT NULL DEFAULT 8,
    "includedTerms" TEXT,

    CONSTRAINT "FixedPriceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmptyLegOffer" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "fromAirportId" INTEGER NOT NULL,
    "toAirportId" INTEGER NOT NULL,
    "departAt" TIMESTAMP(3) NOT NULL,
    "aircraftModelId" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "discountPct" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmptyLegOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JetCardPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "validityYears" INTEGER NOT NULL DEFAULT 2,
    "minNoticeHours" INTEGER NOT NULL DEFAULT 24,
    "dailyMinHours" DECIMAL(3,1) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "JetCardPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JetCardAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "remainingHours" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "JetCardAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JetCardTransaction" (
    "id" SERIAL NOT NULL,
    "jetCardAccountId" INTEGER NOT NULL,
    "txnType" TEXT NOT NULL,
    "hoursDelta" DECIMAL(6,2) NOT NULL,
    "bookingId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JetCardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelCreditLedger" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "companyId" INTEGER,
    "bookingId" INTEGER,
    "creditsDelta" DECIMAL(12,2) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelCreditLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerProgram" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "benefits" JSONB,

    CONSTRAINT "PartnerProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerApplication" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "whatsapp" TEXT,
    "wechat" TEXT,
    "reviewStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "programId" INTEGER NOT NULL,
    "dashboardPermissions" TEXT NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "ContentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentArticle" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER,
    "author" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "shareEnabled" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTranslation" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "ContentTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorldCupMatch" (
    "id" SERIAL NOT NULL,
    "matchDate" TIMESTAMP(3) NOT NULL,
    "stage" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "hostCity" TEXT NOT NULL,
    "stadium" TEXT NOT NULL,

    CONSTRAINT "WorldCupMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorldCupItinerary" (
    "id" SERIAL NOT NULL,
    "quoteRequestId" INTEGER NOT NULL,
    "campaignCode" TEXT NOT NULL,

    CONSTRAINT "WorldCupItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "queryPayload" JSONB NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthProvider_providerSubject_key" ON "UserAuthProvider"("providerSubject");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iata_key" ON "Airport"("iata");

-- CreateIndex
CREATE UNIQUE INDEX "AircraftCategory_code_key" ON "AircraftCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FixedPriceRoute_slug_key" ON "FixedPriceRoute"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EmptyLegOffer_slug_key" ON "EmptyLegOffer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerProgram_code_key" ON "PartnerProgram"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ContentCategory_slug_key" ON "ContentCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentArticle_slug_key" ON "ContentArticle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTranslation_entityType_entityId_locale_key" ON "ContentTranslation"("entityType", "entityId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Video_slug_key" ON "Video"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WorldCupItinerary_quoteRequestId_key" ON "WorldCupItinerary"("quoteRequestId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuthProvider" ADD CONSTRAINT "UserAuthProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyAuthorizedUser" ADD CONSTRAINT "CompanyAuthorizedUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteLeg" ADD CONSTRAINT "QuoteLeg_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteLeg" ADD CONSTRAINT "QuoteLeg_fromAirportId_fkey" FOREIGN KEY ("fromAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteLeg" ADD CONSTRAINT "QuoteLeg_toAirportId_fkey" FOREIGN KEY ("toAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteLeg" ADD CONSTRAINT "QuoteLeg_relatedMatchId_fkey" FOREIGN KEY ("relatedMatchId") REFERENCES "WorldCupMatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteOffer" ADD CONSTRAINT "QuoteOffer_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteOffer" ADD CONSTRAINT "QuoteOffer_aircraftModelId_fkey" FOREIGN KEY ("aircraftModelId") REFERENCES "AircraftModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteOffer" ADD CONSTRAINT "QuoteOffer_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_quoteOfferId_fkey" FOREIGN KEY ("quoteOfferId") REFERENCES "QuoteOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingPassenger" ADD CONSTRAINT "BookingPassenger_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AircraftModel" ADD CONSTRAINT "AircraftModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AircraftCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedPriceRoute" ADD CONSTRAINT "FixedPriceRoute_fromAirportId_fkey" FOREIGN KEY ("fromAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedPriceRoute" ADD CONSTRAINT "FixedPriceRoute_toAirportId_fkey" FOREIGN KEY ("toAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedPriceOption" ADD CONSTRAINT "FixedPriceOption_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "FixedPriceRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedPriceOption" ADD CONSTRAINT "FixedPriceOption_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AircraftCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmptyLegOffer" ADD CONSTRAINT "EmptyLegOffer_fromAirportId_fkey" FOREIGN KEY ("fromAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmptyLegOffer" ADD CONSTRAINT "EmptyLegOffer_toAirportId_fkey" FOREIGN KEY ("toAirportId") REFERENCES "Airport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmptyLegOffer" ADD CONSTRAINT "EmptyLegOffer_aircraftModelId_fkey" FOREIGN KEY ("aircraftModelId") REFERENCES "AircraftModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JetCardAccount" ADD CONSTRAINT "JetCardAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JetCardAccount" ADD CONSTRAINT "JetCardAccount_planId_fkey" FOREIGN KEY ("planId") REFERENCES "JetCardPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JetCardTransaction" ADD CONSTRAINT "JetCardTransaction_jetCardAccountId_fkey" FOREIGN KEY ("jetCardAccountId") REFERENCES "JetCardAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JetCardTransaction" ADD CONSTRAINT "JetCardTransaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelCreditLedger" ADD CONSTRAINT "TravelCreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelCreditLedger" ADD CONSTRAINT "TravelCreditLedger_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelCreditLedger" ADD CONSTRAINT "TravelCreditLedger_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerApplication" ADD CONSTRAINT "PartnerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerApplication" ADD CONSTRAINT "PartnerApplication_programId_fkey" FOREIGN KEY ("programId") REFERENCES "PartnerProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerAccount" ADD CONSTRAINT "PartnerAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerAccount" ADD CONSTRAINT "PartnerAccount_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerAccount" ADD CONSTRAINT "PartnerAccount_programId_fkey" FOREIGN KEY ("programId") REFERENCES "PartnerProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentArticle" ADD CONSTRAINT "ContentArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ContentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorldCupItinerary" ADD CONSTRAINT "WorldCupItinerary_quoteRequestId_fkey" FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentLog" ADD CONSTRAINT "ConsentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
