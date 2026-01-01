import type { Place } from '@/models';

const extractNumRoutes = (str: string | number): number => {
    if (typeof str === 'number') {
        return str;
    }
    const match = str?.match(/<b>(\d+)<\/b>/);
    return match ? parseInt(match[1], 10) : 0;
};

export const preparePlaces = (data: { result?: any[]; }, regionId: string, uniqId: string) => Array.isArray(data?.result)
  ? data.result.reduce((acc, el) => {

      const numroutes = extractNumRoutes(el.numroutes);

      // Проверяем, есть ли уже элемент с таким именем
      const existingIndex = acc.findIndex((item: Place) => item.name === el.name);
      const place = {
        uniqId: `${uniqId}/${el.name}`,
        name: el.name,
        numroutes,
        regionId,
        sectors: [],
      }
      if (existingIndex === -1) {
        acc.push(place);
      } else {
        // Если есть — сравниваем количество маршрутов
        const existingNumRoutes = extractNumRoutes(acc[existingIndex].numroutes);
        if (numroutes > existingNumRoutes) {
          // Заменяем, если текущий больше
          acc[existingIndex] = place;
        }
      }

      return acc;
    }, [] as Place[])
  : [];