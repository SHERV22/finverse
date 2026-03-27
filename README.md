# Finverse

Finverse is a React + Vite personal finance app with Vercel Serverless Functions for:

- GET /api/health
- GET /api/finance-news
- POST /api/send-report

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and set values:

```bash
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=verified_sender@example.com
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

3. Start frontend dev server:

```bash
npm run dev
```

4. Optional: run Vercel local serverless runtime (frontend + /api routes):

```bash
npm run dev:server
```

## Required Environment Variables

Set these in Vercel project settings and local env files:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ALPHA_VANTAGE_API_KEY`

Do not expose these as `VITE_*` variables.

## Deploy To Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Framework preset: Vite (auto-detected).
4. Add the three environment variables above in Vercel settings.
5. Deploy.

Vercel will build the frontend via `vite build` and serve API routes from the `api/` directory as serverless functions.

## API Notes

- `GET /api/health` returns:

```json
{ "ok": true, "service": "finverse-email-api" }
```

- `GET /api/finance-news` proxies Alpha Vantage NEWS_SENTIMENT and supports query params:
	`tickers`, `topics`, `time_from`, `time_to`, `sort`, `limit`.
	Defaults: `sort=LATEST`, `limit=50`.

- `POST /api/send-report` expects JSON body:
	`recipientEmail`, `periodLabel`, `summary`, `pdfBase64`, optional `reportFileName`.

## Payload Size Limit

`/api/send-report` accepts base64 PDF content. Vercel Serverless Functions have request payload limits, so large base64 PDFs can exceed platform limits and fail. Keep generated PDFs reasonably small.
