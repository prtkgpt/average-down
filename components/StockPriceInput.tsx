'use client';

import { useState } from 'react';

interface Props {
  ticker: string;
  onPriceUpdate: (price: number) => void;
}

export default function StockPriceInput({ ticker, onPriceUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    if (!ticker || ticker.length < 1) {
      setError('Enter a ticker first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stock-price?ticker=${ticker}`);
      const data = await response.json();

      if (response.ok) {
        setPriceData(data);
        onPriceUpdate(data.price);
        setError(null);
      } else {
        setError(data.error || 'Could not fetch price');
        setPriceData(null);
      }
    } catch (err) {
      setError('Network error. Please enter price manually.');
      setPriceData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={fetchPrice}
        disabled={loading || !ticker}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm mb-2"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Fetching...
          </span>
        ) : (
          `🔄 Get Live ${ticker || 'Price'}`
        )}
      </button>

      {priceData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Live Price</div>
              <div className="text-2xl font-bold text-gray-900">
                ${priceData.price.toFixed(2)}
              </div>
            </div>
            <div className={`text-right ${priceData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <div className="text-lg font-bold">
                {priceData.change >= 0 ? '+' : ''}{priceData.change.toFixed(2)}
              </div>
              <div className="text-sm">
                {priceData.change >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Updated: {new Date(priceData.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
          <div className="text-sm text-yellow-800">
            ⚠️ {error}
          </div>
        </div>
      )}
    </div>
  );
}
