'use server';

import { RoutesService } from '@/lib/services/routes.service';
import { SectorsService } from '@/lib/services/sectors.service';
import { PlacesService } from '@/lib/services/places.service';
import type { TreeNode } from '@/shared/types/RoutesTree.types';

const fetchTreeData = async (level: number, parentId: number | undefined) => {
  switch (level) {
    case 0:
      return await PlacesService.find({ regionId: parentId });
    case 1:
      return await SectorsService.find({ placeId: parentId });
    case 2:
      return await RoutesService.find({ sectorId: parentId });
    default:
      throw new Error(`Unsupported level: ${level}`);
  }
};

export async function fetchTreeNode(level: number, parentId?: number): Promise<TreeNode[]> {
  const data = await fetchTreeData(level, parentId);
  const preparedData = data.map((el) => ({
    id: el.id,
    uniqId: el.uniqId,
    name: el.name,
    link: el.link,
    numroutes: 'numroutes' in el ? el.numroutes : null,
    hasChildren: !!el.link,
  }));
  return preparedData;
}

