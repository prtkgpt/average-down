'use client';

import { Scenario, Position, formatCurrency, formatPercent } from '@/lib/calculations';

interface Props {
  scenario: Scenario;
  position: Position;
  profitTarget: 1 | 5 | 10;
  title: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function ActionPlanCard({ scenario, position, profitTarget, title, riskLevel }: Props) {
  const exitPrice = profitTarget === 1 
    ? scenario.profitAt1Percent 
    : profitTarget === 5 
    ? scenario.profitAt5Percent 
    : scenario.profitAt10Percent;
    
  const profitDollars = profitTarget === 1 
    ? scenario.profitDollars1Percent 
    : profitTarget === 5 
    ? scenario.profitDollars5Percent 
    : scenario.profitDollars10Percent;
    
  const requiredMove = profitTarget === 1 
    ? scenario.requiredMoveTo1Percent 
    : profitTarget === 5 
    ? scenario.requiredMoveTo5Percent 
    : scenario.requiredMoveTo10Percent;

  const riskColors = {
    low: 'border-green-500 bg-green-50',
    medium: 'border-yellow-500 bg-yellow-50',
    high: 'border-red-500 bg-red-50',
  };

  const riskEmoji = {
    low: '✅',
    medium: '⚠️',
    high: '🚨',
  };

  const riskLabel = {
    low: 'Conservative - Lower risk, smaller profit',
    medium: 'Balanced - Moderate risk and reward',
    high: 'Aggressive - Higher risk, bigger profit',
  };

  // Determine probability based on required move
  let probability = '';
  let probabilityColor = '';
  if (requiredMove <= 5) {
    probability = 'HIGH (70-80% in 1-5 days)';
    probabilityColor = 'text-green-600';
  } else if (requiredMove <= 10) {
    probability = 'MODERATE (50-60% in 1-5 days)';
    probabilityColor = 'text-yellow-600';
  } else {
    probability = 'LOW (30-40% in 1-5 days)';
    probabilityColor = 'text-red-600';
  }

  const copyToClipboard = () => {
    const text = `Buy ${scenario.sharesToBuy} ${position.ticker} @ ${formatCurrency(position.currentPrice)}, then sell all ${scenario.newTotalShares} @ ${formatCurrency(exitPrice)} for ${formatCurrency(profitDollars)} profit`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className={`border-l-4 ${riskColors[riskLevel]} rounded-lg shadow-lg p-6 mb-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {riskEmoji[riskLevel]} {title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${probabilityColor} bg-white`}>
          {requiredMove > 0 ? `+${requiredMove.toFixed(2)}%` : `${requiredMove.toFixed(2)}%`} needed
        </span>
      </div>

      <div className="space-y-4">
        {/* Step 1: Buy */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm font-bold text-gray-600 mb-2">📥 STEP 1: BUY TODAY</div>
          <div className="text-lg font-bold text-gray-900">
            Buy {scenario.sharesToBuy} shares at {formatCurrency(position.currentPrice)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Investment needed: {formatCurrency(scenario.additionalCapital)}
          </div>
          <div className="text-sm text-gray-600">
            Your new average cost: {formatCurrency(scenario.newAvgCost)}
          </div>
        </div>

        {/* Step 2: Sell */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm font-bold text-gray-600 mb-2">📤 STEP 2: SELL TOMORROW OR LATER</div>
          <div className="text-lg font-bold text-gray-900">
            Sell ALL {scenario.newTotalShares} shares at {formatCurrency(exitPrice)}
          </div>
          <div className="text-sm text-green-600 font-bold mt-1">
            Profit: {formatCurrency(profitDollars)} (+{profitTarget}%)
          </div>
          <div className="text-sm text-gray-600">
            Total proceeds: {formatCurrency(exitPrice * scenario.newTotalShares)}
          </div>
        </div>

        {/* Probability */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm font-bold text-gray-600 mb-2">📊 SUCCESS PROBABILITY</div>
          <div className={`text-base font-bold ${probabilityColor}`}>
            {probability}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Based on typical {position.ticker} daily volatility
          </div>
        </div>

        {/* Broker Instructions */}
        <div className="bg-gray-900 rounded-lg p-4 text-white">
          <div className="text-sm font-bold mb-2">💼 COPY TO YOUR BROKER</div>
          <div className="font-mono text-xs bg-gray-800 p-2 rounded mb-2">
            1. Market Order: BUY {scenario.sharesToBuy} {position.ticker}<br/>
            2. Limit Order: SELL {scenario.newTotalShares} {position.ticker} @ {formatCurrency(exitPrice)} GTC
          </div>
          <button
            onClick={copyToClipboard}
            className="w-full bg-white text-gray-900 font-bold py-2 px-4 rounded hover:bg-gray-100 transition text-sm"
          >
            📋 Copy Trading Plan
          </button>
        </div>

        {/* Risk Assessment */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
          <span className="text-gray-600">{riskLabel[riskLevel]}</span>
          <span className="text-gray-600 font-bold">
            Risk/Reward: 1:{(1/scenario.riskRewardRatio).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
