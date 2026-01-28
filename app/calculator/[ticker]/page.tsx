import Calculator from '@/components/Calculator';
import { Metadata } from 'next';

type Props = {
  params: { ticker: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ticker = params.ticker.toUpperCase();
  
  return {
    title: `${ticker} Average Down Calculator - AverageDown.io`,
    description: `Calculate your ${ticker} position recovery. See exactly how many shares to buy to break even or profit on your ${ticker} investment.`,
    openGraph: {
      title: `${ticker} Average Down Calculator`,
      description: `Free ${ticker} averaging down calculator for stock recovery`,
    },
  }
}

export default function TickerPage({ params }: Props) {
  const ticker = params.ticker.toUpperCase();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          ${ticker} Recovery Calculator
        </h1>
        <p className="text-xl text-gray-600">
          Calculate your path to profitability on your ${ticker} position
        </p>
      </div>

      <Calculator initialTicker={ticker} />

      <div className="max-w-4xl mx-auto mt-12 bg-blue-50 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About ${ticker} Position Recovery
        </h2>
        <p className="text-gray-700 mb-4">
          If you're holding ${ticker} at a loss, this calculator shows you exactly how many 
          shares to buy at the current price to lower your average cost. By averaging down 
          strategically, you can reach break-even or profitability with smaller price movements.
        </p>
        <p className="text-gray-700">
          Remember: averaging down increases your position size and risk. Only consider this 
          strategy if you believe in ${ticker}'s long-term potential and would buy the stock 
          at today's price.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-8 text-center">
        <a
          href="/"
          className="text-primary hover:text-green-600 font-medium"
        >
          ← Calculate another ticker
        </a>
      </div>
    </div>
  );
}
