'use client';

import { useEffect, useState } from 'react';
import { PageDescription } from '@/app/ui/PageDescription';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RouteBadge } from '@/shared/ui/RouteBadge';
import { getBeforeLastSlash } from '@/shared/utils/getBeforeLastSlash';
import { getRegionFromRouteUniqId } from '@/shared/utils/getRegionFromRouteUniqId';
import { scrapRouteImage } from '@/app/actions/scrapRouteImage';
import EditImage from '@/shared/ui/EditImage/EditImage';
import type { IImage, IRoute } from '@/lib/db/schema';

export default function RoutePageContent({ route }: { route: IRoute }) {

  const [image, setImage] = useState<IImage | null>(null);

  useEffect(() => {
    async function load() {
      if (!route) return;
      const img = await scrapRouteImage(route);
      setImage(img);
    }
    load();
  }, [route]);

  if (!route) {
    return (<div className="mt-3">
      <PageDescription>
          <h2 className="text-3xl text-pink-700">'трасса не найденна'</h2>
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
          {route?.grade && route?.uniqId && image?.imageData ? 
            <div>
              <EditImage
                imgSrc={`data:image/png;base64,${image.imageData}`}
                name={route.name}
                region={getRegionFromRouteUniqId(route.uniqId)}
                grade={route.grade}
              />
            </div>
          : image?.error}
        </div>
      </div>
    </>
  );
}