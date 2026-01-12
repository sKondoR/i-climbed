import { RoutesService } from '@/lib/services/routes.service';
import { notFound } from 'next/navigation';
import { RoutePageContent } from './ui/RoutePageContent';

export default async function RoutePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  const route = await RoutesService.findOne(Number(id));
  return <RoutePageContent route={route} />;
}