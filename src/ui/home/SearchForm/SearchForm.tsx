'use client';

import { useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SearchResults } from '../SearchResults';
import { useSearch } from '@/shared/hooks/useSearch';
import { MIN_SEARCH_LENGTH } from '@/shared/constants/search.constants';
import DOMPurify from 'dompurify';


export default function SearchForm() {
  const [query, setQuery] = useState('');

  const { query: { data: results, isLoading, isError }, term } = useSearch(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = DOMPurify.sanitize(value);
    setQuery(sanitizedValue);
  };

  const handleClearInput = () => {
    setQuery('');
  };

  const isNoResults = term?.trim().length >= MIN_SEARCH_LENGTH
    && term.trim() === query.trim()
    && !isError
    && !isLoading
    && !results?.places?.length
    && !results?.sectors?.length
    && !results?.routes?.length;
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
            {query && (
            <FontAwesomeIcon
              size="lg"
              icon={faTimes}
              onClick={handleClearInput}
              className="absolute text-pink-700 hover:text-pink-700 cursor-pointer top-[12px] right-[12px]"
            />
          )}
        </div>

        <button
          type="submit"
          className="rounded-md px-7 py-2 font-bold bg-cyan-700 text-white hover:text-white transition-colors hover:bg-pink-800 focus:outline-none cursor-pointer"
        >
          искать
        </button>
      </form>
      {results ? <SearchResults results={results} /> : null} 
      {isNoResults ? <div className="text-red-800 mt-1 text-sm">по &quot;{query.trim()}&quot; ничего не найдено</div> : null}
      {isError ? <div className="text-red-800 mt-1 text-sm">ошибка при поиске</div> : null}
    </>
  );
}
