'use client';

import { scrapRoutes } from '@/app/actions/scrapRoutes';

export default function ScrapButton() {
  const handleScrap= async (e: React.FormEvent) => {
    e.preventDefault();
    scrapRoutes();
  };

  return (
    <button
        type="button"
        className={`w-full cursor-pointer rounded-md px-4 py-2 transition-colors
            text-white bg-blue-600 hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed
            `
        }
        onClick={handleScrap}
        // disabled
    >
        скачать данные с Allclimb
    </button>
  );
}
