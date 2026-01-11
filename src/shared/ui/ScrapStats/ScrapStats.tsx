'use client';

import type { ISettings } from '@/lib/db/schema';
import { useEffect, useState } from 'react';

export default function ScrapStats() {
  try {
    const [settings, setSettings] = useState<ISettings[]>([]);

    useEffect(() => {
      const load = async function () {
        const res = await fetch('/api/settings');
        const { data } = await res.json();
        setSettings(data);
      }
      load();
    }, []);

    if (!settings.length) return null;

    const latestStats = settings[settings.length - 1].scrapStats;

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
        <div className="grid grid-cols-3">
          <div>{scrapDate}</div>
          <div className="col-span-2">обновление данных с Allclimb</div>
          <div></div>
          <div>всего</div>
          <div>ошибки загрузки</div>
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
    } catch (error) {
    return (
      <div className="p-5 text-white/50 text-sm relative z-20">
        Ошибка загрузки статистики
      </div>
    );
  }
}
