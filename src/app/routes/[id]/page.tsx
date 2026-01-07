'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PageDescription } from '@/app/ui/PageDescription';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { IRoute } from '@/shared/types/IRoute';
import { fetchRoute } from '@/app/actions/fetchRoute';
import { RouteBadge } from '@/shared/ui/RouteBadge';
import { getBeforeLastSlash } from '@/shared/utils/getBeforeLastSlash';
import { scrapRouteImage } from '@/app/actions/scrapRouteImage';
import type { IImage } from '@/shared/types/IImage';

type IState = 'found' | 'not-found' | 'loading';

export default function RoutePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [state, setState] = useState<IState>('loading');
  const [route, setRoute] = useState<IRoute | null>(null);
  const [image, setImage] = useState<IImage | null>(null);

  useEffect(() => {
    try {
      async function load() {
        const data = await fetchRoute({ id });
        if (data) {
          setRoute(data);
          setState('found');  
        } else {
          setState('not-found');
        }   
      };  
      load();   
    } catch (err) {
      setState('not-found');
    }
  }, [id]);

  useEffect(() => {
    async function load() {
      if (!route) return;
      const img = await scrapRouteImage(route);
      setImage(img);
    }
    load();
  }, [route]);

  if (!route && state === 'not-found') {
    return (<div className="mt-3">
      <PageDescription>
        {state === 'not-found' ? 
          <h2 className="text-3xl text-pink-700">'трасса не найденна'</h2>
          : <>
            <FontAwesomeIcon size="lg"
              icon={faSpinner}
              className={`text-cyan-700 animate-spin`}
            />
            загрузка трассы...
          </>
        }
      </PageDescription>
    </div>);
  }
  return (
    <>
      <div className="mt-3">
        <PageDescription>
          {route?.grade ? <RouteBadge grade={route.grade} /> : null}
          <div className="grow ml-3">
            <h2 className="text-3xl text-pink-700">{route?.name}</h2>
            <div>{getBeforeLastSlash(route?.uniqId)}</div>
          </div>
        </PageDescription>
        <div className="flex justify-center">
          {route && !image ? <>
            <FontAwesomeIcon size="lg"
              icon={faSpinner}
              className={`text-cyan-700 animate-spin`}
            /> загрузка изображения
          </> : null}
          {route && image?.imageData ? 
            <img
              src={`data:image/png;base64,${image.imageData}`}
            />
          : image?.error}
        </div>
      </div>
    </>
  );
}