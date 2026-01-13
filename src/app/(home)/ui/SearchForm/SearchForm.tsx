'use client';

import { useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SearchResults } from '../SearchResults';
import { useSearch } from '@/shared/hooks/useSearch';


export default function SearchForm() {
  const [query, setQuery] = useState('');

  const { data: results, isLoading, isError } = useSearch(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const isNoResults =query?.trim().length >= 3
    && !isLoading
    && !results?.places.length
    && !results?.sectors.length
    && !results?.routes.length;
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
            icon={isLoading ? faSpinner : faSearch}
            className={`absolute text-cyan-700 group-focus-within:text-pink-700 top-[12px] left-[12px] ${isLoading ? 'animate-spin' : ''}`}
          />
        </div>

        <button
          type="submit"
          className="rounded-md px-7 py-2 font-bold bg-cyan-800 text-white hover:text-white transition-colors hover:bg-pink-800 focus:outline-none cursor-pointer"
        >
          искать
        </button>
      </form>
      {!isNoResults && results ? <SearchResults results={results} /> : <div className="text-red-800">по "{query.trim()}" ничего не найденно</div>}
      {isError ? <div className="text-red-800">ошибка при поиске</div> : null}
    </>
  );
}
