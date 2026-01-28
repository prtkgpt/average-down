import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import prisma from '@/lib/db';
import { getClientIP, hashIP, validateNumber, validateTicker } from '@/lib/utils';
import { Position } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { position, scenarios } = body as { position: Position; scenarios: any[] };

    // Validation
    if (!position || !scenarios) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!validateTicker(position.ticker || '')) {
      return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 });
    }

    if (!validateNumber(position.shares) || !validateNumber(position.avgCost) || !validateNumber(position.currentPrice)) {
      return NextResponse.json({ error: 'Invalid numbers' }, { status: 400 });
    }

    const clientIP = getClientIP(request.headers);
    const ipHash = hashIP(clientIP);
    const userAgent = request.headers.get('user-agent') || '';

    // Save calculation to database
    const calculation = await prisma.calculation.create({
      data: {
        ticker: position.ticker!,
        currentShares: position.shares,
        avgCost: position.avgCost,
        currentPrice: position.currentPrice,
        ipHash,
        userAgent,
      },
    });

    // Update ticker stats
    const lossPercent = ((position.currentPrice - position.avgCost) / position.avgCost) * 100;
    await prisma.tickerStats.upsert({
      where: { ticker: position.ticker! },
      update: {
        calculationCount: { increment: 1 },
        lastCalculated: new Date(),
        avgLossPercent: lossPercent, // Simplified - should calculate running average
      },
      create: {
        ticker: position.ticker!,
        calculationCount: 1,
        lastCalculated: new Date(),
        avgLossPercent: lossPercent,
      },
    });

    // Create shareable link
    const saveId = nanoid(12);
    await prisma.savedCalculation.create({
      data: {
        id: saveId,
        ticker: position.ticker!,
        positionData: position as any,
        scenarios: scenarios as any,
      },
    });

    return NextResponse.json({
      success: true,
      calculationId: calculation.id,
      saveId,
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
