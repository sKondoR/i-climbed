'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SearchResults } from '../SearchResults';
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch';

async function searchAPI(query: string, options = {}) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  return response.json();
}

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const { results, loading, error, search } = useDebouncedSearch(searchAPI);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    search(value);
  };

  const isNoResults = query?.trim().length > 3 && !loading && !results?.places.length && !results?.sectors.length && !results?.routes.length;
  return (
    <>
      <form onSubmit={handleSubmit} className="flex">
        <div className="grow mr-5 relative group">
          <input
            id="search"
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="поиск..."
            className="w-full rounded-md border-2 border-cyan-700 pl-12 pr-5 py-2 focus:border-pink-700 focus:outline-none"
            required
          />
          <FontAwesomeIcon
            size="lg"
            icon={loading ? faSpinner : faSearch}
            className={`absolute text-cyan-700 group-focus-within:text-pink-700 top-[12px] left-[12px] ${loading ? 'animate-spin' : ''}`}
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-cyan-700 px-7 py-2 text-white transition-colors hover:bg-cyan-800 focus:outline-none"
        >
          поиск
        </button>
      </form>
      <SearchResults results={results} />
      {error ? <div className="text-red-800">{error}</div> : null} 
      {isNoResults  ? <div className="text-red-800">по "{query.trim()}" ничего не найденно</div> : null}
    </>
  );
}
