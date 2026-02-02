import type { ISettings } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScrapStats() {
  const { data, error } = useSWR<ISettings>('/api/settings', fetcher, {
    revalidateOnMount: true,
  });

  let errorText = !data?.scrapStats ? 'Нет занных о загрузке с AllClimb...' : 'Ошибка загрузки данных';

  if (!data?.scrapStats) {
    return (
      <div className="p-5 text-white/50 text-sm relative z-20">
        {error ? errorText : 'Загрузка...'}
      </div>
    );
  }

  const {
    regions,
    regionsErrors,
    places,
    placesErrors,
    sectors,
    sectorsErrors,
    routes,
    routesErrors,
    scrapDate,
    scrapDuration,
  } = data.scrapStats;

  return (
    <div className="p-5 text-white/50 text-sm relative z-20">
      <div className="grid grid-cols-3 gap-y-1">
        <div className="col-span-2 mr-2">обновление данных с Allclimb: </div>
        <div>{scrapDate}</div>

        <div className="col-span-2 mr-2">время загрузки: </div>
        <div>{scrapDuration}</div>

        <div></div>
        <div>всего</div>
        <div>ошибки</div>

        <div>регионов</div>
        <div>{regions}</div>
        <div>{regionsErrors}</div>

        <div>мест</div>
        <div>{places}</div>
        <div>{placesErrors}</div>

        <div>секторов</div>
        <div>{sectors}</div>
        <div>{sectorsErrors}</div>

        <div>трасс</div>
        <div>{routes}</div>
        <div>{routesErrors}</div>
      </div>
    </div>
  );
}