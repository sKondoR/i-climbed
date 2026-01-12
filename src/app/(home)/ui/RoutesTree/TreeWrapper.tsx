'use client'

import { useEffect, useState } from 'react';
import RecursiveTree from './Tree';
import type { IRegion } from '@/lib/db/schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function TreeWrapper() {
  const [regions, setRegions] = useState<IRegion[]>([]);

  useEffect(() => {
    const load = async function () {
      const res = await fetch('/api/regions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            country: 'ASC',
            name: 'ASC',
          },
        }),
      });
      const { data } = await res.json();
      setRegions(data);
    }
    if (!regions.length) {
      load();
    }
  }, [regions.length]);
  
  const initialTreeData = regions.map((region) => ({
    id: region.id,
    name: region.name,
    link: region.link,
    country: region.country,
    hasChildren: !!region.link,
  })) as TreeNode[];

  return (
    <>
    {initialTreeData.length > 0 ? (
      <RecursiveTree 
        initialData={initialTreeData}
      />) : (
        <div className="text-center"><FontAwesomeIcon size="lg"
            icon={faSpinner}
            className={`text-cyan-700 animate-spin`}
        /> загрузка данных</div> 
      )}
    </>    
  );
}