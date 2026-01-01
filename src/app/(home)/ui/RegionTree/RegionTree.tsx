import type { IRegion, IRegionNode } from '@/shared/types/IRegion';
import { fetchRegions } from '@/app/actions/fetchRegions';
import { TreeViewComponent } from './TreeViewComponent';
// import { fetchRegionChildren } from '@/actions/fetchRegionChildren'; // Предполагаем, что такая функция существует

export default async function RegionTree() {
  // Изначально загружаем все регионы (корневые)
  const regions: IRegion[] = await fetchRegions();

  // Преобразуем в древовидную структуру (упрощённо: предполагаем, что у регионов есть parentId)
  const buildTree = (regions: IRegion[]): IRegionNode[] => {
    const map = new Map<string, IRegionNode>();
    const roots: IRegionNode[] = [];

    // Инициализируем все узлы 
    regions.forEach(region => {
      map.set(region.id, {
        id: region.id,
        name: region.name, 
        country: region.country, 
        uniqId: region.uniqId,
        children: region.children?.map((el) => ({ id: el.id, name: el.name })),
      });
    });

    // Строим дерево
    regions.forEach((region) => {
      if (!region.country) {
        const parent = map.get(region.id);
        if (parent) {
          parent.children?.push(map.get(region.id)!);
        }
      } else {
        roots.push(map.get(region.id)!);
      }
    });

    return roots;
  };

  const treeData: IRegionNode[] = buildTree(regions);

  console.log('treeData: ', treeData[0])
  return <TreeViewComponent data={treeData} />;
}
