'use client';

import { useState } from 'react';
import {
  Position, ExitPlan, buildExitGrid, plansForExitPrice,
  getCurrentLossPercent, getCurrentLossDollar, formatCurrency, formatPercent,
} from '@/lib/calculations';
import ScenarioTable from './ScenarioTable';
import BudgetPlanner from './BudgetPlanner';
import ShareButton from './ShareButton';
import StockPriceInput from './StockPriceInput';

export default function Calculator({ initialTicker = '' }: { initialTicker?: string }) {
  const [ticker, setTicker] = useState(initialTicker);
  const [shares, setShares] = useState('');
  const [avgCost, setAvgCost] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [customExit, setCustomExit] = useState('');
  const [position, setPosition] = useState<Position | null>(null);
  const [grid, setGrid] = useState<ExitPlan[][]>([]);
  const [saveId, setSaveId] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!ticker || !shares || !avgCost || !currentPrice) {
      alert('Please fill in all fields');
      return;
    }
    const pos: Position = {
      ticker: ticker.toUpperCase(),
      shares: parseFloat(shares),
      avgCost: parseFloat(avgCost),
      currentPrice: parseFloat(currentPrice),
    };
    if (pos.currentPrice >= pos.avgCost) {
      alert('Your current price is at or above your average cost. You are not at a loss.');
      return;
    }
    setPosition(pos);
    setIsCalculating(true);
    const g = buildExitGrid(pos);
    setGrid(g);

    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: pos, scenarios: g }),
      });
      const data = await res.json();
      if (data.saveId) setSaveId(data.saveId);
    } catch (e) {
      console.error(e);
    }
    setIsCalculating(false);
  };

  const customPlans = position && parseFloat(customExit) > 0
    ? plansForExitPrice(position, parseFloat(customExit))
    : null;

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent';

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your position</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ticker</label>
            <input type="text" placeholder="e.g., LCID" value={ticker} maxLength={5}
              onChange={e => setTicker(e.target.value.toUpperCase())} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shares you own</label>
            <input type="number" placeholder="e.g., 40" value={shares} min="1"
              onChange={e => setShares(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your average cost</label>
            <input type="number" placeholder="e.g., 8.11" value={avgCost} step="0.01" min="0.01"
              onChange={e => setAvgCost(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current price</label>
            <input type="number" placeholder="e.g., 3.29" value={currentPrice} step="0.01" min="0.01"
              onChange={e => setCurrentPrice(e.target.value)} className={inputClass} />
            <div className="mt-2">
              <StockPriceInput ticker={ticker} onPriceUpdate={p => setCurrentPrice(p.toString())} />
            </div>
          </div>
        </div>
        <button onClick={handleCalculate} disabled={isCalculating}
          className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50">
          {isCalculating ? 'Calculating...' : 'Show me how many shares to buy'}
        </button>
      </div>

      {position && (
        <>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-lg p-6 mb-8 border-l-4 border-danger">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Where you stand</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Invested</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(position.shares * position.avgCost)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Worth now</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(position.shares * position.currentPrice)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Loss</div>
                <div className="text-2xl font-bold text-danger">{formatCurrency(getCurrentLossDollar(position))}</div>
                <div className="text-xs text-danger">{formatPercent(getCurrentLossPercent(position))}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Bounce needed with no new shares</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercent(((position.avgCost - position.currentPrice) / position.currentPrice) * 100)}
                </div>
              </div>
            </div>
          </div>

          <ScenarioTable grid={grid} position={position} />

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Have a specific exit price in mind?</h3>
            <p className="text-sm text-gray-600 mb-4">Type the price you think {position.ticker} can reach. Must be above {formatCurrency(position.currentPrice)}.</p>
            <input type="number" placeholder="e.g., 3.60" value={customExit} step="0.01"
              onChange={e => setCustomExit(e.target.value)} className={inputClass + ' mb-4'} />
            {customPlans && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {customPlans.map((p, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 text-sm">
                    <div className="text-gray-600 mb-1">{p.profitTarget === 0 ? 'Break even' : `${p.profitTarget}% profit`}</div>
                    {!p.feasible ? (
                      <div className="text-xs text-gray-400">Not possible at this exit price</div>
                    ) : (
                      <>
                        <div className="font-bold text-gray-900">Buy {p.sharesToBuy.toLocaleString()} shares</div>
                        <div className="text-xs text-gray-500">{formatCurrency(p.capitalRequired)} cash</div>
                        <div className="text-xs text-gray-500">Sell {p.newTotalShares.toLocaleString()} at {formatCurrency(p.exitPrice)}</div>
                        <div className="text-xs text-green-600">Profit {formatCurrency(p.profitDollars)}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <BudgetPlanner position={position} />

          {saveId && <ShareButton saveId={saveId} ticker={ticker} />}
        </>
      )}
    </div>
  );
}
