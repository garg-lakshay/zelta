-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "sector" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "exitPrice" DOUBLE PRECISION NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "exitDate" TIMESTAMP(3) NOT NULL,
    "tradeValue" DOUBLE PRECISION NOT NULL,
    "pnl" DOUBLE PRECISION NOT NULL,
    "holdingDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalTrades" INTEGER NOT NULL,
    "winningTrades" INTEGER NOT NULL,
    "losingTrades" INTEGER NOT NULL,
    "winRate" DOUBLE PRECISION NOT NULL,
    "lossRate" DOUBLE PRECISION NOT NULL,
    "totalPnL" DOUBLE PRECISION NOT NULL,
    "grossProfit" DOUBLE PRECISION NOT NULL,
    "grossLoss" DOUBLE PRECISION NOT NULL,
    "averageWinningTrade" DOUBLE PRECISION NOT NULL,
    "averageLosingTrade" DOUBLE PRECISION NOT NULL,
    "profitFactor" DOUBLE PRECISION NOT NULL,
    "riskRewardRatio" DOUBLE PRECISION NOT NULL,
    "expectancy" DOUBLE PRECISION NOT NULL,
    "largestWinningTrade" DOUBLE PRECISION NOT NULL,
    "largestLosingTrade" DOUBLE PRECISION NOT NULL,
    "largestWinningStreak" INTEGER NOT NULL,
    "largestLosingStreak" INTEGER NOT NULL,
    "averageHoldingDuration" DOUBLE PRECISION NOT NULL,
    "averageTradesPerDay" DOUBLE PRECISION NOT NULL,
    "maxDrawdown" DOUBLE PRECISION NOT NULL,
    "averageDrawdown" DOUBLE PRECISION NOT NULL,
    "sharpeRatio" DOUBLE PRECISION NOT NULL,
    "calmarRatio" DOUBLE PRECISION NOT NULL,
    "averagePositionSize" DOUBLE PRECISION NOT NULL,
    "portfolioExposure" DOUBLE PRECISION NOT NULL,
    "positionConcentration" DOUBLE PRECISION NOT NULL,
    "sectorConcentration" DOUBLE PRECISION NOT NULL,
    "overtradingScore" INTEGER NOT NULL,
    "disciplineScore" INTEGER NOT NULL,
    "emotionalScore" INTEGER NOT NULL,
    "consistencyScore" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "performanceScore" INTEGER NOT NULL,
    "behaviourScore" INTEGER NOT NULL,
    "masterScore" INTEGER NOT NULL,
    "traderPersonality" TEXT NOT NULL,
    "equityCurve" JSONB NOT NULL,
    "dailyPnL" JSONB NOT NULL,
    "sectorExposure" JSONB NOT NULL,
    "insights" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_userId_key" ON "analytics"("userId");

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
