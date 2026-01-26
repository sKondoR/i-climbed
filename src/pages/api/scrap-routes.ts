import { scrapRoutes } from '@/actions/scrapRoutes';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await scrapRoutes();
      console.log('✅ Scraping fetched:', data);
      return res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error in GET /api/scrap-routes:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      return res.status(500).json({
        success: false,
        error: 'Failed to scrap',
        message,
        stack,
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
