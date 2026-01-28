import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AverageDown.io - Stock Loss Recovery Calculator',
  description: 'Calculate exactly how many shares to buy to turn your stock losses into profits. Free averaging down calculator for retail investors.',
  keywords: 'stock calculator, averaging down, loss recovery, break even calculator, stock investment, portfolio recovery',
  openGraph: {
    title: 'AverageDown.io - Stock Loss Recovery Calculator',
    description: 'Turn your stock losses into profits with precise averaging down calculations',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold text-primary">
                  AverageDown.io
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/#how-it-works" className="text-gray-600 hover:text-gray-900">
                  How It Works
                </a>
                <a href="/#popular-tickers" className="text-gray-600 hover:text-gray-900">
                  Popular Tickers
                </a>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AverageDown.io</h3>
                <p className="text-sm text-gray-600">
                  Free stock loss recovery calculator. Calculate your path to profitability.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Disclaimer</h3>
                <p className="text-xs text-gray-600">
                  Not financial advice. For informational purposes only. Investing carries risk. 
                  Consult a financial advisor before making investment decisions.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Contact</h3>
                <p className="text-xs text-gray-600">
                  Questions or feedback? Email: hello@averagedown.io
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
              © 2025 AverageDown.io. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
