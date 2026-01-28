# Deployment Guide - AverageDown.io

## Quick Deploy Checklist

### Pre-Deploy
- [ ] Neon database created and connection string ready
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Google AdSense applied for (can deploy before approval)

### Deploy Steps

## Step 1: Setup Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free tier is perfect for MVP)
3. Create new project called "averagedown"
4. Copy connection string (looks like `postgresql://user:password@...`)
5. Save for Vercel deployment

## Step 2: Push to GitHub

```bash
cd averagedown-io
git init
git add .
git commit -m "Initial deployment"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/averagedown-io.git
git push -u origin main
```

## Step 3: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

4. Add Environment Variables:
   ```
   DATABASE_URL = your_neon_connection_string
   NEXT_PUBLIC_BASE_URL = https://your-project.vercel.app
   ```

5. Click "Deploy"

6. Wait 2-3 minutes for deployment

## Step 4: Initialize Database

After first deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run Prisma migration
vercel env pull .env
npx prisma generate
npx prisma db push
```

Or use Vercel's built-in terminal in dashboard.

## Step 5: Custom Domain (Optional but Recommended)

1. Buy domain (recommend Namecheap or Cloudflare):
   - averagedown.io ($12/year)
   - averagedown.com
   - downaverage.com
   - stockrecovery.io

2. In Vercel project settings:
   - Go to Domains
   - Add your domain
   - Follow DNS configuration steps

3. Update environment variable:
   ```
   NEXT_PUBLIC_BASE_URL = https://averagedown.io
   ```

## Step 6: Google AdSense Setup

### Apply for AdSense (Do this ASAP - takes 1-2 weeks)

1. Go to [google.com/adsense](https://google.com/adsense/start)
2. Sign in with Google account
3. Enter your domain (averagedown.io)
4. Submit application
5. Add AdSense code to site (already in app/layout.tsx)
6. Wait for approval email

### After Approval

1. Get your client ID (looks like `ca-pub-1234567890123456`)
2. Create ad units in AdSense dashboard:
   - Create "Display ad" unit for sidebar
   - Create "Display ad" unit for content
3. Get ad slot IDs
4. Update code:

**In `app/layout.tsx`:**
```typescript
src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
```

**In `components/AdUnit.tsx`:**
```typescript
data-ad-client="ca-pub-YOUR_ID"
```

5. Replace slot IDs in pages:
   - `app/page.tsx` line with `<AdUnit slot="..." />`
   - Use different slot IDs for different placements

## Step 7: Analytics Setup (Optional)

### Vercel Analytics (Built-in, free)
Already included via `@vercel/analytics` package

### Plausible (Privacy-friendly, recommended)
1. Sign up at [plausible.io](https://plausible.io)
2. Add site domain
3. Add script to `app/layout.tsx`:
```typescript
<Script
  defer
  data-domain="averagedown.io"
  src="https://plausible.io/js/script.js"
/>
```

## Step 8: Monitoring

### Set up Vercel Monitoring
- Check Analytics tab in Vercel dashboard
- Monitor function invocations
- Watch for errors

### Database Monitoring
- Check Neon dashboard for query performance
- Monitor connection usage
- Set up alerts for issues

## Step 9: Post-Launch

### Test Everything
- [ ] Calculator works on mobile
- [ ] Calculations save to database
- [ ] Shareable links work
- [ ] Ads display (may take 24hrs after AdSense approval)
- [ ] Ticker-specific pages work (`/calculator/AAPL`)

### Marketing Launch
- [ ] Post on Reddit (r/stocks, r/wallstreetbets)
- [ ] Tweet about launch
- [ ] Post in finance Discord servers
- [ ] Submit to ProductHunt

## Troubleshooting

### Database Connection Errors
```bash
# Verify connection string works
npx prisma db push
```

If it fails, check:
- Connection string format correct
- Neon database is running
- SSL mode enabled

### Build Failures
Common issues:
- Missing environment variables (check Vercel dashboard)
- TypeScript errors (run `npm run build` locally first)
- Prisma not generated (add postinstall script in package.json)

### Ads Not Showing
- AdSense needs 24-48hrs after approval to start serving
- Check browser console for errors
- Verify client ID is correct
- Make sure ad blockers are disabled when testing

## Scaling Considerations

### When traffic hits 1K daily users:
- Monitor Neon database performance
- Consider upgrading to Neon Pro ($19/mo) for better performance

### When traffic hits 10K daily users:
- Upgrade Neon to Pro tier
- Add Redis caching for stats (Upstash free tier)
- Enable Vercel Edge Functions for better global performance

### When traffic hits 100K daily users:
- Move to dedicated database (RDS, etc)
- Implement rate limiting
- Add CDN for static assets
- Consider premium tier ($4.99/mo ad-free)

## Cost Breakdown (MVP)

**Free Tier (0-1K users/day):**
- Hosting: Vercel Free
- Database: Neon Free
- Domain: $12/year
- **Total: $1/month**

**Growth Tier (10K users/day):**
- Hosting: Vercel Pro $20/mo
- Database: Neon Pro $19/mo
- Domain: $12/year
- **Total: $40/month**

**Revenue at 10K daily users:**
- $1.5-4.5K/month from ads
- **Profit: $1,460-4,460/month**

## Support

Issues during deployment? Email: prateek@cleanday.com

## Next Steps After Deploy

1. Apply for Google AdSense immediately (takes 1-2 weeks)
2. Set up affiliate accounts:
   - Robinhood
   - Webull
   - TD Ameritrade
3. Start Reddit marketing
4. Build email list (add newsletter signup)
5. Create Twitter account and start posting

Good luck! 🚀
