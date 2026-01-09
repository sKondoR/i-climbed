import { db } from '@/lib/db';
import { images } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export type ImageFilters = Partial<{
  name: string;
}>;

export class ImagesService {
  // Найти картинку трассы по unigID трассы 
  static async findOne(uniqId: string) {
    const [image] = await db
      .select()
      .from(images)
      .where(eq(images.uniqId, uniqId))
      .limit(1);
    
    return image || null;
  }
}