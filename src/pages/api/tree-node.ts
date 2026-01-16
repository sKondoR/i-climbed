import { fetchTreeNode } from '@/actions/fetchTreeNode';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { level, parentId } = req.body;

      if (![0,1,2,3].includes(level) || !parentId) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: level or parentId',
        });
      }
      
      const data = await fetchTreeNode(level, parentId);
      // console.log('✅ Tree node fetched:', data);
      return res.status(200).json(data);
    } catch (error) {
      // console.error('❌ Error in POST /api/tree-node:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch tree node',
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
