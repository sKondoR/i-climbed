'use client';

import { useState, useEffect, useRef } from 'react';
import useDebounce from '@/shared/hooks/useDebounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SearchResults } from '../SearchResults';
import type { FoundResults } from '@/shared/types/SearchResults';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<FoundResults>({
    places: [],
    sectors: [],
    routes: [],
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);

  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data || { places: [], sectors: [], routes: [] });
      setIsOpen(true);
    } catch (error) {
      setResults({ places: [], sectors: [], routes: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    } else {
      setResults({ places: [], sectors: [], routes: [] });
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    } else {
      setResults({ places: [], sectors: [], routes: [] });
      setIsOpen(false);
    }
  };

  return (
    <>
    <form className="flex" ref={dropdownRef}>
      <div className="grow mr-5 relative group">
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="поиск..."
          className="w-full rounded-md border-2 border-cyan-700 pl-12 pr-5 py-2 focus:border-pink-700 focus:outline-none"
          required
        />
        <FontAwesomeIcon size="lg"
          icon={loading ? faSpinner : faSearch}
          className={`absolute text-cyan-700 group-focus-within:text-pink-700 top-[12px] left-[12px] ${loading ? 'animate-spin' : ''}`}
        />
      </div>

      <button
        type="button"
        className="rounded-md bg-cyan-700 px-7 py-2 text-white transition-colors hover:bg-cyan-800 focus:outline-none cursor-pointer"
        onClick={handleSubmit}
      >
        поиск
      </button>
    </form>
    <SearchResults results={results} />
  </>);
}
