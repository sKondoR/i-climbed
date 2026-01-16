import { scrapRouteImage } from '@/actions/scrapRouteImage';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { route, isUpdate } = req.body;

      if (!route) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: route',
        });
      }
      
      const isUpdateBoolean = isUpdate === true || isUpdate === 'true';
      const data = await scrapRouteImage(route, isUpdateBoolean);
      // console.log('✅ Settings fetched:', data);
      return res.status(200).json(data);
    } catch (error) {
      // console.error('❌ Error in POST /api/settings:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch settings',
        message,
        stack,
      });
    }
  } else {
    // Обработка других HTTP-методов
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

