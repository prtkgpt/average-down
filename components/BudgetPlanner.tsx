'use client';

import { useState } from 'react';
import { Position, planForBudget, formatCurrency, formatPercent } from '@/lib/calculations';

export default function BudgetPlanner({ position }: { position: Position }) {
  const [budget, setBudget] = useState('');
  const b = parseFloat(budget);
  const plan = b > 0 ? planForBudget(position, b) : null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-1">Start from your budget instead</h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter how much cash you can add today. See the exit prices that get you out.
      </p>
      <input
        type="number"
        placeholder="e.g., 500"
        value={budget}
        onChange={e => setBudget(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
        min="0"
        step="1"
      />
      {plan && plan.sharesToBuy > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Buy today</div>
            <div className="font-bold text-gray-900">{plan.sharesToBuy.toLocaleString()} shares</div>
            <div className="text-xs text-gray-500">{formatCurrency(plan.capitalRequired)}</div>
          </div>
          <div>
            <div className="text-gray-600">New average</div>
            <div className="font-bold text-gray-900">{formatCurrency(plan.newAvgCost)}</div>
            <div className="text-xs text-gray-500">{plan.newTotalShares.toLocaleString()} shares total</div>
          </div>
          <div>
            <div className="text-gray-600">Sell all at (break even)</div>
            <div className="font-bold text-gray-900">{formatCurrency(plan.breakEvenPrice)}</div>
            <div className="text-xs text-gray-500">needs {formatPercent(plan.bounceToBreakeven)}</div>
          </div>
          <div>
            <div className="text-gray-600">Sell all at (profit)</div>
            <div className="font-bold text-gray-900">1%: {formatCurrency(plan.exit1)}</div>
            <div className="text-xs text-gray-500">5%: {formatCurrency(plan.exit5)} · 10%: {formatCurrency(plan.exit10)}</div>
          </div>
        </div>
      )}
      {plan && plan.sharesToBuy === 0 && (
        <p className="text-sm text-gray-500">That budget buys less than one share at {formatCurrency(position.currentPrice)}.</p>
      )}
    </div>
  );
}
