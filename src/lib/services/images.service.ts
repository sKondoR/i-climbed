import { db } from '@/lib/db';
import { images, type IImage, type IRoute } from '@/lib/db/schema';
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

  static async updateOrCreate(existedImage: IImage, route: IRoute, imageData: string) {
    let image;
    if (existedImage) {
        // Обновляем существующую запись
        const [updatedImage] = await db
          .update(images)
          .set({
            imageData,
            error: null,
          })
          .where(eq(images.uniqId, route.uniqId))
          .returning();
        image = updatedImage;
      } else {
        // Вставляем новую
        const [insertedImage] = await db
          .insert(images)
          .values({
            uniqId: route.uniqId,
            routeId: route.id,
            imageData,
            error: null,
          })
          .returning();
        image = insertedImage;
      }
    
    return image || null;
  }
}