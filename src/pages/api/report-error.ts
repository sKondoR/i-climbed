import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { errors, type IError } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { type, text, url } = req.body;
        await db.insert(errors).values({
            type,
            text,
            url,
            created: new Date().toISOString(),
        } as IError).execute();

        return res.status(200).json({ success: true }); 
  } else if (req.method === 'GET') {
        const data = await db
            .select()
            .from(errors)
            .orderBy(asc(errors.id));
        return res.status(200).json(data);;
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}