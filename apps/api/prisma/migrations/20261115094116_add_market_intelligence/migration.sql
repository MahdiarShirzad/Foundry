-- DropForeignKey
ALTER TABLE "IdeaNote" DROP CONSTRAINT "IdeaNote_ideaId_fkey";

-- CreateTable
CREATE TABLE "MarketIdea" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL,
    "marketIdeaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "pricing" TEXT,
    "targetAudience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "marketIdeaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "size" TEXT,
    "painPoints" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "marketIdeaId" TEXT NOT NULL,
    "segmentId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "significance" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchNote" (
    "id" TEXT NOT NULL,
    "marketIdeaId" TEXT NOT NULL,
    "relatedType" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResearchNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketIdea_ideaId_key" ON "MarketIdea"("ideaId");

-- CreateIndex
CREATE INDEX "MarketIdea_workspaceId_idx" ON "MarketIdea"("workspaceId");

-- CreateIndex
CREATE INDEX "Competitor_marketIdeaId_idx" ON "Competitor"("marketIdeaId");

-- CreateIndex
CREATE INDEX "Segment_marketIdeaId_idx" ON "Segment"("marketIdeaId");

-- CreateIndex
CREATE INDEX "Opportunity_marketIdeaId_idx" ON "Opportunity"("marketIdeaId");

-- CreateIndex
CREATE INDEX "ResearchNote_marketIdeaId_idx" ON "ResearchNote"("marketIdeaId");

-- CreateIndex
CREATE INDEX "ResearchNote_relatedType_relatedId_idx" ON "ResearchNote"("relatedType", "relatedId");

-- CreateIndex
CREATE INDEX "IdeaNote_ideaId_idx" ON "IdeaNote"("ideaId");

-- AddForeignKey
ALTER TABLE "IdeaNote" ADD CONSTRAINT "IdeaNote_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketIdea" ADD CONSTRAINT "MarketIdea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketIdea" ADD CONSTRAINT "MarketIdea_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_marketIdeaId_fkey" FOREIGN KEY ("marketIdeaId") REFERENCES "MarketIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_marketIdeaId_fkey" FOREIGN KEY ("marketIdeaId") REFERENCES "MarketIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_marketIdeaId_fkey" FOREIGN KEY ("marketIdeaId") REFERENCES "MarketIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchNote" ADD CONSTRAINT "ResearchNote_marketIdeaId_fkey" FOREIGN KEY ("marketIdeaId") REFERENCES "MarketIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
