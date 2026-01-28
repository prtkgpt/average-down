import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Get top 10 most calculated tickers
    const topTickers = await prisma.tickerStats.findMany({
      orderBy: { calculationCount: 'desc' },
      take: 10,
      select: {
        ticker: true,
        calculationCount: true,
        avgLossPercent: true,
        lastCalculated: true,
      },
    });

    // Get total calculations today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const calculationsToday = await prisma.calculation.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Get recent calculations (anonymized)
    const recentCalculations = await prisma.calculation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        ticker: true,
        currentShares: true,
        avgCost: true,
        currentPrice: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      topTickers,
      calculationsToday,
      recentCalculations,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
