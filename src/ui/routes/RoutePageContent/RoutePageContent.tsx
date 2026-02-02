'use client';

import { lazy, useCallback, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import type { IImage, IRoute } from '@/lib/db/schema';
import { PageDescription } from '@/ui/layout/PageDescription';

import { getBeforeLastSlash } from '@/shared/utils/getBeforeLastSlash';
import { getRegionFromRouteUniqId } from '@/shared/utils/getRegionFromRouteUniqId';
import { AllclimbLink } from '@/shared/ui/AllclimbLink';
import { RouteBadge } from '@/shared/ui/RouteBadge';
import { ClientOnly } from '@/shared/ui/ClientOnly';
import { ErrorButton } from '@/ui/layout/ErrorButton';

const LazyMFEditImage = lazy(async () => {
  try {
    const EditImage = await import('microfrontend/EditImage');
    return EditImage;
  } catch (error) {
    console.error('Failed to load remote EditImage:', error);
    return {
      default: () => <div>Failed to load remote EditImage</div>,
    };
  }
});

export default function RoutePageContent({ route }: { route?: IRoute }) {

  const [image, setImage] = useState<IImage | null>(null);
  const loadImage = useCallback(async (isUpdate: boolean) => {
    if (!route) {
      return;
    }
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ route, isUpdate }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }

      const img: IImage = await response.json();
      setImage(img);
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
    }
  }, [route]);

  const reloadImage = () => {
    setImage(null);
    loadImage(true);
  }

  useEffect(() => {
    if (!route) return;
    loadImage(false);
  }, [route, loadImage]);

  const reportError = useCallback(async () => {
    if (!route?.sectorLink) {
      return;
    }
    try {
      const response = await fetch('/api/report-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'image',
          url: route?.sectorLink,
          text: `ошибка загрузки изображения трассы: ${route?.name}`
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Ошибка отправки ошибки:', error);
    }
  }, [route]);

  if (!route) {
    return (<div className="mt-3">
      <PageDescription>
          <h2 className="text-2xl md:text-3xl text-pink-700">трасса не найдена</h2>
      </PageDescription>
    </div>);
  }
  return (
    <>
      <div className="mt-3">
        <PageDescription>
          {route?.grade ? <div><RouteBadge grade={route.grade} /></div> : null}
          <div className="grow ml-3">
            <h2 className="inline text-2xl md:text-3xl text-pink-700">{route?.name}</h2> {route?.type?.toLowerCase()} <AllclimbLink href={route?.sectorLink || ''} />
            <div>{getBeforeLastSlash(route?.uniqId)}</div>
            <div>{route?.length}</div>
          </div>
        </PageDescription>
        <div className="flex justify-center">
          {route && !image ? <>
            <FontAwesomeIcon size="lg"
              icon={faSpinner}
              className={`text-cyan-700 animate-spin`}
            /> загрузка изображения
          </> : null}
          {route?.grade && route?.uniqId && image?.imageData && LazyMFEditImage && <ClientOnly>
            <LazyMFEditImage
              imgSrc={`data:image/png;base64,${image.imageData}`}
              name={route.name}
              region={getRegionFromRouteUniqId(route.uniqId)}
              grade={route.grade}
            />
          </ClientOnly>}
        </div>
        {image?.imageData ? <div className="flex justify-center mt-3">
          <button
            type="button"
            className="rounded-md px-7 py-2 font-bold bg-cyan-800 text-white hover:text-white transition-colors hover:bg-pink-800 focus:outline-none cursor-pointer"
            onClick={reloadImage}
          >
            обновить изображение
          </button>
        </div>
        : null}
        {route?.sectorLink && (<div className="flex justify-center mt-3">
          <ErrorButton
          onClick={reportError}
          title="сообщить об ошибке загрузки изображения"
          />
        </div>)}
      </div>
    </>
  );
}