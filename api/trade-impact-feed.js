export const config = { runtime: 'edge' };

const PROVIDER_CHAIN = ['ollama', 'groq', 'openrouter', 'generic'];
const MAX_ITEMS = 8;

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...init.headers,
    },
    ...init,
  });
}

function unique(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

function parseCsvParam(raw) {
  return unique(String(raw || '').split(','));
}

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function keywordScore(title, keywords) {
  const haystack = normalizeText(title);
  let score = 0;
  for (const keyword of keywords) {
    if (!keyword) continue;
    const needle = normalizeText(keyword);
    if (!needle) continue;
    if (haystack.includes(needle)) score += Math.max(needle.length, 6);
  }
  return score;
}

function parseAiJson(raw, fallbackHeadline, source) {
  const clean = String(raw || '').trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    return {
      headline: String(parsed.headline || fallbackHeadline),
      sentiment: parsed.sentiment === 'Bullish' || parsed.sentiment === 'Bearish' ? parsed.sentiment : 'Neutral',
      impact_analysis: String(parsed.impact_analysis || ''),
      source,
    };
  } catch {
    return null;
  }
}

function fallbackAnalysis(item, symbols) {
  const title = normalizeText(item.title);
  let sentiment = 'Neutral';
  if (/(surge|rise|beat|cooling inflation|rate cut|stimulus|safe haven demand|dovish)/.test(title)) sentiment = 'Bullish';
  if (/(selloff|drops|falls|hawkish|rate hike|inflation shock|tariff|sanction|war|miss)/.test(title)) sentiment = 'Bearish';
  return {
    headline: item.title,
    sentiment,
    impact_analysis: `Potential ${sentiment.toLowerCase()} read for ${symbols.join(', ')} as this headline could shift macro expectations or safe-haven flows.`,
    source: item.source || 'Finance feed',
  };
}

async function summarizeImpact(origin, item, symbols) {
  const endpoint = new URL('/api/news/v1/summarize-article', origin);
  const systemAppend = [
    'You are converting one market-moving headline into structured trading JSON.',
    `Focus on watchlist symbols: ${symbols.join(', ') || 'macro watchlist'}.`,
    'Return only valid JSON with exactly these keys: headline, sentiment, impact_analysis.',
    'sentiment must be one of Bullish, Bearish, Neutral.',
    'impact_analysis must be one sentence and explain probable market impact.',
  ].join(' ');

  for (const provider of PROVIDER_CHAIN) {
    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        provider,
        headlines: [item.title],
        mode: 'analysis',
        geoContext: '',
        variant: 'finance',
        lang: 'en',
        systemAppend,
      }),
    });
    if (!response.ok) continue;
    const data = await response.json().catch(() => null);
    const summary = data?.summary;
    if (!summary) continue;
    const parsed = parseAiJson(summary, item.title, item.source);
    if (parsed) return parsed;
  }

  return fallbackAnalysis(item, symbols);
}

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const symbols = parseCsvParam(url.searchParams.get('symbols'));
    const keywords = parseCsvParam(url.searchParams.get('keywords'));

    const digestUrl = new URL('/api/news/v1/list-feed-digest', origin);
    digestUrl.searchParams.set('variant', 'finance');
    digestUrl.searchParams.set('lang', 'en');

    const digestResponse = await fetch(digestUrl.toString(), {
      headers: { accept: 'application/json' },
    });
    if (!digestResponse.ok) {
      return json({ items: [] }, { status: 502 });
    }

    const digest = await digestResponse.json();
    const categories = Object.values(digest?.categories || {});
    const items = categories.flatMap((bucket) => Array.isArray(bucket?.items) ? bucket.items : []);

    const ranked = unique(items.map((item) => JSON.stringify(item)))
      .map((serialized) => JSON.parse(serialized))
      .map((item) => ({
        item,
        matchScore: keywordScore(item.title, keywords),
      }))
      .filter((entry) => entry.matchScore > 0)
      .sort((a, b) => (
        b.matchScore - a.matchScore
        || (Number(b.item.importanceScore) || 0) - (Number(a.item.importanceScore) || 0)
        || (Number(b.item.publishedAt) || 0) - (Number(a.item.publishedAt) || 0)
      ))
      .slice(0, MAX_ITEMS);

    const analyzed = await Promise.all(ranked.map(({ item }) => summarizeImpact(origin, item, symbols)));
    return json({ items: analyzed });
  } catch (error) {
    return json({
      items: [],
      error: error instanceof Error ? error.message : 'trade-impact-feed failed',
    }, { status: 500 });
  }
}
