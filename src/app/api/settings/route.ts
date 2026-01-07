import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/database';
import { Settings } from '../../../models/Settings';

export async function GET(request: NextRequest) {
  const { getRepository } = await getDatabase();
  const settingsRepo = getRepository(Settings);
  console.log('Settings', Settings);
  try {
    const settings = await settingsRepo.find({
      where: {},
    });
    console.log('settings> ', settings);
    return Response.json(settings);
  } catch (err) {
    console.error('DB Query failed:', err);
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
