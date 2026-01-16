import type { ISettings } from '@/lib/db/schema';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScrapStats() {
  const { data, error } = useSWR<ISettings[]>('/api/settings', fetcher, {
    refreshInterval: 60000, // Auto-refresh every 60 sec
    revalidateOnMount: true,
  });

  if (!data || data.length === 0) {
    return (
      <div className="p-5 text-white/50 text-sm relative z-20">
        {error ? 'Ошибка загрузки' : 'Загрузка...'}
      </div>
    );
  }

  const latestStats = data[data.length - 1].scrapStats;
  if (!latestStats) {
    return (
      <div className="p-5 text-white/50 text-sm relative z-20">
        Нет данных статистики
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
  } = latestStats;

  return (
    <div className="p-5 text-white/50 text-sm relative z-20">
      <div className="grid grid-cols-3 gap-y-1">
        <div>{scrapDate}</div>
        <div className="col-span-2">обновление данных с Allclimb</div>

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