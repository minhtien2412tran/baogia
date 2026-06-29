-- AlterTable
ALTER TABLE "ContentArticle" ADD COLUMN     "thumbnail" TEXT;

-- AlterTable
ALTER TABLE "ContentTranslation" ADD COLUMN     "excerpt" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "thumbnail" TEXT;

-- CreateTable
CREATE TABLE "Destination" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "thumbnail" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");
