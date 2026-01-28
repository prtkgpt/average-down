'use client';

import { Scenario, Position, formatCurrency, formatPercent } from '@/lib/calculations';

interface Props {
  scenarios: Scenario[];
  position: Position;
}

export default function ScenarioTable({ scenarios, position }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Recovery Scenarios</h3>
        <p className="text-sm text-gray-600 mt-1">
          Choose a scenario that fits your budget and risk tolerance
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Shares to Buy
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Additional Capital
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                New Avg Cost
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Break Even Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Move Needed
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                5% Profit Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                10% Profit Price
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scenarios.map((scenario, index) => {
              const moveColor = scenario.requiredMoveToBreakEven <= 5 
                ? 'text-green-600' 
                : scenario.requiredMoveToBreakEven <= 10 
                ? 'text-yellow-600' 
                : 'text-red-600';

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {scenario.sharesToBuy} shares
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: {scenario.newTotalShares}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(scenario.additionalCapital)}
                    </div>
                    <div className="text-xs text-gray-500">
                      @ {formatCurrency(position.currentPrice)}/share
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(scenario.newAvgCost)}
                    </div>
                    <div className="text-xs text-gray-500">
                      from {formatCurrency(position.avgCost)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(scenario.breakEvenPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${moveColor}`}>
                      {formatPercent(scenario.requiredMoveToBreakEven)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(scenario.profitAt5Percent)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPercent(scenario.requiredMoveTo5Percent)} move
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(scenario.profitAt10Percent)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPercent(scenario.requiredMoveTo10Percent)} move
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-600 space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
            <span>Easy recovery (≤5% move)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
            <span>Moderate (5-10% move)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span>Difficult (>10% move)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
