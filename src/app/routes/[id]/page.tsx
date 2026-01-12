import { RoutesService } from '@/lib/services/routes.service';
import RoutePageContent from './ui/RoutePageContent/RoutePageСontent';
import { notFound } from 'next/navigation';

export default async function RoutePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  const route = await RoutesService.findOne(Number(id));
  return <RoutePageContent route={route} />;
}