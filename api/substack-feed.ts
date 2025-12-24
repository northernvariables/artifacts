import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const feedUrl = 'https://substack.northernvariables.ca/feed'
    const response = await fetch(feedUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`)
    }

    const feedContent = await response.text()

    // Set CORS headers to allow browser access
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')

    return res.status(200).send(feedContent)
  } catch (error) {
    console.error('Error fetching Substack feed:', error)
    return res.status(500).json({
      error: 'Failed to fetch Substack feed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
