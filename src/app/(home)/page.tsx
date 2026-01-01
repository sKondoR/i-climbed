import { SearchTabs } from './ui/SearchTabs';
import { SearchForm } from './ui/SearchForm';
import { RegionTree } from './ui/RegionTree';
import { SEARCH_TABS } from '@/shared/constants/allclimb';

export default async function Home(
  { searchParams }: { searchParams: { search?: string } }
) {
  const { search } = await searchParams;
  const isFirstTab = !search || search === SEARCH_TABS[0];
  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Поиск по имени трассы на Allclimb
      </h1>
      <SearchTabs />
      {isFirstTab ?  <SearchForm /> : <RegionTree />}
    </> 
  );
}
