-- Performance indexes for common query patterns
CREATE INDEX IF NOT EXISTS "QuoteRequest_status_idx" ON "QuoteRequest"("status");
CREATE INDEX IF NOT EXISTS "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");
CREATE INDEX IF NOT EXISTS "Booking_bookingStatus_idx" ON "Booking"("bookingStatus");
CREATE INDEX IF NOT EXISTS "Booking_createdAt_idx" ON "Booking"("createdAt");
CREATE INDEX IF NOT EXISTS "ContentArticle_slug_idx" ON "ContentArticle"("slug");
CREATE INDEX IF NOT EXISTS "FixedPriceRoute_slug_idx" ON "FixedPriceRoute"("slug");
CREATE INDEX IF NOT EXISTS "EmptyLegOffer_slug_idx" ON "EmptyLegOffer"("slug");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
