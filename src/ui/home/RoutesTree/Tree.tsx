'use client';

import { useEffect, useState } from 'react';
import RecursiveTree from './RecursiveTree';
import type { IRegion } from '@/lib/db/schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { TreeNode } from '@/shared/types/RoutesTree';

export default function TreeWrapper({ regions }: { regions: IRegion[] }) {
  const [initialTreeData, setInitialTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const data = regions.map((region) => ({
      id: region.id,
      name: region.name,
      link: region.link,
      country: region.country,
      hasChildren: !!region.link,
    })).sort((a, b) => {
      // Prioritize Россия first
      if (a.country === 'Россия' && b.country !== 'Россия') return -1;
      if (a.country !== 'Россия' && b.country === 'Россия') return 1;
      // Otherwise sort alphabetically by country
      return a.country.localeCompare(b.country);
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialTreeData(data);
  }, [regions]);

  if (!regions.length) return '';

  if (initialTreeData.length === 0) {
    return (
      <div className="text-center">
        <FontAwesomeIcon size="lg" icon={faSpinner} className="text-cyan-700 animate-spin" />
        {' загрузка данных'}
      </div>
    );
  }

  return <RecursiveTree initialData={initialTreeData} />;
}
