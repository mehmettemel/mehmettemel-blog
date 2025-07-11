# Analytics & Search Console Setup Guide

This guide will help you set up Google Analytics and Search Console for your portfolio website.

## 🔍 Google Analytics Setup

### Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create a new account for your portfolio
4. Set up a new property:
   - Property name: `Mehmet Temel Portfolio`
   - Reporting time zone: `Turkey (UTC+3)`
   - Currency: `Turkish Lira (TRY)`

### Step 2: Get Your Measurement ID

1. In your GA4 property, go to **Admin** → **Data Streams**
2. Click on your web stream
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Add to Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://mehmettemel.com
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### Step 4: Test Analytics

1. Run your development server: `npm run dev`
2. Open your site and check the browser console
3. You should see Google Analytics loading without errors
4. Check your GA4 real-time reports to see if data is coming in

## 🔍 Google Search Console Setup

### Step 1: Add Your Property

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add property"
3. Enter your domain: `https://mehmettemel.com`
4. Choose **Domain** property (recommended)

### Step 2: Verify Ownership

You have several verification options:

#### Option A: HTML Tag (Recommended)

1. In Search Console, click "HTML tag"
2. Copy the meta tag (looks like: `<meta name="google-site-verification" content="...">`)
3. Add it to your `src/app/layout.jsx`:

```javascript
verification: {
  google: 'your-verification-code-here',
},
```

#### Option B: DNS Record

1. Add a TXT record to your domain's DNS
2. Wait for verification (can take up to 24 hours)

### Step 3: Submit Your Sitemap

1. In Search Console, go to **Sitemaps**
2. Add your sitemap URL: `https://mehmettemel.com/sitemap.xml`
3. Click "Submit"

## 🔍 Other Search Engines

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site and verify ownership
3. Submit your sitemap

### Yandex Webmaster

1. Go to [Yandex Webmaster](https://webmaster.yandex.com/)
2. Add your site and verify ownership
3. Submit your sitemap

## 📊 Monitoring Your SEO Performance

### Google Analytics Reports to Monitor:

1. **Audience Overview**

   - Page views, users, sessions
   - Geographic data (see if you're getting traffic from Turkey)
   - Device breakdown

2. **Acquisition Reports**

   - Traffic sources (organic search, social, direct)
   - Search console integration data

3. **Behavior Reports**
   - Most popular pages
   - User engagement metrics
   - Bounce rate

### Search Console Reports to Monitor:

1. **Performance Report**

   - Search queries bringing traffic
   - Click-through rates
   - Average position

2. **Coverage Report**

   - Indexed pages
   - Any indexing errors
   - Mobile usability issues

3. **Enhancements**
   - Core Web Vitals
   - Mobile usability
   - Rich results

## 🎯 SEO Goals & KPIs

### Primary Goals:

- **Organic Traffic**: Increase month-over-month
- **Search Rankings**: Target keywords in top 10
- **Click-through Rate**: >3% for target keywords
- **Page Speed**: <3 seconds load time

### Target Keywords to Monitor:

- "Mehmet Temel"
- "Front End Engineer Turkey"
- "React Developer Adana"
- "Vue.js Developer Turkey"
- "E-commerce Developer Turkey"

## 🔧 Troubleshooting

### Analytics Not Working?

1. Check if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Verify the ID format (should start with `G-`)
3. Check browser console for errors
4. Ensure the site is deployed (analytics won't work on localhost)

### Search Console Issues?

1. Verify ownership is complete
2. Check if sitemap is accessible at `/sitemap.xml`
3. Ensure robots.txt allows crawling
4. Wait 24-48 hours for initial indexing

### No Search Traffic?

1. Check if site is indexed (search `site:mehmettemel.com`)
2. Verify sitemap submission
3. Check for crawl errors in Search Console
4. Ensure content is unique and valuable

## 📈 Next Steps

1. **Set up goals in Analytics** for form submissions, page views
2. **Create custom reports** for your specific needs
3. **Set up email alerts** for significant traffic changes
4. **Regular monitoring** (weekly/monthly reviews)
5. **Content optimization** based on search query data

## 🎉 You're All Set!

Once you complete these steps, you'll have:

- ✅ Complete website analytics
- ✅ Search engine monitoring
- ✅ Performance tracking
- ✅ SEO optimization insights

Your portfolio will be fully optimized for tracking and improving its search performance! 🚀
