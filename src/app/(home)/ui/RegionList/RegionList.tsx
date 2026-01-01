import type { IRegion } from '@/shared/types/IRegion';
import { fetchRegions } from '@/app/actions/fetchRegions';

export default async function RegionList() {
  const regions: IRegion[] = await fetchRegions();  
  return (
    <div className="p-8">
      <h1 className="font-bold mb-2">Regions</h1>
      <ul className="">
        {regions.map((region: IRegion) => (
          <li key={region.id} className="inline-block mr-2 ml-0">
            {region.name}
          </li>
        ))}
      </ul>
    </div>
  );
}