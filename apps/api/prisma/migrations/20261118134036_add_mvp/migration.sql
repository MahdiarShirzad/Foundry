-- CreateTable
CREATE TABLE "MVPProject" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ref" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Scoping',
    "concept" TEXT,
    "problem" TEXT,
    "targetAudience" TEXT,
    "valueProp" TEXT,
    "mvpObjective" TEXT,
    "currentScope" TEXT,
    "essentialCapabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "explicitExclusions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "successCriteria" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "structure" JSONB,
    "openDecisions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MVPProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userProblem" TEXT,
    "targetUser" TEXT,
    "area" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "scope" TEXT NOT NULL DEFAULT 'Could Have',
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "userStory" TEXT,
    "acceptanceCriteria" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "behavior" TEXT,
    "edgeCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dependencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "openQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "designNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScopeItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "explanation" TEXT,
    "category" TEXT NOT NULL DEFAULT 'included',
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "featureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScopeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MVPProject_productId_idx" ON "MVPProject"("productId");

-- CreateIndex
CREATE INDEX "Feature_projectId_idx" ON "Feature"("projectId");

-- CreateIndex
CREATE INDEX "ScopeItem_projectId_idx" ON "ScopeItem"("projectId");

-- AddForeignKey
ALTER TABLE "MVPProject" ADD CONSTRAINT "MVPProject_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MVPProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScopeItem" ADD CONSTRAINT "ScopeItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MVPProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
