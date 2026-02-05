import { RoutesService } from '@/lib/services/routes.service';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { IRoute } from '@/lib/db/schema';
import type { ReactElement } from 'react';
import { AnimatedTitle } from '@/ui/layout/AnimatedTitle';
import { HeaderPanel } from '@/ui/layout/HeaderPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Climber } from '@/ui/layout/Climber';
import Link from 'next/link';
import { HOME } from '@/shared/constants/search.constants';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Layout from '@/pages/layout';
import { RoutePageContent } from '@/ui/routes/RoutePageContent';

type RoutePageProps = {
  route?: IRoute,
}

export const getServerSideProps = (async (context) => {
  const { id } = context.params || {};

  if (!id || Array.isArray(id)) {
    return { props: {} };
  }

  const routeId = Number(id);
  if (Number.isNaN(routeId)) {
    return { props: {} };
  }

  const route = await RoutesService.findOne(routeId);
  return {
    props: { route },
  };
}) satisfies GetServerSideProps<RoutePageProps>;

const RoutePage = ({
  route,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <RoutePageContent route={route} />;
}

RoutePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
        <AnimatedTitle>Отметь<br />Allclimb<br />трассу</AnimatedTitle>
        <HeaderPanel>
          <Link href={HOME} className="ml-50 md:ml-60 text-2xl md:text-3xl text-white hover:text-pink-700">
            <FontAwesomeIcon
                icon={faHome}     
            /> 
          </Link>
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

export default RoutePage;