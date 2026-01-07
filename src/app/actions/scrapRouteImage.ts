'use server';

import { ALLCLIMB_URL } from '@/shared/constants/allclimb';
import { chromium as plChromium } from 'playwright';
import chromium from '@sparticuz/chromium';
import type { IRoute } from '@/shared/types/IRoute';
import { removeLastUrlSegment } from '@/shared/utils/removeLastUrlSegment';
import { getDatabase } from '@/lib/database';
import { Image } from '@/models';
import { fetchImage } from './fetchImage';

export async function scrapRouteImage(route: IRoute) {
  let browser;
  let context;
 
  try {
    const existedImage = await fetchImage({ uniqId: route.uniqId });
    if (existedImage?.imageData) {
      return {
        ...existedImage,
        imageData: Buffer.from(existedImage.imageData).toString('base64')
      }
    }

    const { getRepository } = await getDatabase();
    const imageRepo = getRepository(Image);
    
    const executablePath = process.env.VERCEL 
        ? await chromium.executablePath()
        : plChromium.executablePath();
    console.log(`Запускаем Playwright браузер (${executablePath})...`);
    browser = await plChromium.launch({
        executablePath,
        headless: false, // Используйте false для отладки
        args: [
          '--no-sandbox',                    // Отключает sandbox-защиту Chromium. Полезно в изолированных средах (например, Docker), где sandbox может вызывать проблемы. ⚠️ Опасно в ненадёжных окружениях.
          '--disable-setuid-sandbox',        // Отключает setuid sandbox, который иногда несовместим с контейнерами.
          '--disable-dev-shm-usage',         // Заставляет использовать временные файлы вместо /dev/shm, что полезно при ограниченной памяти в Docker (по умолчанию /dev/shm маленький).
          '--disable-gpu',                   // Отключаеsт GPU-ускорение. Уменьшает потребление памяти и предотвращает ошибки в headless-режиме (где нет графического интерфейса).
          '--single-process',                // Запускает весь браузер в одном процессе. Экономит память, но может снизить стабильность (падение одного таба — падение всего браузера).
          '--disable-web-security',          // Отключает политику одинакового происхождения (same-origin policy). Полезно для тестов, но ⚠️ делает браузер уязвимым к XSS и другим атакам.
          '--disable-features=IsolateOrigins,site-per-process', // Отключает изоляцию происхождений и режим "по сайту — отдельный процесс", что может помочь обойти некоторые CORS-ограничения.
        ],
    }); 

    context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    const page = await context.newPage();

      // Блокировка ресурсов для ускорения
      await page.route('**/*', (route) => {
        const resourceType = route.request().resourceType();
        // const blockedResources = ['image', 'stylesheet', 'font', 'media'];
        const blockedResources: string[] = [];
        if (blockedResources.includes(resourceType)) {
          route.abort();
        } else {
          route.continue();
        }
      });

      console.log('Переход на страницу сектора...');
      // Переход на страницу с полем поиска
      await page.goto(`${ALLCLIMB_URL}${route.link}`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });

      const errorLocator = page.getByText(/Server Error \(500\)/);
      if (await errorLocator.count()) {
        const routeImg = await imageRepo.save({
          uniqId: route.uniqId,
          routeId: route.id,
          error: 'Изображение трассы недоступно на AllClimb',
        });
        return routeImg;
      }

      const parsedImageUrl = await page.locator('.route-portrait img')
        .getAttribute('src') || '';

      const imageUrl = parsedImageUrl
        .replace('.JPG', '.jpg')
        .replace('.JPEG', '.jpeg');
      console.log(imageUrl);

      // Возвращаемся на предыдущую страницу
      await page.goto(`${ALLCLIMB_URL}${removeLastUrlSegment(route.link)?.replace('route', 'guides')}`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });

      // Наведение на элемент
      await page
        .locator('.items-preview')
        .filter({ hasText: route.name })
        .first()
        .hover();
      // иногда ховер не успевает сработать без ожидания
      await page.waitForTimeout(3000);

      const format = imageUrl.includes('.jpg') ? '.jpg' : '.jpeg';
      const imgLocator = page.locator(`img[src*="${imageUrl.split(format)[0]}${format}"]`);
      const imgBox = await imgLocator.boundingBox();
      if (!imgBox) {
        throw new Error('Не удалось получить координаты изображения');
      }
      const screenshotBox = {
        x: imgBox.x, 
        y: imgBox.y,  
        width: imgBox.width,
        height: Math.max(1, imgBox.height - 20),
      };

      const screenshotBuffer = await page.screenshot({
        // encoding: 'binary',
        clip: screenshotBox,
        type: 'jpeg',
      });

      const routeImg = await imageRepo.save({
        uniqId: route.uniqId,
        routeId: route.id,
        imageData: screenshotBuffer,
      });

      return {
        ...routeImg,
        imageData: Buffer.from(routeImg.imageData).toString('base64')
      }
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    throw new Error('Capture failed');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}