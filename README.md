# AverageDown.io

Free stock loss recovery calculator. Calculate exactly how many shares to buy to turn your losses into profits.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Monetization**: Google AdSense

## Setup

### 1. Clone and Install

```bash
cd averagedown-io
npm install
```

### 2. Database Setup (Neon)

1. Create a free account at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string
4. Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@host:5432/averagedown?sslmode=require"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL` (from Neon)
   - `NEXT_PUBLIC_BASE_URL` (your Vercel URL)
4. Deploy!

### 3. Setup Google AdSense

1. Apply for Google AdSense at [google.com/adsense](https://www.google.com/adsense)
2. Once approved, get your client ID (looks like `ca-pub-XXXXXXXXXXXXXXXX`)
3. Replace the placeholder in:
   - `app/layout.tsx` (AdSense script)
   - `components/AdUnit.tsx` (data-ad-client)

## Database Schema

### Calculation
Tracks every calculation made (for analytics)
- ticker, currentShares, avgCost, currentPrice
- ipHash (for rate limiting)
- createdAt

### TickerStats
Aggregates calculation data by ticker
- ticker, calculationCount, avgLossPercent
- Used for "Most Calculated Tickers" section

### SavedCalculation
Shareable calculation links
- id (nanoid), ticker, positionData, scenarios
- views counter

## Revenue Model

**Free app + Ads + Traffic**

Target metrics:
- 10K daily users = $1.5-4.5K/month
- 50K daily users = $7.5-22.5K/month
- 100K daily users = $15-45K/month

Revenue streams:
1. Google AdSense (primary)
2. Broker affiliate links (Robinhood, Webull, TD Ameritrade)
3. Optional: Premium ad-free tier ($4.99/mo)

## Marketing Strategy

### Week 1: Reddit Launch
- Post on r/stocks, r/wallstreetbets, r/robinhood
- Use real FVRR example from screenshot
- Title: "Built a calculator to turn my -16% loss profitable"

### Week 2: SEO Foundation
- Generate `/calculator/[TICKER]` pages for top 100 tickers
- Submit to Google Search Console
- Target keywords: "[ticker] averaging down calculator"

### Week 3: Twitter/StockTwits
- Monitor mentions of "down on [ticker]"
- Reply with helpful calculations
- Build following around stock recovery

### Week 4: Communities
- Finance Discord servers
- Webull/Robinhood communities
- Offer free calculations

## Key Features

- ✅ Instant calculations (no signup required)
- ✅ Shareable calculation links
- ✅ Ticker-specific SEO pages
- ✅ Mobile responsive
- ✅ Ad-supported (free for users)
- ✅ Analytics tracking
- ✅ "Most Calculated Tickers" leaderboard

## API Endpoints

### POST /api/calculate
Saves calculation and returns shareable ID

### GET /api/stats
Returns top tickers and recent calculations

## Monetization Setup

### Google AdSense
1. Apply at google.com/adsense
2. Add your site
3. Wait for approval (1-2 weeks)
4. Get client ID and ad slot IDs
5. Replace placeholders in code

### Broker Affiliates
- Robinhood: up to $200/referral
- Webull: up to $75/referral
- TD Ameritrade: varies

Add affiliate links in footer and after calculations.

## Future Enhancements

- Historical volatility data (show probability of hitting targets)
- Email alerts when ticker reaches target price
- Portfolio view (multiple positions)
- Mobile app (React Native)
- Options recovery calculator
- Crypto averaging down calculator

## Support

Questions? Email: hello@averagedown.io

## License

MIT
