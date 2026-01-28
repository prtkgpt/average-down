import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ScenarioTable from '@/components/ScenarioTable';
import { formatCurrency, formatPercent, getCurrentLossPercent, getCurrentLossDollar } from '@/lib/calculations';
import type { Metadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const calculation = await prisma.savedCalculation.findUnique({
    where: { id: params.id },
  });

  if (!calculation) {
    return {
      title: 'Calculation Not Found - AverageDown.io',
    };
  }

  const position = calculation.positionData as any;
  
  return {
    title: `${position.ticker} Recovery Plan - AverageDown.io`,
    description: `Shared ${position.ticker} averaging down calculation. See the complete recovery strategy.`,
  }
}

export default async function SavedCalculationPage({ params }: Props) {
  const calculation = await prisma.savedCalculation.findUnique({
    where: { id: params.id },
  });

  if (!calculation) {
    notFound();
  }

  // Increment view count
  await prisma.savedCalculation.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });

  const position = calculation.positionData as any;
  const scenarios = calculation.scenarios as any[];
  
  const currentLossPercent = getCurrentLossPercent(position);
  const currentLossDollar = getCurrentLossDollar(position);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shared ${position.ticker} Recovery Calculation
          </h1>
          <p className="text-gray-600">
            Created {new Date(calculation.createdAt).toLocaleDateString()} · 
            {calculation.views > 1 && ` ${calculation.views} views`}
          </p>
        </div>

        {/* Position Summary */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-lg p-6 mb-8 border-l-4 border-danger">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Position Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Ticker</div>
              <div className="text-2xl font-bold text-gray-900">${position.ticker}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Shares Owned</div>
              <div className="text-2xl font-bold text-gray-900">{position.shares}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Average Cost</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(position.avgCost)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Current Price</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(position.currentPrice)}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-200">
            <div className="text-sm text-gray-600">Current Loss</div>
            <div className="text-2xl font-bold text-danger">
              {formatCurrency(currentLossDollar)} ({formatPercent(currentLossPercent)})
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <ScenarioTable scenarios={scenarios} position={position} />

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block bg-primary hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition duration-200"
          >
            Calculate Your Own Position
          </a>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            This calculation is for informational purposes only and is not financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
