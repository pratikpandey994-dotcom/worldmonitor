# Technical State

This file indexes the current end-of-session architecture across the legacy `worldmonitor` SPA and the newer `pulse-app` workspace that now owns Prisma/PostgreSQL state.

## Routing Logic

### Root Vite App (`worldmonitor`)

- Entry point: [src/main.ts](/Users/pratikpandey/worldmonitor/src/main.ts:594)
- When the browser lands on `/`, the SPA immediately rewrites the URL to `/portfolio` via `window.history.replaceState(...)`.
- If the resolved path is `/portfolio`, the app mounts [PortfolioHomepage.ts](/Users/pratikpandey/worldmonitor/src/components/PortfolioHomepage.ts:67).
- All other non-standalone routes still boot the legacy `App` shell.
- Standalone utility windows remain query-driven:
  - `?settings=1`
  - `?live-channels=1`

### `PortfolioHomepage`

- Mounted by [src/components/PortfolioHomepage.ts](/Users/pratikpandey/worldmonitor/src/components/PortfolioHomepage.ts:67)
- Provides the current personalized landing page experience:
  - custom forex/metals watchlist
  - heatmap / movement matrix
  - geopolitical impact feed
- Uses `market-watchlist` storage plus `fetchCommodityQuotes(...)` and `fetchTradeImpactFeed(...)`.

## Data Pipeline

### Trade Impact Feed Hook

- Edge route: [api/trade-impact-feed.js](/Users/pratikpandey/worldmonitor/api/trade-impact-feed.js:1)
- Client consumer: [src/services/trade-impact-feed.ts](/Users/pratikpandey/worldmonitor/src/services/trade-impact-feed.ts:1)

Current request flow:

1. `PortfolioHomepage` reads the active watchlist.
2. `buildTradeImpactKeywords(...)` expands symbols into macro + asset-specific keywords.
3. The browser calls `/api/trade-impact-feed?symbols=...&keywords=...`.
4. `api/trade-impact-feed.js` pulls the existing finance digest from `/api/news/v1/list-feed-digest`.
5. Digest items are flattened, deduplicated, and ranked with `keywordScore(...)` against the watchlist-derived keyword set.
6. The top ranked headlines are passed to `/api/news/v1/summarize-article`.
7. The summarizer is called through the provider chain:
   - `ollama`
   - `groq`
   - `openrouter`
   - `generic`
8. The route parses the returned JSON payload into:
   - `headline`
   - `sentiment`
   - `impact_analysis`
   - `source`
9. If summarization fails, the route falls back to a local heuristic sentiment/impact generator.

This means the personalized portfolio feed is not a separate ingestion stack. It reuses the existing WorldMonitor news digest, then applies watchlist filtering and AI market-impact summarization on top.

### Pulse App Data Layer (`pulse-app`)

- Prisma schema: [pulse-app/prisma/schema.prisma](/Users/pratikpandey/worldmonitor/pulse-app/prisma/schema.prisma:1)
- Worker ingestion: `pulse-app/worker/src/*`
- `NewsSource`, `Article`, `ArticleEnrichment`, `Portfolio`, `WatchlistItem`, `Alert`, and `UserFeedItem` are stored in PostgreSQL.
- Worker source graph currently seeds `1248` sources and batches fetch cycles instead of pulling all feeds every pass.
- Enrichment writes ticker extraction, sentiment, key entities, and summary into `ArticleEnrichment`.

## Environment Variables

### Root `worldmonitor` App

Active keys used by the current portfolio routing + trade impact flow:

- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `OLLAMA_API_URL`
- `OLLAMA_MODEL`
- `LLM_API_URL`
- `LLM_API_KEY`
- `LLM_MODEL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `VITE_VARIANT`
- `VITE_WS_API_URL`

Additional optional operational keys still present in `.env.example` support market, relay, auth, payment, and seed features across the larger platform.

### `pulse-app`

- `DATABASE_URL`
- `REDIS_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GROQ_API_KEY`
- `GEMINI_API_KEY`
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`

### `pulse-app/worker`

- `GROQ_API_KEY`

## Build / Runtime Notes

- Root app build command: `npm run build`
- `pulse-app` build command: `pnpm build`
- Prisma / DB sync commands for `pulse-app`:
  - `npx prisma generate`
  - `npx prisma db push`

## Current Ownership Split

- `worldmonitor/`:
  - Vite SPA
  - TradeTerminal pivot UI
  - `/portfolio` landing flow
  - `api/trade-impact-feed.js`
- `pulse-app/`:
  - Next.js product workspace
  - auth
  - portfolio CRUD
  - watchlists
  - personalized feed API
  - Prisma/PostgreSQL data model
  - worker ingestion/enrichment pipeline
