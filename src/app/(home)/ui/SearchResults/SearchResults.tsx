import { getBeforeLastSlash } from '@/shared/utils/getBeforeLastSlash';
import { AllclimbLink } from '@/shared/ui/AllclimbLink';
import { ALLCLIMB_URL } from '@/shared/constants/allclimb';
import type { FoundResults } from '@/shared/types/SearchResults';

export default function SearchResults({ results }: { results: FoundResults }) {
  const hasResults =
    (results.places?.length > 0) || (results.sectors?.length > 0) || (results.routes?.length > 0);

  if (!hasResults) return null;
  return (
    <div className="flex mt-5 gap-10">
      <div className="w-1/2">
        {results.routes.length > 0 && (
          <div className="">
            <h3 className="text-lg text-pink-700 uppercase tracking-wider border-b-2 border-pink-700 mb-3">
              Трассы ({results.routes.length})
            </h3>
            <ul className="space-y-2">
              {results.routes.map((route) => (
                <li key={`route-${route.id}`}>
                    <div className="flex">
                      <div className="grow">
                        <a href={`/routes/${route.id}`} className="cursor-pointer text-cyan-700 hover:text-pink-700">{route.name}</a>
                      </div>
                      <AllclimbLink href={`${ALLCLIMB_URL}/${route.sectorLink}`}/>
                    </div>
                    <div className="text-xs text-gray-500">{getBeforeLastSlash(route.uniqId)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="w-1/2">
        {results.places.length > 0 && (
          <div className="mb-5">
            <h3 className="text-lg text-pink-700 uppercase tracking-wider border-b-2 border-pink-700 mb-3">
              Места в регионах ({results.places.length})
            </h3>
            <ul className="space-y-1">
              {results.places.map((place) => (
                <li key={`place-${place.id}`}>
                    <div className="flex">
                      <div className="grow">
                        {place.name}
                      </div>
                      <AllclimbLink href={`${ALLCLIMB_URL}/${place.link}`}/>
                    </div>
                    <div className="text-xs text-gray-500">{getBeforeLastSlash(place.uniqId)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.sectors.length > 0 && (
          <div>
            <h3 className="text-lg text-pink-700 uppercase tracking-wider border-b-2 border-pink-700 mb-3">
              Сектора ({results.sectors.length})
            </h3>
            <ul className="space-y-1">
              {results.sectors.map((sector) => (
                <li key={`sector-${sector.id}`}>
                    <div className="flex">
                      <div className="grow">
                        {sector.name}
                      </div>
                      <AllclimbLink href={`${ALLCLIMB_URL}/${sector.link}`}/>
                    </div>
                    <div className="text-xs text-gray-500">{getBeforeLastSlash(sector.uniqId)}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
