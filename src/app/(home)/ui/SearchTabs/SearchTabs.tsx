'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { TabGroup, Tab, TabList } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderTree, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SEARCH_TABS } from '@/shared/constants/allclimb.constants';

// ... imports

export default function SearchTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('search');

  // Determine index based on tab value
  const selectedIndex = tab === SEARCH_TABS[1] ? 1 : 0;

  const handleTabClick = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('search', value);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Sync default tab if no search param
  useEffect(() => {
    if (!tab) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('search', SEARCH_TABS[0]);
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [tab, pathname, router]);

  const tabClasses = "px-3 py-1 md:py-3 md:px-5 cursor-pointer select-none text-center focus-visible:outline-none";

  return (
    <div className="text-xl pr-3 md:pr-6">
      <TabGroup selectedIndex={selectedIndex} onChange={(index) => handleTabClick(SEARCH_TABS[index])}>
        <TabList className="flex">
          <div className="grow"></div>
          <Tab
            key="по названию"
            className={`${tabClasses}
              ${selectedIndex === 0 ? 'bg-white/60 backdrop-blur-md text-pink-700' : 'bg-transparent text-white hover:bg-white/30'}
            `}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} /><span className="hidden md:inline"> по названию</span>
          </Tab>
          <Tab
            key="по региону"
            className={`${tabClasses}
              ${selectedIndex !== 0 ? 'bg-white/60 backdrop-blur-md text-pink-700' : 'bg-transparent text-white hover:bg-white/30'}
            `}
          >
            <FontAwesomeIcon icon={faFolderTree} /><span className="hidden md:inline"> по региону</span>
          </Tab>
        </TabList>
      </TabGroup>
    </div>
  );
}
