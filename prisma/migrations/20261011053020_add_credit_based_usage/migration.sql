-- CreateEnum
CREATE TYPE "CreditPeriodType" AS ENUM ('DAILY', 'MONTHLY', 'SUBSCRIPTION');

-- CreateTable
CREATE TABLE "CreditUsagePeriod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodType" "CreditPeriodType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditUsagePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCharge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "effort" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditCharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditUsagePeriod_userId_periodType_periodEnd_idx" ON "CreditUsagePeriod"("userId", "periodType", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "CreditUsagePeriod_userId_periodType_periodStart_key" ON "CreditUsagePeriod"("userId", "periodType", "periodStart");

-- CreateIndex
CREATE INDEX "CreditCharge_userId_createdAt_idx" ON "CreditCharge"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "CreditUsagePeriod" ADD CONSTRAINT "CreditUsagePeriod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCharge" ADD CONSTRAINT "CreditCharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
