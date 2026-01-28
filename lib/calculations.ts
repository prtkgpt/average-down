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
    const profitAt5Percent = newAvgCost * 1.05;
    const profitAt10Percent = newAvgCost * 1.10;
    
    const requiredMoveToBreakEven = ((breakEvenPrice - position.currentPrice) / position.currentPrice) * 100;
    const requiredMoveTo5Percent = ((profitAt5Percent - position.currentPrice) / position.currentPrice) * 100;
    const requiredMoveTo10Percent = ((profitAt10Percent - position.currentPrice) / position.currentPrice) * 100;

    scenarios.push({
      sharesToBuy: additionalShares,
      additionalCapital: Math.round(additionalCapital * 100) / 100,
      newAvgCost: Math.round(newAvgCost * 100) / 100,
      newTotalShares,
      breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
      profitAt5Percent: Math.round(profitAt5Percent * 100) / 100,
      profitAt10Percent: Math.round(profitAt10Percent * 100) / 100,
      requiredMoveToBreakEven: Math.round(requiredMoveToBreakEven * 100) / 100,
      requiredMoveTo5Percent: Math.round(requiredMoveTo5Percent * 100) / 100,
      requiredMoveTo10Percent: Math.round(requiredMoveTo10Percent * 100) / 100,
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
