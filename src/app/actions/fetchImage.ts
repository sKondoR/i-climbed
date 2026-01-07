'use server';
import { getDatabase } from '@/lib/database';
import { Image } from '@/models/Image';
import type { IImage } from '@/shared/types/IImage';

export async function fetchImage<T extends keyof IImage>(
  whereParams: Partial<Record<T, IImage[T]>>
): Promise<IImage | null> {  
  const where = whereParams || {};
  const { getRepository } = await getDatabase();
  const imageRepo = getRepository(Image);
  
  const image = await imageRepo.findOne({
    where,
    order: {
      id: 'ASC',
    },
  });
  return image ? { ...image } : null;
}

