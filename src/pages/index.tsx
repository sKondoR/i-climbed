'use client'

import { Suspense, type ReactElement } from 'react';
import Layout from './layout';
// import type { NextPageWithLayout } from './_app';
import { AnimatedTitle } from '@/ui/layout/AnimatedTitle';
import { HeaderPanel } from '@/ui/layout/HeaderPanel';
import { SearchTabs } from '@/ui/home/SearchTabs';
import { Climber } from '@/ui/layout/Climber';
import type { IRegion } from '@/lib/db/schema';
import { SEARCH_TABS } from '@/shared/constants/search.constants';
import { PageDescription } from '@/ui/layout/PageDescription';
import { SearchForm } from '@/ui/home/SearchForm';
import { RoutesTree } from '@/ui/home/RoutesTree';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { RegionsService } from '@/lib/services/regions.service';


type HomePageProps = {
  regions: IRegion[],
  search?: string | null,
}

export const getServerSideProps = (async (context) => {
  const regions = await RegionsService.find();
  return { props: {
    regions,
    search: typeof context.query.search === 'string' ? context.query.search : null
  } }
}) satisfies GetServerSideProps<HomePageProps>

const HomePage = ({
  regions,
  search,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const isFirstTab = !search || search === SEARCH_TABS[0];
  return (
    <>
      <Suspense fallback={<div></div>}>
        <div className="mt-3">
          <PageDescription>
            <div className="w-full text-right">поиск трасс, секторов и регионов с Allclimb</div>
          </PageDescription>
          {!regions.length && <div className="text-red-700 text-center">Нет данных о регионах с AllClimb, обновите базу...</div>}
          {isFirstTab
            ? <SearchForm />
            : <RoutesTree regions={regions} />
          }
        </div>
      </Suspense>
    </> 
  );
}
 
HomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
        <AnimatedTitle>Поиск<br />Allclimb<br />трасс</AnimatedTitle>
        <HeaderPanel>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchTabs />
            </Suspense>
        </HeaderPanel>      
        <Climber />
        <div className="bg-white/60 backdrop-blur-md rounded-sm shadow-2xl transition-all duration-300 hover:shadow-3xl relative z-2">
          <div className="border-white/30 rounded-sm py-4 px-3 md:px-6 md:py-6 hover:border-white/50 transition-colors overflow-hidden">
            {page}
          </div>
        </div>
    </Layout>
  )
}
 
export default HomePage;