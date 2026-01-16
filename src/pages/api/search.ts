import { SearchService } from '@/lib/services/search.service';
import { initialSearchResults } from '@/shared/constants/search.constants';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  const query = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;

  if (!query) {
    return res.status(200).json(initialSearchResults);
  }

  const abortPromise = new Promise<never>((_, reject) => {
    req.on('aborted', () => reject(new Error('Request aborted')));
  });

  try {
    const results = await Promise.race([SearchService.searchByName(query), abortPromise]);
    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof Error && error.message === 'Request aborted') {
      res.status(499).end();
      return;
    }
    console.error('Search API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}