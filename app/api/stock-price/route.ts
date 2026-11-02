import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker required' }, { status: 400 });
  }

  try {
    // Using Alpha Vantage API (free tier: 25 calls/day)
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const price = parseFloat(data['Global Quote']['05. price']);
      const change = parseFloat(data['Global Quote']['09. change']);
      const changePercent = parseFloat(data['Global Quote']['10. change percent'].replace('%', ''));
      
      return NextResponse.json({
        ticker: ticker.toUpperCase(),
        price,
        change,
        changePercent,
        timestamp: new Date().toISOString(),
      });
    }

    // Fallback to Finnhub if Alpha Vantage fails
    const finnhubKey = process.env.FINNHUB_API_KEY;
    if (finnhubKey) {
      const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${finnhubKey}`;
      const finnhubResponse = await fetch(finnhubUrl);
      const finnhubData = await finnhubResponse.json();

      if (finnhubData.c) {
        return NextResponse.json({
          ticker: ticker.toUpperCase(),
          price: finnhubData.c,
          change: finnhubData.d,
          changePercent: finnhubData.dp,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json(
      { error: 'Could not fetch price. Please enter manually.' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Stock price fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock price' },
      { status: 500 }
    );
  }
}
