export interface Position {
  shares: number;
  avgCost: number;
  currentPrice: number;
  ticker?: string;
}

// One row: given an exit price, how many shares to buy today
// so selling everything at that exit price yields the target profit.
export interface ExitPlan {
  bouncePercent: number;      // expected move from current price, e.g. 5
  exitPrice: number;          // current price * (1 + bounce)
  profitTarget: number;       // 0, 1, 5, 10
  sharesToBuy: number;        // whole shares
  capitalRequired: number;
  newTotalShares: number;
  newAvgCost: number;
  proceeds: number;           // exitPrice * newTotalShares
  totalCost: number;          // original cost + capitalRequired
  profitDollars: number;      // proceeds - totalCost
  feasible: boolean;          // false if exit price <= current price
}

const PROFIT_TARGETS = [0, 1, 5, 10];
const DEFAULT_BOUNCES = [2, 3, 5, 10, 15, 20];

export function sharesForTarget(position: Position, exitPrice: number, profitPercent: number): number | null {
  const targetAvg = exitPrice / (1 + profitPercent / 100);
  // Need target average strictly above current price, else infinite shares
  // Also reject when the gap is under 0.5% of price: share count explodes into the hundreds of thousands
  if (targetAvg <= position.currentPrice * 1.005) return null;
  // Already at or below target average: nothing to buy
  if (position.avgCost <= targetAvg) return 0;
  const raw = (position.shares * (position.avgCost - targetAvg)) / (targetAvg - position.currentPrice);
  return Math.ceil(raw);
}

export function buildExitPlan(position: Position, bouncePercent: number, profitPercent: number): ExitPlan {
  const exitPrice = round2(position.currentPrice * (1 + bouncePercent / 100));
  const shares = sharesForTarget(position, exitPrice, profitPercent);
  const originalCost = position.shares * position.avgCost;

  if (shares === null) {
    return {
      bouncePercent, exitPrice, profitTarget: profitPercent,
      sharesToBuy: 0, capitalRequired: 0, newTotalShares: position.shares,
      newAvgCost: position.avgCost, proceeds: 0, totalCost: originalCost,
      profitDollars: 0, feasible: false,
    };
  }

  const capitalRequired = shares * position.currentPrice;
  const newTotalShares = position.shares + shares;
  const totalCost = originalCost + capitalRequired;
  const newAvgCost = totalCost / newTotalShares;
  const proceeds = exitPrice * newTotalShares;

  return {
    bouncePercent, exitPrice, profitTarget: profitPercent,
    sharesToBuy: shares,
    capitalRequired: round2(capitalRequired),
    newTotalShares,
    newAvgCost: round2(newAvgCost),
    proceeds: round2(proceeds),
    totalCost: round2(totalCost),
    profitDollars: round2(proceeds - totalCost),
    feasible: true,
  };
}

// Grid: rows = bounce %, columns = profit target
export function buildExitGrid(position: Position, bounces: number[] = DEFAULT_BOUNCES): ExitPlan[][] {
  return bounces.map(b => PROFIT_TARGETS.map(p => buildExitPlan(position, b, p)));
}

// Custom exit price typed by the user
export function plansForExitPrice(position: Position, exitPrice: number): ExitPlan[] {
  const bounce = ((exitPrice - position.currentPrice) / position.currentPrice) * 100;
  return PROFIT_TARGETS.map(p => {
    const plan = buildExitPlan(position, bounce, p);
    return { ...plan, exitPrice: round2(exitPrice), bouncePercent: round2(bounce) };
  });
}

// Inverse: user has a budget. What average does it buy, and what exit price is breakeven?
export function planForBudget(position: Position, budget: number) {
  const shares = Math.floor(budget / position.currentPrice);
  const newTotalShares = position.shares + shares;
  const totalCost = position.shares * position.avgCost + shares * position.currentPrice;
  const newAvgCost = totalCost / newTotalShares;
  const bounceToBreakeven = ((newAvgCost - position.currentPrice) / position.currentPrice) * 100;
  return {
    sharesToBuy: shares,
    capitalRequired: round2(shares * position.currentPrice),
    newTotalShares,
    newAvgCost: round2(newAvgCost),
    breakEvenPrice: round2(newAvgCost),
    bounceToBreakeven: round2(bounceToBreakeven),
    exit1: round2(newAvgCost * 1.01),
    exit5: round2(newAvgCost * 1.05),
    exit10: round2(newAvgCost * 1.10),
  };
}

export function getCurrentLossPercent(position: Position): number {
  return round2(((position.currentPrice - position.avgCost) / position.avgCost) * 100);
}

export function getCurrentLossDollar(position: Position): number {
  return round2((position.currentPrice - position.avgCost) * position.shares);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
