-- CreateEnum
CREATE TYPE "Importance" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "HypothesisCategory" AS ENUM ('PROBLEM', 'SOLUTION', 'MARKET', 'BUSINESS_MODEL', 'VALUE_PROPOSITION', 'CUSTOMER', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "HypothesisStatus" AS ENUM ('DRAFT', 'ACTIVE', 'TESTING', 'VALIDATED', 'INVALIDATED', 'PAUSED');

-- CreateEnum
CREATE TYPE "ExperimentMethod" AS ENUM ('SURVEY', 'INTERVIEW', 'LANDING_PAGE', 'PROTOTYPE', 'AB_TEST', 'SMOKE_TEST', 'OBSERVATION');

-- CreateEnum
CREATE TYPE "ExperimentStatus" AS ENUM ('DRAFT', 'PLANNED', 'RUNNING', 'COMPLETE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('INTERVIEW', 'SURVEY', 'OBSERVATION', 'METRIC', 'DOCUMENT', 'OTHER');

-- CreateTable
CREATE TABLE "Hypothesis" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "customerSegment" TEXT,
    "category" "HypothesisCategory",
    "rationale" TEXT,
    "importance" "Importance" NOT NULL DEFAULT 'MEDIUM',
    "status" "HypothesisStatus" NOT NULL DEFAULT 'DRAFT',
    "relatedExperimentIds" TEXT[],
    "linkedFindings" TEXT[],
    "unresolvedQuestions" TEXT[],
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hypothesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "relatedHypothesisId" TEXT,
    "objective" TEXT,
    "method" "ExperimentMethod",
    "targetAudience" TEXT,
    "successCriteria" TEXT,
    "expectedEvidence" TEXT,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "observations" TEXT[],
    "notes" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceItem" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "relatedExperimentId" TEXT,
    "relatedHypothesisId" TEXT,
    "type" "EvidenceType",
    "sourceLabel" TEXT,
    "date" TIMESTAMP(3),
    "observation" TEXT,
    "interpretation" TEXT,
    "limitations" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidenceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hypothesis_ideaId_idx" ON "Hypothesis"("ideaId");

-- CreateIndex
CREATE INDEX "Experiment_ideaId_idx" ON "Experiment"("ideaId");

-- CreateIndex
CREATE INDEX "EvidenceItem_ideaId_idx" ON "EvidenceItem"("ideaId");

-- AddForeignKey
ALTER TABLE "Hypothesis" ADD CONSTRAINT "Hypothesis_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_relatedHypothesisId_fkey" FOREIGN KEY ("relatedHypothesisId") REFERENCES "Hypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_relatedExperimentId_fkey" FOREIGN KEY ("relatedExperimentId") REFERENCES "Experiment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_relatedHypothesisId_fkey" FOREIGN KEY ("relatedHypothesisId") REFERENCES "Hypothesis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
