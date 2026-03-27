/* global process */

const ALLOWED_QUERY_PARAMS = ['tickers', 'topics', 'time_from', 'time_to', 'sort', 'limit']

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY

  if (!alphaVantageApiKey) {
    return res.status(500).json({ error: 'ALPHA_VANTAGE_API_KEY is not configured on the server.' })
  }

  try {
    const params = new URLSearchParams({
      function: 'NEWS_SENTIMENT',
      apikey: alphaVantageApiKey,
    })

    ALLOWED_QUERY_PARAMS.forEach((param) => {
      const value = req.query?.[param]

      if (typeof value === 'string' && value.trim()) {
        params.set(param, value.trim())
      }
    })

    if (!params.has('sort')) {
      params.set('sort', 'LATEST')
    }

    if (!params.has('limit')) {
      params.set('limit', '50')
    }

    const upstreamResponse = await fetch(`https://www.alphavantage.co/query?${params.toString()}`)
    const data = await upstreamResponse.json().catch(() => null)

    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({
        error: data?.['Error Message'] || 'Failed to fetch news from Alpha Vantage.',
      })
    }

    if (data?.['Error Message']) {
      return res.status(400).json({ error: data['Error Message'] })
    }

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Unexpected server error while fetching finance news.',
    })
  }
}
