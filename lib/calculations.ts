export interface Position {
  shares: number;
  avgCost: number;
  currentPrice: number;
  ticker?: string;
}

export interface Scenario {
  sharesToBuy: number;
  additionalCapital: number;
  newAvgCost: number;
  newTotalShares: number;
  breakEvenPrice: number;
  profitAt5Percent: number;
  profitAt10Percent: number;
  requiredMoveToBreakEven: number;
  requiredMoveTo5Percent: number;
  requiredMoveTo10Percent: number;
  // New fields for action plans
  profitAt1Percent: number;
  requiredMoveTo1Percent: number;
  profitDollars1Percent: number;
  profitDollars5Percent: number;
  profitDollars10Percent: number;
  riskRewardRatio: number;
}

export function calculateScenarios(position: Position): Scenario[] {
  const scenarios: Scenario[] = [];
  const totalCost = position.shares * position.avgCost;
  const currentLoss = (position.avgCost - position.currentPrice) / position.avgCost * 100;

  // Generate scenarios for different share purchases
  // Start from 5 shares, go up to 100 in increments
  const increments = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
  
  for (const additionalShares of increments) {
    const newTotalShares = position.shares + additionalShares;
    const additionalCapital = additionalShares * position.currentPrice;
    const newAvgCost = (totalCost + additionalCapital) / newTotalShares;
    const breakEvenPrice = newAvgCost;
    const profitAt1Percent = newAvgCost * 1.01;
    const profitAt5Percent = newAvgCost * 1.05;
    const profitAt10Percent = newAvgCost * 1.10;
    
    const requiredMoveToBreakEven = ((breakEvenPrice - position.currentPrice) / position.currentPrice) * 100;
    const requiredMoveTo1Percent = ((profitAt1Percent - position.currentPrice) / position.currentPrice) * 100;
    const requiredMoveTo5Percent = ((profitAt5Percent - position.currentPrice) / position.currentPrice) * 100;
    const requiredMoveTo10Percent = ((profitAt10Percent - position.currentPrice) / position.currentPrice) * 100;

    // Calculate profit in dollars for each target
    const profitDollars1Percent = (profitAt1Percent - newAvgCost) * newTotalShares;
    const profitDollars5Percent = (profitAt5Percent - newAvgCost) * newTotalShares;
    const profitDollars10Percent = (profitAt10Percent - newAvgCost) * newTotalShares;

    // Risk/Reward ratio (capital at risk / potential profit for 5% target)
    const riskRewardRatio = profitDollars5Percent > 0 ? additionalCapital / profitDollars5Percent : 999;

    scenarios.push({
      sharesToBuy: additionalShares,
      additionalCapital: Math.round(additionalCapital * 100) / 100,
      newAvgCost: Math.round(newAvgCost * 100) / 100,
      newTotalShares,
      breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
      profitAt1Percent: Math.round(profitAt1Percent * 100) / 100,
      profitAt5Percent: Math.round(profitAt5Percent * 100) / 100,
      profitAt10Percent: Math.round(profitAt10Percent * 100) / 100,
      requiredMoveToBreakEven: Math.round(requiredMoveToBreakEven * 100) / 100,
      requiredMoveTo1Percent: Math.round(requiredMoveTo1Percent * 100) / 100,
      requiredMoveTo5Percent: Math.round(requiredMoveTo5Percent * 100) / 100,
      requiredMoveTo10Percent: Math.round(requiredMoveTo10Percent * 100) / 100,
      profitDollars1Percent: Math.round(profitDollars1Percent * 100) / 100,
      profitDollars5Percent: Math.round(profitDollars5Percent * 100) / 100,
      profitDollars10Percent: Math.round(profitDollars10Percent * 100) / 100,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    });
  }

  return scenarios;
}

export function getCurrentLossPercent(position: Position): number {
  return Math.round(((position.currentPrice - position.avgCost) / position.avgCost) * 10000) / 100;
}

export function getCurrentLossDollar(position: Position): number {
  return Math.round((position.currentPrice - position.avgCost) * position.shares * 100) / 100;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
