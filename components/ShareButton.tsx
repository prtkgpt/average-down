'use client';

import { useState } from 'react';

interface Props {
  saveId: string;
  ticker: string;
}

export default function ShareButton({ saveId, ticker }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${saveId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `I calculated my recovery plan for $${ticker} using AverageDown.io 📊`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Share Your Calculation</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition duration-200"
        >
          {copied ? '✓ Copied!' : '📋 Copy Link'}
        </button>
        <button
          onClick={shareOnTwitter}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
        >
          🐦 Share on Twitter
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Your calculation: <span className="font-mono text-gray-700">{shareUrl}</span>
      </p>
    </div>
  );
}
