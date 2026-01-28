'use client';

import { useState } from 'react';
import { Position, calculateScenarios, getCurrentLossPercent, getCurrentLossDollar, formatCurrency, formatPercent } from '@/lib/calculations';
import ScenarioTable from './ScenarioTable';
import ShareButton from './ShareButton';

export default function Calculator({ initialTicker = '' }: { initialTicker?: string }) {
  const [ticker, setTicker] = useState(initialTicker);
  const [shares, setShares] = useState('');
  const [avgCost, setAvgCost] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [position, setPosition] = useState<Position | null>(null);
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

    setPosition(pos);
    setIsCalculating(true);

    const calculatedScenarios = calculateScenarios(pos);
    setScenarios(calculatedScenarios);

    // Save to backend
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: pos,
          scenarios: calculatedScenarios,
        }),
      });

      const data = await response.json();
      if (data.saveId) {
        setSaveId(data.saveId);
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
    }

    setIsCalculating(false);
  };

  const currentLossPercent = position ? getCurrentLossPercent(position) : 0;
  const currentLossDollar = position ? getCurrentLossDollar(position) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Calculator Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Calculate Your Recovery Plan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticker Symbol
            </label>
            <input
              type="text"
              placeholder="e.g., FVRR"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Shares Owned
            </label>
            <input
              type="number"
              placeholder="e.g., 10"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Average Cost
            </label>
            <input
              type="number"
              placeholder="e.g., 19.87"
              value={avgCost}
              onChange={(e) => setAvgCost(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              step="0.01"
              min="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Price
            </label>
            <input
              type="number"
              placeholder="e.g., 16.66"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              step="0.01"
              min="0.01"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {isCalculating ? 'Calculating...' : 'Calculate Recovery Scenarios'}
        </button>
      </div>

      {/* Current Position Summary */}
      {position && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-lg p-6 mb-8 border-l-4 border-danger">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Current Position</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Ticker</div>
              <div className="text-2xl font-bold text-gray-900">{position.ticker}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Investment</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(position.shares * position.avgCost)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Current Value</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(position.shares * position.currentPrice)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Loss</div>
              <div className="text-2xl font-bold text-danger">
                {formatCurrency(currentLossDollar)} ({formatPercent(currentLossPercent)})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios */}
      {scenarios.length > 0 && (
        <>
          <ScenarioTable scenarios={scenarios} position={position!} />
          {saveId && <ShareButton saveId={saveId} ticker={ticker} />}
        </>
      )}
    </div>
  );
}
