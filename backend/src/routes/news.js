import express from 'express';
import Parser from 'rss-parser';

const router = express.Router();
const rssParser = new Parser();
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;

const newsCache = {
  articles: [],
  lastFetched: null,
  cacheDuration: 30 * 60 * 1000,
};

async function fetchGuardianNews() {
  if (!GUARDIAN_API_KEY || GUARDIAN_API_KEY === 'your-guardian-api-key-here') {
    console.log('Guardian API key not configured, skipping Guardian news');
    return [];
  }

  try {
    const response = await fetch(
      `https://content.guardianapis.com/search?section=society&tag=society/health&show-fields=thumbnail,trailText&page-size=10&api-key=${GUARDIAN_API_KEY}`,
    );

    const data = await response.json();
    if (data.response.status === 'ok') {
      return data.response.results.map(article => ({
        title: article.webTitle,
        description: article.fields?.trailText || '',
        url: article.webUrl,
        imageUrl: article.fields?.thumbnail || '',
        source: 'The Guardian',
        publishedAt: article.webPublicationDate,
        category: article.sectionName,
      }));
    }
    return [];
  } catch (error) {
    console.error('Guardian API error:', error.message);
    return [];
  }
}

async function fetchRSSFeeds() {
  const feeds = [
    { url: 'https://www.who.int/rss-feeds/news-english.xml', name: 'WHO' },
    { url: 'https://www.medicalnewstoday.com/rss', name: 'Medical News Today' },
    { url: 'https://www.healthline.com/health/rss', name: 'Healthline' },
  ];

  const allArticles = [];
  for (const feedInfo of feeds) {
    try {
      const feed = await rssParser.parseURL(feedInfo.url);
      const articles = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        description: item.contentSnippet || item.summary || item.content?.substring(0, 200),
        url: item.link,
        source: feedInfo.name,
        publishedAt: item.pubDate || item.isoDate,
        imageUrl: item.enclosure?.url || item.image?.url || null,
        category: 'Health & Wellness',
      }));
      allArticles.push(...articles);
    } catch (err) {
      console.error(`Failed to fetch RSS feed ${feedInfo.name}:`, err.message);
    }
  }

  return allArticles;
}

router.get('/health', async (req, res) => {
  try {
    const now = Date.now();
    if (newsCache.lastFetched && now - newsCache.lastFetched < newsCache.cacheDuration) {
      console.log('Serving news from cache');
      return res.json({ articles: newsCache.articles, cached: true });
    }

    console.log('Fetching fresh health news...');
    const [guardianArticles, rssArticles] = await Promise.all([
      fetchGuardianNews(),
      fetchRSSFeeds(),
    ]);

    const allArticles = [...guardianArticles, ...rssArticles];
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    newsCache.articles = allArticles.slice(0, 20);
    newsCache.lastFetched = now;

    res.json({
      articles: newsCache.articles,
      cached: false,
      sources: {
        guardian: guardianArticles.length,
        rss: rssArticles.length,
        total: newsCache.articles.length,
      },
    });
  } catch (error) {
    console.error('News fetch error:', error);
    if (newsCache.articles.length > 0) {
      return res.json({
        articles: newsCache.articles,
        cached: true,
        warning: 'Using cached data due to fetch error',
      });
    }
    res.status(500).json({ error: 'Failed to fetch health news: ' + error.message });
  }
});

export default router;

