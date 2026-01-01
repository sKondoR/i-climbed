'use server';

import { ALLCLIMB_URL } from '@/shared/constants/allclimb';
import { chromium as plChromium } from 'playwright';
import chromium from '@sparticuz/chromium';
import { getDatabase } from '@/lib/database';
import { Region } from '@/models';

export async function scrapRoutes() {
  let browser;
  let context;
  try {

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
    
    await page.goto(`${ALLCLIMB_URL}/guides`);
    await page.waitForLoadState('networkidle');

    const getApiResponse = async (fUrl: string) =>
      await page.evaluate(async (url: string) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        return {
          status: response.status,
          data: await response.json()
        };
      },
    fUrl);

    const { data: { result } } = await getApiResponse(`${ALLCLIMB_URL}/guides/`);
    const results = result ? result.map((el: any) => ({
      ...el,
      link: el.web_guide_link,
      places: [],
    })) : [];

    const { getRepository } = await getDatabase();
    const regionRepo = getRepository(Region);
    // await regionRepo.clear();
    await regionRepo.createQueryBuilder().delete().execute();

    const placesDataPromises = [results[0]].map(async (place: any) => {
      try {
        const data = await fetch(`${ALLCLIMB_URL}/guides/${place.name}`);
        console.log('place data:', data);
        // Обновляем `places` у региона, если нужно
        // place.places = Array.isArray(data?.result) ? data.result : [];
      } catch (err) {
        console.error(`Failed to fetch details for ${place.name}:`, err);
        place.places = [];
      }
    });

    // Дожидаемся всех запросов
    await Promise.all(placesDataPromises);
    
    // Теперь можно обновить БД с данными о местах
    await regionRepo.save(results); // повторное сохранение с обновлёнными `places`

    // console.log('Browser fetch response:', results);
    
    return results;
    
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    throw new Error('Capture failed');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}