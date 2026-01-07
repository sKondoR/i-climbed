import { Place } from '@/models/Place';
import { Sector } from '@/models/Sector';
import { Route } from '@/models/Route';
import { removeTags } from '@/shared/utils/removeTags';

const extractNumRoutes = (str: string | number): number => {
    if (typeof str === 'number') {
        return str;
    }
    const match = str?.match(/<b>(\d+)<\/b>/);
    return match ? parseInt(match[1], 10) : 0;
};

export const preparePlaces = (data: { result?: any[]; }, id: string, uniqId: string ) => {
  if (!data?.result) {
    console.log('preparePlaces error: ', data, id, uniqId);
  }
  return Array.isArray(data?.result)
  ? data.result.reduce((acc, el) => {

      const numroutes = extractNumRoutes(el.numroutes);

      // Проверяем, есть ли уже элемент с таким именем
      const existingIndex = acc.findIndex((item: Place) => item.name === el.name);
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
    }, [] as Place[])
  : [];
};

export const prepareSectors = (data: { result?: any[]; }, id: string, uniqId: string ) => Array.isArray(data?.result)
  ? data.result.reduce((acc, el) => {

      const numroutes = extractNumRoutes(el.numroutes);

      // Проверяем, есть ли уже элемент с таким именем
      const existingIndex = acc.findIndex((item: Sector) => item.name === el.name);
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
    }, [] as Sector[])
  : [];

  export const prepareRoutes = (data: { images?: any }, id: string, uniqId: string ) => Array.isArray(data?.images)
  ? data.images.reduce((acc, image) => {
      image?.Routes?.forEach((r: any) => {
        // Проверяем, есть ли уже элемент с таким именем
        const existingIndex = acc.findIndex((item: Route) => item.name === r.name && item.sectorId === id);
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
          length: removeTags(r.bolts),
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
    }, [] as Route[])
  : [];