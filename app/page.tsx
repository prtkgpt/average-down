import Calculator from '@/components/Calculator';
import AdUnit from '@/components/AdUnit';

async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stats`, {
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    return { topTickers: [], calculationsToday: 0, recentCalculations: [] };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Turn Your Stock Losses Into Profits
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Calculate exactly how many shares to buy to recover from your losing position
        </p>
        <p className="text-sm text-gray-500">
          {stats.calculationsToday > 0 && `${stats.calculationsToday.toLocaleString()} calculations today`}
        </p>
      </div>

      {/* Calculator */}
      <Calculator />

      {/* Ad Unit - Below Calculator */}
      <div className="max-w-6xl mx-auto">
        <AdUnit slot="1234567890" format="horizontal" />
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="max-w-6xl mx-auto mt-16 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">1. Enter Your Position</h3>
            <p className="text-gray-600">
              Input your ticker, current shares, average cost, and current price. 
              Takes less than 30 seconds.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🧮</div>
            <h3 className="text-xl font-bold mb-2">2. See Your Scenarios</h3>
            <p className="text-gray-600">
              Get instant calculations showing exactly how many shares to buy at different 
              price targets for break-even or profit.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">3. Execute Your Plan</h3>
            <p className="text-gray-600">
              Choose a scenario that fits your budget and risk tolerance. 
              Share your calculation or save it for later.
            </p>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Real Example</h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Problem:</strong> You bought 10 shares of FVRR at $19.87. It's now trading at $16.66. 
            You're down $32.05 (-16.13%).
          </p>
          <p>
            <strong>Solution:</strong> Buy 23 more shares at $16.66 for $383.18 additional capital.
          </p>
          <p>
            <strong>Result:</strong> Your new average cost becomes $17.50. If FVRR moves to $17.75 
            (just +6.5%), you're profitable on your entire position.
          </p>
          <p className="text-sm text-gray-600 mt-4">
            This is the exact calculation that inspired AverageDown.io
          </p>
        </div>
      </div>

      {/* Popular Tickers */}
      {stats.topTickers && stats.topTickers.length > 0 && (
        <div id="popular-tickers" className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Most Calculated Tickers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.topTickers.map((ticker: any) => (
              <a
                key={ticker.ticker}
                href={`/calculator/${ticker.ticker}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-gray-900">${ticker.ticker}</div>
                <div className="text-sm text-gray-600">
                  {ticker.calculationCount.toLocaleString()} calculations
                </div>
                {ticker.avgLossPercent && (
                  <div className="text-xs text-red-600 mt-1">
                    Avg loss: {ticker.avgLossPercent.toFixed(1)}%
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Ad Unit - Bottom of page */}
      <div className="max-w-6xl mx-auto mt-12">
        <AdUnit slot="0987654321" format="horizontal" />
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">Is averaging down a good strategy?</h3>
            <p className="text-gray-600">
              Averaging down can be effective if you believe in the company's fundamentals and 
              the price drop is temporary. However, it increases your position size and risk. 
              Never average down on positions you wouldn't buy today.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">Is this financial advice?</h3>
            <p className="text-gray-600">
              No. AverageDown.io is a calculator tool that provides mathematical scenarios. 
              This is not investment advice. Always do your own research and consider consulting 
              a financial advisor before making investment decisions.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">How accurate are the calculations?</h3>
            <p className="text-gray-600">
              Our calculations are mathematically precise based on the inputs you provide. 
              However, they don't account for transaction fees, taxes, or market volatility. 
              Actual results will vary.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">Is this service free?</h3>
            <p className="text-gray-600">
              Yes, AverageDown.io is completely free to use. We're supported by advertising.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
