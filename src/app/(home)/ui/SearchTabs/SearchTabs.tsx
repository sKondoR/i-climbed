'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  TETabs,
  TETabsItem,
} from 'tw-elements-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderTree, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SEARCH_TABS } from '@/shared/constants/allclimb';

export default function SearchTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || SEARCH_TABS[0];

  const handleTabClick = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('search', value);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Optional: Sync external changes to tab
  useEffect(() => {
    if (!searchParams.get('search')) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('search', SEARCH_TABS[0]);
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [searchParams, pathname, router]);

  return (
    <div className="border-b border-black/40 text-xl">
      <TETabs>
        <TETabsItem
          onClick={() => handleTabClick(SEARCH_TABS[0])}
          active={tab === SEARCH_TABS[0]}
          className="inline-block py-3 px-5 cursor-pointer select-none text-center border-b border-transparent text-gray-800 hover:border-blue-700 hover:text-blue-700"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} /> по названию
        </TETabsItem>
        <TETabsItem
          onClick={() => handleTabClick(SEARCH_TABS[1])}
          active={tab === SEARCH_TABS[1]}
          className="inline-block py-3 px-5 cursor-pointer select-none text-center border-b border-transparent text-gray-800 hover:border-blue-700 hover:text-blue-700"
        >
          <FontAwesomeIcon icon={faFolderTree} /> по региону
        </TETabsItem>
      </TETabs>
    </div>
  );
}