-- CreateTable
CREATE TABLE "LaunchTask" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "phase" TEXT NOT NULL DEFAULT 'Preparation',
    "date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "owner" TEXT,
    "relatedAssetId" TEXT,
    "relatedChannelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaunchTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaunchAsset" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "preview" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "lastUpdated" TIMESTAMP(3),
    "relatedChannelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaunchAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campaignObjective" TEXT,
    "targetAudience" TEXT,
    "plannedActivity" TEXT,
    "phase" TEXT NOT NULL DEFAULT 'Preparation',
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "relatedAssetIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "item" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LaunchTask_productId_idx" ON "LaunchTask"("productId");

-- CreateIndex
CREATE INDEX "LaunchAsset_productId_idx" ON "LaunchAsset"("productId");

-- CreateIndex
CREATE INDEX "Channel_productId_idx" ON "Channel"("productId");

-- CreateIndex
CREATE INDEX "ChecklistItem_productId_idx" ON "ChecklistItem"("productId");

-- AddForeignKey
ALTER TABLE "LaunchTask" ADD CONSTRAINT "LaunchTask_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaunchAsset" ADD CONSTRAINT "LaunchAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
