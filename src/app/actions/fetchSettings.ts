'use server';
import { getDatabase } from '@/lib/database';
import { Settings } from '@/models/Settings';
import type { ISettings } from '@/shared/types/ISettings';

export async function fetchSettings(): Promise<ISettings[]> {
  const { getRepository } = await getDatabase();
  const settingsRepo = getRepository(Settings);
  
  const settings = await settingsRepo.find({
    where: {},
  });
  return settings;
}

