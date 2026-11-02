'use client';

import { ExitPlan, Position, formatCurrency, formatPercent } from '@/lib/calculations';

interface Props {
  grid: ExitPlan[][];
  position: Position;
}

const TARGET_LABELS = ['Break even', '1% profit', '5% profit', '10% profit'];

export default function ScenarioTable({ grid, position }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">How many shares to buy today</h3>
        <p className="text-sm text-gray-600 mt-1">
          Pick the bounce you expect {position.ticker} to make. Each cell shows the shares to buy now at{' '}
          {formatCurrency(position.currentPrice)} so that selling everything at that exit price gives the target result.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">If price bounces to</th>
              {TARGET_LABELS.map(l => (
                <th key={l} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grid.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{formatCurrency(row[0].exitPrice)}</div>
                  <div className="text-xs text-gray-500">{formatPercent(row[0].bouncePercent)}</div>
                </td>
                {row.map((plan, j) => (
                  <td key={j} className="px-4 py-3 whitespace-nowrap">
                    {!plan.feasible ? (
                      <span className="text-xs text-gray-400">Not possible at this price</span>
                    ) : plan.sharesToBuy === 0 ? (
                      <span className="text-xs text-green-600">Already there. Sell now.</span>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-gray-900">Buy {plan.sharesToBuy.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(plan.capitalRequired)} cash</div>
                        <div className="text-xs text-gray-500">New avg {formatCurrency(plan.newAvgCost)}</div>
                        <div className="text-xs text-green-600">Sell {plan.newTotalShares.toLocaleString()} for +{formatCurrency(plan.profitDollars)}</div>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        Sell the next trading day or later. Exit prices are your choice, not a prediction.
        Does not include fees or taxes.
      </div>
    </div>
  );
}
