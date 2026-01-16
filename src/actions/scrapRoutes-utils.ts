
import type { IPlace, IRoute, ISector } from '@/lib/db/schema';
import { removeTags } from '@/shared/utils/removeTags';

const extractNumRoutes = (str: string | number): number => {
    if (typeof str === 'number') {
        return str;
    }
    const match = str?.match(/<b>(\d+)<\/b>/);
    return match ? parseInt(match[1], 10) : 0;
};

interface Results {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const preparePlaces = (data: { result?: Results[]; }, id: number, uniqId: string ) => {
  if (!data?.result) {
    console.log('preparePlaces error: ', data, id, uniqId);
  }
  return Array.isArray(data?.result)
  ? data.result.reduce((acc, el) => {

      const numroutes = extractNumRoutes(el.numroutes);

      // Проверяем, есть ли уже элемент с таким именем
      const existingIndex = acc.findIndex((item: IPlace) => item.name === el.name);
      if (!id) {
        console.log('preparePlaces no id: ', existingIndex, el);
      }
      const place = {
        uniqId: `${uniqId}/${el.name}`,
        name: el.name,
        numroutes,
        link: el.web_guide_link,
        regionId: id,
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
    }, [] as IPlace[])
  : [];
};

export const prepareSectors = (data: { result?: Results[]; }, id: number, uniqId: string ) => Array.isArray(data?.result)
  ? data.result.reduce((acc, el) => {

      const numroutes = extractNumRoutes(el.numroutes);

      // Проверяем, есть ли уже элемент с таким именем
      const existingIndex = acc.findIndex((item: ISector) => item.name === el.name);
      const sector = {
        uniqId: `${uniqId}/${el.name}`,
        name: el.name,
        numroutes,
        link: el.web_guide_link,
        placeId: id,
      }
      if (existingIndex === -1) {
        acc.push(sector);
      } else {
        // Если есть — сравниваем количество маршрутов
        const existingNumRoutes = extractNumRoutes(acc[existingIndex].numroutes);
        if (numroutes > existingNumRoutes) {
          // Заменяем, если текущий больше
          acc[existingIndex] = sector;
        }
      }

      return acc;
    }, [] as ISector[])
  : [];

  export const prepareRoutes = (data: { images?: Results }, id: number, uniqId: string ) => Array.isArray(data?.images)
  ? data.images.reduce((acc, image) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      image?.Routes?.forEach((r: any) => {
        // Проверяем, есть ли уже элемент с таким именем
        const existingIndex = acc.findIndex((item: IRoute) => item.name === r.name && Number(item.sectorId) === id);
        const route = {
          uniqId: `${uniqId}/${r.name}`,
          name: r.name,
          link: r.web_guide_link,
          sectorLink: r.web_guide_sector_link,
          sectorId: id,
          grade: removeTags(r.grade),
          author: r.author,
          bolts: r.bolts,
          type: removeTags(r.type),
          length: removeTags(r.length),
          top: removeTags(r.top),
        }
        if (existingIndex === -1) {
          acc.push(route);
        } else {
          // Заменяем, если текущий больше
          acc[existingIndex] = route;
        }
      });
      return acc;
    }, [] as IRoute[])
  : [];

export function getImageFormat(url: string): 'jpg' | 'jpeg' | 'JPG' | 'JPEG' | null {
  const match = url.match(/\.(jpg|jpeg|JPG|JPEG)(?:[?#]|$)/);
  if (!match) return null;

  const ext = match[1];
  const validFormats: Array<'jpg' | 'jpeg' | 'JPG' | 'JPEG'> = ['jpg', 'jpeg', 'JPG', 'JPEG'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return validFormats.includes(ext as any) ? (ext as 'jpg' | 'jpeg' | 'JPG' | 'JPEG') : null;
}
