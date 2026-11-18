-- CreateTable
CREATE TABLE "Initiative" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "objective" TEXT,
    "userProblem" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "period" TEXT NOT NULL DEFAULT 'Next',
    "relatedFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dependencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "associatedMilestoneId" TEXT,
    "rationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Initiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "purpose" TEXT,
    "plannedDate" TIMESTAMP(3),
    "initiativeIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "notesPreview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" TIMESTAMP(3),
    "initiativeIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningNote" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "relatedItemId" TEXT,
    "period" TEXT NOT NULL DEFAULT 'Next',
    "date" TIMESTAMP(3),
    "category" TEXT NOT NULL DEFAULT 'Strategic Decision',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Initiative_productId_idx" ON "Initiative"("productId");

-- CreateIndex
CREATE INDEX "Release_productId_idx" ON "Release"("productId");

-- CreateIndex
CREATE INDEX "Milestone_productId_idx" ON "Milestone"("productId");

-- CreateIndex
CREATE INDEX "PlanningNote_productId_idx" ON "PlanningNote"("productId");

-- AddForeignKey
ALTER TABLE "Initiative" ADD CONSTRAINT "Initiative_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningNote" ADD CONSTRAINT "PlanningNote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
